const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/transactions - получить все операции
router.get('/', (req, res) => {
  Transaction.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


// POST /api/transactions - создать новую операцию
router.post('/', (req, res) => {
  const { amount, category_id, type, description, date } = req.body;
  
  if (!amount || !type || !date) {
    return res.status(400).json({ error: 'Amount, type and date are required' });
  }

  Transaction.create({ amount, category_id, type, description, date }, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      id: this.lastID,
      message: 'Transaction created successfully' 
    });
  });
});

// DELETE /api/transactions/:id - удалить операцию
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  
  Transaction.delete(id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  });
});

// GET /api/transactions/stats - получить статистику
router.get('/stats', (req, res) => {
  Transaction.getStats((err, stats) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(stats);
  });
});

module.exports = router;