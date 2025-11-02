const sqlite3 = require('sqlite3').verbose(); // импорт sqlite3 - основная библиотека для работы с SQLite
const path = require('path'); // подключение path для путей, объяснение снизу

const dbPath = path.join(__dirname, 'finance.db'); // создание пути к базе данных. __dirname — переменная Node.js которая содержит путь к текущей папке, и имя файла с БД
const db = new sqlite3.Database(dbPath, (err) => { // создаём подключение к базе данных, dbPath - путь к файлу базы данных (err) => { ... } - callback функция, которая выполняется ПОСЛЕ подключени
  if (err) { // если не удалось подключится, 
    console.error('Error opening database:', err.message); // выводим ошибку.
  } else { // иначе, если ошибок нет
    console.log('✅ Connected to your SQLite database from DBeaver'); // выводим сообщение об успехе
  }
});

module.exports = db; // ЭКСПОРТ ПОДКЛЮЧЕНИЯ

// .verbose() - "говоривый" режим
// Что делает verbose():
// Более подробные сообщения об ошибках
// Лучшая отладка
// Показывает какие SQL запросы выполняются


// PATH
// Представь, что твой проект может работать на разных компьютерах:
// На Windows: C:\projects\finance-tracker\backend\database\finance.db
// На Mac: /Users/username/projects/finance-tracker/backend/database/finance.db
// path.join() решает эту проблему!

// module.exports ОН ДАЁТ ВОЗМОЖНОСТЬ ЭКСПАРТИРОВАТЬ ПОДКЛЮЧЕНИЕ НАРУЖУ, ВСЕ ФАЙЛЫ МОДЕЛЕЙ ИСПОЛЬЗУЮ ЭТО ЖЕ ПОДКЛЮЧЕНИЕ