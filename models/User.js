const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  likesCount: {
    type: Number,
    default: 0
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  lastLoginIp: {
    type: String,
    default: ''
  },
  ipAddresses: [{
    type: String
  }],
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  savedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  isBlocked: {
    type: Boolean,
    default: false
  },
  restrictionUntil: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: '' 
  },
  status: {
    type: String,
    enum: ['готовлю', 'жду вдохновения', 'ищу рецепт'],
    default: 'готовлю'
  },
  about: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['мужской', 'женский', 'другое', ''],
    default: ''
  },
  hobbies: [{
    type: String
  }],
  favoriteRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  coverPhoto: {
    type: String,
    default: '' 
  },
  privacySettings: {
    type: Object,
    default: {
      email: false,
      birthdate: false,
      city: false,
      phone: false,
      vk: false,
      telegram: false,
      instagram: false,
      website: false,
      favoriteCuisine: false,
      profession: false,
      quote: false,
      hobbies: false,
      gender: false,
      about: false
    }
  },
  birthdate: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  vk: {
    type: String,
    default: ''
  },
  telegram: {
    type: String,
    default: ''
  },
  instagram: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  favoriteCuisine: {
    type: String,
    default: ''
  },
  profession: {
    type: String,
    default: ''
  },
  quote: {
    type: String,
    default: ''
  },
  themeColor: {
    type: String,
    default: '#ff5722'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
