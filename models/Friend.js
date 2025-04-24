const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Метод для подтверждения заявки в друзья
friendSchema.methods.acceptRequest = function() {
  this.status = 'accepted';
  return this.save();
};

// Метод для отклонения заявки в друзья
friendSchema.methods.rejectRequest = function() {
  this.status = 'rejected';
  return this.save();
};

module.exports = mongoose.model('Friend', friendSchema);
