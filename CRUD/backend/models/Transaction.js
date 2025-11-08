const db = require('../database/database') // Подключение к базе данных / её импорт.

class Transaction { 
  static getAll(userId, callback) { // получение всех транзакций.
    const sql = `
    SELECT 
      t.*, 
      c.name as predefined_category_name, 
      c.color as category_color 
    FROM transactions t 
    LEFT JOIN categories c ON t.category_id = c.id 
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
  ` 
    db.all(sql, [userId], callback) // all — все строки результата, наша переменная с данными, пустой массив нужен если будут WHERE условия, callback — функция которая получить результат, тоесть возвращаем его в getAll
  }

  static create(transactionData, callback) { // создание транзакции, вносится 2 переменные, с полями и callback, с возвращёными данными.
    const { amount, category_id, type, description, category_name, user_id  } = transactionData // по аналогии как и делали раньше, перечисляем все поля и запихиваем их в переменную 
    const sql = `INSERT INTO transactions (amount, category_id, type, description, category_name, date, user_id ) 
               VALUES (?, ?, ?, ?, ?, DATE('now'), ?)`
    db.run(sql, [amount, category_id, type, description, category_name, user_id ], callback) // run = выполнить запрос (не возвращает данные) Массив значений подставляется вместо ? по порядку
  }

  static delete(id, userId, callback) { // запрос на удаление
    const sql = `DELETE FROM transactions WHERE id = ?` // удалить из транзакции где Id = переданный ID
    db.run(sql, [id, userId], callback)
  }

  static getStats(userId, callback) { // получение данных
    const sql = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
        COUNT(*) as total_transactions
      FROM transactions
      WHERE user_id = ?
    `
    db.get(sql, [userId], callback) // get = получить только ОДНУ строку результата (т.к. статистика одна)
  }
}

module.exports = Transaction

// Разница между db.methods:
// db.all → возвращает МНОГО строк данных
// db.get → возвращает ОДНУ строку данных
// db.run → возвращает ИНФОРМАЦИЮ О ВЫПОЛНЕНИИ (lastID, changes)

//static — методы, которые можно вызвать без создания объекта. Тоесть не задавая переменную, а сразу написав getAll, так как все запросы нгаходится в классе Transaction


// ПОДРОБНОЕ ОПИСАНИЕ SQL запросов
// t.*,  выбираем ВСЕ поля из таблицы transactions (t.*)
// c.name as predefined_category_name, берем название категории из таблицы categories и даем ему понятное имя
// FROM transactions t - основная таблица + короткое имя 't'

// LEFT JOIN categories c ON t.category_id = c.id -
// JOIN = соединяем две таблицы
// LEFT JOIN = "покажи все транзакции, даже если у них нет категории"
// ON t.category_id = c.id = соединяем по полю category_id

// ORDER BY t.created_at DESC - сортируем по дате создания (новые сверху)

// ВТОРОЙ SQL запрос
// INSERT INTO transactions - вставка в таблицу transactions
// (amount, category_id, type, description, category_name, date) - перечисляем поля

// VALUES (?, ?, ?, ?, ?, DATE('now')) -
// ? = placeholders (заполнители) для защиты от SQL-инъекций
// DATE('now') = автоматически подставляет текущую дату

//ТРЕТИЙ SQL запрос
// SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income -
// CASE = условие как if/else в SQL
// Если type = 'income', берем amount, иначе 0
// SUM = суммируем все значения
// Результат: общий доход

// COUNT(*) as total_transactions - подсчет общего количества транзакций