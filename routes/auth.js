const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const LoginRecord = require('../models/LoginRecord');

// Функция для получения IP-адреса клиента
const getClientIp = (req) => {
  let ip = req.ip || 
          req.headers['x-forwarded-for'] || 
          req.connection.remoteAddress || 
          req.socket.remoteAddress ||
          (req.connection.socket ? req.connection.socket.remoteAddress : null);

  // Преобразование IPv6 в IPv4 если нужно
  if (ip && ip.includes('::ffff:')) {
    ip = ip.split(':').pop(); // Извлекаем IPv4 часть
  }
  
  // Если IP это список (x-forwarded-for может содержать несколько адресов)
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  return ip || 'unknown';
};

// Функция для создания JWT токена
const generateToken = (userId, res) => {
  const payload = { user: { id: userId } };
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '5h' },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
};

// Функция для записи истории входа
const recordLogin = async (user, req) => {
  const ipAddress = getClientIp(req);
  const loginRecord = new LoginRecord({
    userId: user._id,
    email: user.email,
    username: user.username,
    ip: ipAddress,
    userAgent: req.headers['user-agent']
  });
  await loginRecord.save();
};

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password,
      role: 'user'
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    generateToken(user.id, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ msg: 'В связи с нарушением правил платформы, вы были заблокированы.' });
    }

    if (user.restrictionUntil && user.restrictionUntil > new Date()) {
      return res.status(403).json({ 
        msg: `Ваша учетная запись была ограничена до ${user.restrictionUntil.toLocaleDateString()}.` 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    await recordLogin(user, req);
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();
    generateToken(user.id, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/login-history
// @desc    Get user login history
// @access  Private
router.get('/login-history', auth, async (req, res) => {
  try {
    const history = await LoginRecord.find({ userId: req.user.id })
      .sort({ loginAt: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;