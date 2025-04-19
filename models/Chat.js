const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  createdAt: { type: Date, default: Date.now },
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message', default: null }
});

module.exports = mongoose.model('Chat', ChatSchema);
