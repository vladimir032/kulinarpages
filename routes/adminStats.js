const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const LoginRecord = require('../models/LoginRecord');
const auth = require('../middleware/auth');

// Middleware: Только для админов
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
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// 1. Новые пользователи/рецепты по дням/месяцам
router.get('/new-users', auth, isAdmin, async (req, res) => {
  try {
    const by = req.query.by === 'hour' ? '%Y-%m-%d %H:00' : '%Y-%m-%d';
    const usersByPeriod = await User.aggregate([
      { $group: {
        _id: { $dateToString: { format: by, date: "$createdAt" } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    res.json(usersByPeriod);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
router.get('/new-recipes', auth, isAdmin, async (req, res) => {
  try {
    const by = req.query.by === 'hour' ? '%Y-%m-%d %H:00' : '%Y-%m-%d';
    const recipesByPeriod = await Recipe.aggregate([
      { $group: {
        _id: { $dateToString: { format: by, date: "$createdAt" } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    res.json(recipesByPeriod);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 2. Самые активные пользователи
router.get('/top-users', auth, isAdmin, async (req, res) => {
  try {
    // Получаем всех пользователей
    const users = await User.find();
    // Получаем все рецепты
    const recipes = await Recipe.find();
    // Считаем активность: количество сохранённых рецептов (лайков), количество просмотров всех их рецептов, количество созданных рецептов
    const userStats = users.map(user => {
      const recipesByUser = recipes.filter(r => r.author && r.author.toString() === user._id.toString());
      const viewsCount = recipesByUser.reduce((acc, r) => acc + (r.views || 0), 0);
      return {
        _id: user._id,
        username: user.username,
        loginCount: user.loginCount || 0,
        savedRecipesCount: user.savedRecipes.length,
        recipesCount: recipesByUser.length,
        viewsCount,
      };
    });
    userStats.sort((a, b) => b.savedRecipesCount - a.savedRecipesCount || b.viewsCount - a.viewsCount || b.recipesCount - a.recipesCount);
    res.json(userStats.slice(0, 20));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 3. Самые популярные рецепты (по лайкам, просмотрам, комментариям)
router.get('/top-recipes', auth, isAdmin, async (req, res) => {
  try {
    // Получаем все рецепты
    const recipes = await Recipe.find();
    // Для каждого рецепта считаем лайки (savedRecipes)
    const users = await User.find({}, 'savedRecipes');
    const recipeLikes = {};
    users.forEach(user => {
      user.savedRecipes.forEach(recipeId => {
        recipeLikes[recipeId] = (recipeLikes[recipeId] || 0) + 1;
      });
    });
    // Формируем массив рецептов с лайками
    const recipesWithLikes = recipes.map(r => ({
      _id: r._id,
      title: r.title,
      views: r.views,
      commentsCount: r.commentsCount || 0,
      category: r.category,
      likes: recipeLikes[r._id.toString()] || 0
    }));
    // Сортируем
    recipesWithLikes.sort((a, b) => b.likes - a.likes || b.views - a.views || b.commentsCount - a.commentsCount);
    res.json(recipesWithLikes.slice(0, 20));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 4. Динамика лайков по дням/часам (savedRecipes)
router.get('/likes-dynamics', auth, isAdmin, async (req, res) => {
  try {
    const byHour = req.query.by === 'hour';
    // Получаем всех пользователей и их savedRecipes
    const users = await User.find({}, 'savedRecipes');
    // Получаем все рецепты для поиска createdAt
    const recipes = await Recipe.find({}, 'createdAt');
    // Мапа recipeId -> createdAt
    const recipeCreatedAt = {};
    recipes.forEach(r => { recipeCreatedAt[r._id.toString()] = r.createdAt; });
    // Считаем лайки по дате создания рецепта
    const likeDates = {};
    users.forEach(user => {
      user.savedRecipes.forEach(recipeId => {
        const createdAt = recipeCreatedAt[recipeId.toString()];
        if (createdAt) {
          let date;
          if (byHour) {
            date = createdAt.toISOString().slice(0, 13).replace('T', ' ') + ':00';
          } else {
            date = createdAt.toISOString().slice(0, 10);
          }
          if (!likeDates[date]) likeDates[date] = 0;
          likeDates[date]++;
        }
      });
    });
    const likesByPeriod = Object.keys(likeDates).sort().map(date => ({ _id: date, likes: likeDates[date] }));
    res.json(likesByPeriod);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
router.get('/views-dynamics', auth, isAdmin, async (req, res) => {
  try {
    const byHour = req.query.by === 'hour';
    // Получаем все рецепты
    const recipes = await Recipe.find({}, 'createdAt views');
    // Группируем просмотры по дате создания рецепта
    const viewsByPeriod = {};
    recipes.forEach(r => {
      let date = null;
      if (r.createdAt) {
        if (byHour) {
          date = r.createdAt.toISOString().slice(0, 13).replace('T', ' ') + ':00';
        } else {
          date = r.createdAt.toISOString().slice(0, 10);
        }
      }
      if (date) {
        if (!viewsByPeriod[date]) viewsByPeriod[date] = 0;
        viewsByPeriod[date] += r.views || 0;
      }
    });
    const result = Object.keys(viewsByPeriod).sort().map(date => ({ _id: date, views: viewsByPeriod[date] }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 5. Категориальный анализ
router.get('/categories', auth, isAdmin, async (req, res) => {
  try {
    const allowedCategories = ['Салаты', 'Десерты', 'Супы', 'Пиццы', 'Напитки', 'Горячее'];
    // Получаем все рецепты
    const recipes = await Recipe.find();
    // Получаем все savedRecipes для лайков
    const users = await User.find({}, 'savedRecipes');
    const recipeLikes = {};
    users.forEach(user => {
      user.savedRecipes.forEach(recipeId => {
        recipeLikes[recipeId] = (recipeLikes[recipeId] || 0) + 1;
      });
    });
    // Группируем по категориям
    const categories = allowedCategories.map(cat => {
      const catRecipes = recipes.filter(r => r.category === cat);
      const count = catRecipes.length;
      const views = catRecipes.reduce((acc, r) => acc + (r.views || 0), 0);
      const likes = catRecipes.reduce((acc, r) => acc + (recipeLikes[r._id.toString()] || 0), 0);
      return { _id: cat, count, likes, views };
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 6. Самые активные IP
router.get('/top-ips', auth, isAdmin, async (req, res) => {
  try {
    // Берем из LoginRecord
    const ips = await LoginRecord.aggregate([
      { $group: {
        _id: "$ip",
        count: { $sum: 1 },
        users: { $addToSet: "$username" }
      }},
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.json(ips);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
