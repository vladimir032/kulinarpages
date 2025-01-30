const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [{
    name: String,
    amount: String
  }],
  instructions: [{
    type: String
  }],
  imageUrl: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Легко', 'Средне', 'Сложно'],
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  prepTime: {
    type: Number,  // in minutes
    required: true,
    min: 1,
    max: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Салаты', 'Десерты', 'Супы', 'Пиццы', 'Напитки', 'Горячее']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
