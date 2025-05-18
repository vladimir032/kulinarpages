const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validateSearch = [
  query('query').isString().trim().notEmpty().withMessage('Запрос обязателен'),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.get('/search', auth, validateSearch, async (req, res, next) => {
  try {
    const { query: search, limit = 10, page = 1 } = req.query;
    const userId = req.user.id;
    const searchRegex = new RegExp(search, 'i');
    const filter = {
      $and: [
        { _id: { $ne: userId } },
        {
          $or: [
            { username: searchRegex },
            { email: search }
          ]
        }
      ]
    };
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('username email avatar status birthdate phone city instagram telegram youtube vk gender about hobbies favoriteRecipes')
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    res.json({
      results: users,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

module.exports = router;
