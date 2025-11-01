const db = require('../database/database');

class Category {
    static getAll(callback) {
        const sql = `SELECT * FROM categories ORDER BY name`;
        db.all(sql, [], callback);
    }

    static getByType(type, callback) {
        const sql = `SELECT * FROM categories WHERE type = ? ORDER BY name`;
        db.all(sql, [], callback);
    }
}

module.exports = Category;