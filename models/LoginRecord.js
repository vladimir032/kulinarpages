const mongoose = require('mongoose');

const loginRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  loginAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LoginRecord', loginRecordSchema);
