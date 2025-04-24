const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  user: { // подписчик
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  follower: { // на кого подписан пользователь
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Follower', followerSchema);
