const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//api/admin/statistics
router.get('/statistics', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalSavedRecipes = await User.aggregate([
      { $unwind: "$savedRecipes" },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalRecipes,
      totalSavedRecipes: totalSavedRecipes.length > 0 ? totalSavedRecipes[0].count : 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// api/admin/users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//api/admin/users/:id/block
router.put('/users/:id/block', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isBlocked = true;
    await user.save();
    res.json({ msg: 'User blocked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//api/admin/users/:id/unblock
router.put('/users/:id/unblock', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isBlocked = false;
    await user.save();
    res.json({ msg: 'User unblocked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//api/admin/users/:id/restrict
router.put('/users/:id/restrict', auth, isAdmin, async (req, res) => {
  try {
    const { restrictionUntil } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.restrictionUntil = new Date(restrictionUntil);
    await user.save();
    res.json({ msg: 'User restricted', restrictionUntil: user.restrictionUntil });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
