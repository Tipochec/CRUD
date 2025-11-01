const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Подключаемся к вашей существующей БД из DBeaver
const dbPath = path.join(__dirname, 'finance.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to your SQLite database from DBeaver');
  }
});

module.exports = db;