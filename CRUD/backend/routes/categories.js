const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories - получить все категории
router.get('/', (req, res) => {
  Category.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET /api/categories/:type - получить категории по типу
router.get('/:type', (req, res) => {
  const { type } = req.params;
  Category.getByType(type, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;