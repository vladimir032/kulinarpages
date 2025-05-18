const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
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

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const userRecipes = await Recipe.find({ author: req.user.id });
    const recipesCount = userRecipes.length;
    const viewsCount = userRecipes.reduce((acc, r) => acc + (r.views || 0), 0);
    let likesCount = 0;
    for (const recipe of userRecipes) {
      if (Array.isArray(recipe.likedBy)) {
        likesCount += recipe.likedBy.length;
      } else if (typeof recipe.likes === 'number') {
        likesCount += recipe.likes;
      }
    }
    res.json({
      ...user.toObject(),
      stats: {
        recipesCount,
        likesCount,
        viewsCount
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.patch('/profile', auth, async (req, res) => {
  try {
    const fields = {};
    const allowed = [
      'avatar', 'status', 'about', 'gender', 'hobbies', 'favoriteRecipes',
      'coverPhoto', 'privacySettings', 'birthdate', 'city', 'phone', 'vk', 'telegram', 'instagram', 'website',
      'favoriteCuisine', 'profession', 'quote', 'themeColor'
    ];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) fields[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fields },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
