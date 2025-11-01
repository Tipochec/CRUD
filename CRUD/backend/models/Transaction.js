const db = require('../database/database');

class Transaction {
  static getAll(callback) {
    const sql = `
      SELECT t.*, c.name as category_name, c.color as category_color 
      FROM transactions t 
      LEFT JOIN categories c ON t.category_id = c.id 
      ORDER BY t.date DESC
    `;
    db.all(sql, [], callback);
  }

  static create(transactionData, callback) {
    const { amount, category_id, type, description, date } = transactionData;
    const sql = `INSERT INTO transactions (amount, category_id, type, description, date) 
                 VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [amount, category_id, type, description, date], callback);
  }

  static delete(id, callback) {
    const sql = `DELETE FROM transactions WHERE id = ?`;
    db.run(sql, [id], callback);
  }

  static getStats(callback) {
    const sql = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
        COUNT(*) as total_transactions
      FROM transactions
    `;
    db.get(sql, [], callback);
  }
}

module.exports = Transaction;