const express = require('express'); // express — фреймоврк для создания сервера
const router = express.Router(); //создает "мини-приложение" только для категорий
const Category = require('../models/Category'); // импорт модели для работы с базой данных


router.get('/', (req, res) => { // запрос на получение
  Category.getAll((err, rows) => { //вызывает всё из модели
    if (err) { //если ошибка
      res.status(500).json({ error: err.message }); //выводим
      return;// есил всё ок, то всё ок
    }
    res.json(rows); // иначе же возвращаем строки
  });
});

router.get('/:type', (req, res) => { // тут запрос на получение но с параметром ":" и именем параметра type
  const { type } = req.params; // создаём переменную
  Category.getByType(type, (err, rows) => { // вызывает Категории по типу
    if (err) {//если ошибка
      res.status(500).json({ error: err.message }); //выводим
      return;// есил всё ок, то всё ок
    }
    res.json(rows);// иначе же возвращаем строки
  });
});

module.exports = router;