const express = require('express'); //express - фреймворк для создания сервера
const router = express.Router(); // создает "мини-приложение" только для транзакций
const Transaction = require('../models/Transaction'); //импорт модели для работы с базой данных
const { authenticateToken } = require('../middleware/auth');

// GET /api/transactions - получить все операции
router.get('/', authenticateToken, (req, res) => { //Клиент делает GET запрос на /api/transactions
  Transaction.getAll( req.user.userId, (err, rows) => { // с этого сайта берётся всё, функция ждёт ответа от Базы данных
    if (err) { // если ошибка
      res.status(500).json({ error: err.message }); // выдаёт статус 500 в формате текста и ошибки
      return;
    }
    res.json(rows); // если успех, то возвращает все строки как JSON
  });
});



// POST /api/transactions - создать новую операцию
router.post('/',authenticateToken,  (req, res) => { // POST отвечает за отправку данных
  const { amount, category_id, type, description, category_name    } = req.body; // создаём переменную в которую вытаскиваем поля из объекта req.body те самые данные, которые express.json() превратил из JSON в объект
  if (!amount || !type ) { // ВАЛИДАЦИЯ — проверяет, что amount или type не undefiend//null//0
    return res.status(400).json({ error: 'Amount, type and date are required' }); // если же есть ошибка вывводится ошибка 400 "Bad Request" (клиент отправил некорректные данные)
  }
  Transaction.create({ amount, category_id, type, description, category_name, user_id: req.user.userId }, function(err) { // создание транзакции, берём те же поля из объекта.
    if (err) { // если будет ошибка, выводим её со статусом 500, если же нет, возвращаем значение и идём дальше
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ // в случае успеха, получаем данные в json 
      id: this.lastID, // автоматически сгенерированный ID новой записи
      message: 'Transaction created successfully' 
    });
  });
});

// DELETE /api/transactions/:id - удалить операцию
router.delete('/:id',authenticateToken, (req, res) => { // DELETE отвечает за удаление операции, сортировка идёт по id, так как это самый удобный способ удалить данные, id всегда уникален.
  const id = req.params.id; // получаем ID из URL Пример: DELETE /api/transactions/5 → req.params.id = "5"
  Transaction.delete(id, req.user.userId, function(err) { // удаление операции по её id
    if (err) { // если выдаёт ошибку
      res.status(500).json({ error: err.message }); // , выводим её
      return; // если всё гуд, идём дальше
    }
    if (this.changes === 0) { // если ничего не удалилось
      return res.status(404).json({ error: 'Transaction not found' }); // выводим ошибку со статусом 404. Нет такой записи
    }
    res.json({ message: 'Transaction deleted successfully' }); // Если же всё успешно, выводим сообзенгие, что транзакция удалена
  });
});

// GET /api/transactions/stats - получить статистику
router.get('/stats', authenticateToken, (req, res) => { // GET — полуаем данные, по такой то ссылке
  Transaction.getStats(req.user.userId, (err, stats) => { // получаем все данные.
    if (err) { // Если ошибка
      res.status(500).json({ error: err.message }); // выводим её
      return; // всё гуд, идём дальше
    }
    res.json(stats); // если нет ошибки, возврашаем полученые значения
  });
});

module.exports = router; // ЭКСПОРТ РОУТЕРА

// Подробное описание req.body — 
// JavaScript заглядывает в объект req.body
// Ищет свойства с именами amount, category_id, type и т.д.
// Создает отдельные переменные с такими же именами
// Копирует значения из объекта в переменные