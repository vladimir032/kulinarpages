const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { Parser } = require('json2csv');
const excelJS = require('exceljs');
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

router.get('/recipes', auth, isAdmin, async (req, res) => {
  try {
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

router.get('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
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

router.get('/export', auth, isAdmin, async (req, res) => {
  try {
    const { type, data = 'users' } = req.query;
    const validTypes = ['txt', 'sql', 'csv', 'xlsx', 'json'];
    const validData = ['users', 'recipes'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ msg: 'Invalid export type. Allowed: txt, sql, csv, xlsx, json' });
    }

    if (!validData.includes(data)) {
      return res.status(400).json({ msg: 'Invalid data type. Allowed: users, recipes' });
    }

    const MAX_EXPORT_ROWS = 10000;
    let exportData;
    let filename;
    let model;
    
    if (data === 'recipes') {
      exportData = await Recipe.find().limit(MAX_EXPORT_ROWS).lean();
      filename = 'recipes';
      model = Recipe;
    } else {
      exportData = await User.find().select('-password').limit(MAX_EXPORT_ROWS).lean();
      filename = 'users';
      model = User;
    }

    if (!exportData || exportData.length === 0) {
      return res.status(404).json({ msg: 'No data found for export' });
    }

    const fields = Object.keys(model.schema.paths).filter(
      key => !key.startsWith('_') && key !== '__v'
    );

    switch (type) {
      case 'json':
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(exportData, null, 2));

      case 'csv': {
        try {
          const parser = new Parser({ fields });
          const csv = parser.parse(exportData);
          res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
          res.setHeader('Content-Type', 'text/csv');
          return res.send(csv);
        } catch (err) {
          console.error('CSV export error:', err);
          return res.status(500).json({ msg: 'CSV conversion failed' });
        }
      }

      case 'xlsx': {
        try {
          const workbook = new excelJS.Workbook();
          const worksheet = workbook.addWorksheet(filename);
          worksheet.columns = fields.map(field => ({
            header: field,
            key: field,
            width: 20
          }));

          exportData.forEach(item => {
            worksheet.addRow(item);
          });

          res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          await workbook.xlsx.write(res);
          return res.end();
        } catch (err) {
          console.error('Excel export error:', err);
          return res.status(500).json({ msg: 'Excel export failed' });
        }
      }

      case 'txt': {
        const txtData = exportData.map(item => 
          fields.map(field => `${field}: ${item[field] || ''}`).join(', ')
        ).join('\n');
        
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.txt`);
        res.setHeader('Content-Type', 'text/plain');
        return res.send(txtData);
      }

      case 'sql': {
        try {
          const tableName = data === 'recipes' ? 'recipes' : 'users';
          const columns = fields.join(', ');
          
          const sqlStatements = exportData.map(item => {
            const values = fields.map(field => {
              const value = item[field];
              if (value === null || value === undefined) return 'NULL';
              if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
              if (value instanceof Date) return `'${value.toISOString()}'`;
              return value;
            }).join(', ');
            
            return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
          }).join('\n');
          
          res.setHeader('Content-Disposition', `attachment; filename=${filename}.sql`);
          res.setHeader('Content-Type', 'application/sql');
          return res.send(sqlStatements);
        } catch (err) {
          console.error('SQL export error:', err);
          return res.status(500).json({ msg: 'SQL export failed' });
        }
      }
    }
  } catch (err) {
    console.error('Export error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 