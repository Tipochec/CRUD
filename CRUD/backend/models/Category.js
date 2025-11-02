const db = require('../database/database'); // подключение в базе данных

class Category { // создание класса Category
    static getAll(callback) { // Статический метод для получения всех категорий
        const sql = `SELECT * FROM categories ORDER BY name`; // SQL запрос: все категории, отсортированные по имени
        db.all(sql, [], callback); // Выполняем запрос и передаем результат в callback функцию
    }

    static getByType(type, callback) { // Получить категории по типу (income/expense)
        const sql = `SELECT * FROM categories WHERE type = ? ORDER BY name`;
        db.all(sql, [type], callback); // Передаем type как параметр для SQL
    }
}

module.exports = Category;