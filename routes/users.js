const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// @route   GET api/users/saved-recipes
// @desc    Get user's saved recipes
// @access  Private
router.get('/saved-recipes', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const savedRecipes = await Recipe.find({
      '_id': { $in: user.savedRecipes }
    });
    res.json(savedRecipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
