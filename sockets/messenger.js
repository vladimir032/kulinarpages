const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

const onlineUsers = new Map(); // userId -> socketId
const typingUsers = new Map(); // chatId -> Set<userId>

function initSockets(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Auth required'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id || payload._id || payload.userId;
      if (!socket.userId) return next(new Error('Auth failed'));
      onlineUsers.set(socket.userId, socket.id);
      next();
    } catch (err) {
      next(new Error('Auth failed'));
    }
  });

  io.on('connection', (socket) => {
    // Статус онлайн
    io.emit('online', Array.from(onlineUsers.keys()));

    // Подписка на чат
    socket.on('join', (chatId) => {
      socket.join(chatId);
    });
    socket.on('leave', (chatId) => {
      socket.leave(chatId);
    });

    // Сообщение
    socket.on('message', async ({ chatId, text }) => {
      if (!chatId || !text || !socket.userId) return;
      const message = await Message.create({
        chat: chatId,
        sender: socket.userId,
        text,
        read: false
      });
      await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });
      io.to(chatId).emit('message', message);
    });

    // Индикатор набора
    socket.on('typing', ({ chatId, isTyping }) => {
      if (!chatId) return;
      if (!typingUsers.has(chatId)) typingUsers.set(chatId, new Set());
      const set = typingUsers.get(chatId);
      if (isTyping) {
        set.add(socket.userId);
      } else {
        set.delete(socket.userId);
      }
      io.to(chatId).emit('typing', Array.from(set));
    });

    // Отключение
    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
      io.emit('online', Array.from(onlineUsers.keys()));
      // Убираем из typing
      for (const set of typingUsers.values()) {
        set.delete(socket.userId);
      }
    });
  });
}

module.exports = { initSockets };
