const express = require('express');
const router = express.Router();
const { body, param, validationResult, query } = require('express-validator');
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const sanitizeHtml = require('sanitize-html');

const checkChatAccess = async (req, res, next) => {
  const chatId = req.params.chatId || req.body.chat;

  if (req.path.includes('unread-count')) {
    return next();
  }
  
  if (!chatId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Неверный формат chatId' });
  }
  
  const chat = await Chat.findById(chatId);
  if (!chat || !chat.participants.includes(req.user.id)) {
    return res.status(403).json({ error: 'Нет доступа к чату' });
  }
  
  next();
};

router.get('/messages/unread-count', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id });
    const chatIds = chats.map(chat => chat._id);
    
    const count = await Message.countDocuments({
      chat: { $in: chatIds },
      read: false,
      sender: { $ne: req.user.id }
    });
    
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/chats', auth, async (req, res) => {
  const chats = await Chat.find({ participants: req.user.id })
    .populate({
      path: 'participants',
      select: 'username avatar',
    })
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'username avatar' },
    })
    .sort('-lastMessage.createdAt');
  res.json(chats);
});

router.get('/messages/:chatId', auth, checkChatAccess, [
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req, res) => {
  const limit = req.query.limit || 20;
  const messages = await Message.find({ chat: req.params.chatId })
    .populate('sender', 'username avatar')
    .sort('-createdAt')
    .limit(limit)
    .lean();
  res.json(messages.reverse()); 
});

router.post(
  '/messages',
  auth,
  body('chat').isMongoId(),
  body('text').isString().trim().notEmpty(),
  checkChatAccess,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const text = sanitizeHtml(req.body.text, { allowedTags: [], allowedAttributes: {} });
    let message = await Message.create({
      chat: req.body.chat,
      sender: req.user.id,
      text,
      read: false
    });
    message = await message.populate('sender', 'username avatar');
    await Chat.findByIdAndUpdate(req.body.chat, { lastMessage: message._id });
    res.json(message);
  }
);

router.put('/messages/read', auth, [
  body('chat').isMongoId()
], async (req, res) => {
  const { chat } = req.body;
  await Message.updateMany({ chat, read: false, sender: { $ne: req.user.id } }, { read: true });
  res.json({ success: true });
});

// создаем чат
router.post('/chats', auth, body('userId').isMongoId(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.body.userId;
  if (userId === req.user.id) {
    return res.status(400).json({ error: 'Нельзя создать чат с собой' });
  }
  let chat = await Chat.findOne({ participants: { $all: [req.user.id, userId], $size: 2 } });
  if (!chat) {
    chat = await Chat.create({ participants: [req.user.id, userId] });
  }
  chat = await Chat.findById(chat._id)
    .populate({ path: 'participants', select: 'username avatar' })
    .populate({ path: 'lastMessage', populate: { path: 'sender', select: 'username avatar' } });
  res.json(chat);
});

module.exports = router;
