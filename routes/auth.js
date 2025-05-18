const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Friend = require('../models/Friend');
const Follower = require('../models/Follower');
const LoginRecord = require('../models/LoginRecord');
const { body, validationResult } = require('express-validator');

const getClientIp = (req) => {
  let ip = req.ip || 
          req.headers['x-forwarded-for'] || 
          req.connection.remoteAddress || 
          req.socket.remoteAddress ||
          (req.connection.socket ? req.connection.socket.remoteAddress : null);

  if (ip && ip.includes('::ffff:')) {
    ip = ip.split(':').pop(); // извлечение ip4 из ip6
  }
  
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  return ip || 'unknown';
};

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

router.post('/register', [
  body('email').isEmail().withMessage('Некорректный email'),
  body('username').isLength({ min: 3 }).withMessage('Логин слишком короткий!'),
  body('password').isLength({ min: 8 }).withMessage('Пароль слишком короткий! Учтите требования!'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
  }
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Логин';
      return res.status(400).json({ 
        success: false,
        error: `${field} уже используется!` 
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });
    await user.save();
    const generateToken = (userId) => {
      const payload = { user: { id: userId } };
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
    };
    const token = generateToken(user.id);
    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
    generateToken(user.id, res);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        errors
      });
    }
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Неверный email или пароль!' });
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
      return res.status(400).json({ msg: 'Неверный пароль!' });
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

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

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