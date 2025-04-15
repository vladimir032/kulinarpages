const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { Parser } = require('json2csv');
const excelJS = require('exceljs');

// Middleware to check if user is admin
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

// @route   GET api/statistics/recipes
// @desc    Get extended statistics for recipes
// @access  Private (admin only)
router.get('/recipes', auth, isAdmin, async (req, res) => {
  try {
    // TODO: Implement aggregation of views, likes, interactions per recipe
    const stats = await Recipe.aggregate([
      {
        $project: {
          title: 1,
          views: 1,
          likes: 1,
          interactions: 1
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/statistics/users/:id
// @desc    Get personal statistics for a user
// @access  Private (admin only)
router.get('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    // TODO: Implement fetching detailed user statistics
    const userStats = {
      userId,
      savedRecipesCount: 0,
      likedRecipesCount: 0,
      interactionsCount: 0
    };
    res.json(userStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/statistics/export
// @desc    Export data in various formats
// @access  Private (admin only)
// Query params: type=txt|sql|csv|xlsx|json
router.get('/export', auth, isAdmin, async (req, res) => {
  try {
    const { type } = req.query;

    // Fetch data to export (example: all users)
    const users = await User.find().select('-password').lean();

    switch (type) {
      case 'json':
        res.setHeader('Content-Disposition', 'attachment; filename=users.json');
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(users, null, 2));

      case 'csv': {
        const fields = Object.keys(users[0] || {});
        const parser = new Parser({ fields });
        const csv = parser.parse(users);
        res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
        res.setHeader('Content-Type', 'text/csv');
        return res.send(csv);
      }

      case 'xlsx': {
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');
        const columns = Object.keys(users[0] || {}).map(key => ({ header: key, key }));
        worksheet.columns = columns;
        worksheet.addRows(users);
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        await workbook.xlsx.write(res);
        res.end();
        break;
      }

      case 'txt': {
        const txtData = users.map(u => JSON.stringify(u)).join('\n');
        res.setHeader('Content-Disposition', 'attachment; filename=users.txt');
        res.setHeader('Content-Type', 'text/plain');
        return res.send(txtData);
      }

      case 'sql': {
        // Simple SQL insert statements generation
        const sqlStatements = users.map(u => {
          const columns = Object.keys(u).join(', ');
          const values = Object.values(u).map(v => typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v).join(', ');
          return `INSERT INTO users (${columns}) VALUES (${values});`;
        }).join('\n');
        res.setHeader('Content-Disposition', 'attachment; filename=users.sql');
        res.setHeader('Content-Type', 'application/sql');
        return res.send(sqlStatements);
      }

      default:
        return res.status(400).json({ msg: 'Invalid export type' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
