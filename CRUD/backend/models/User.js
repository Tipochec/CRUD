const db = require('../database/database')
const bcrypt = require('bcrypt')

class User {
  static create(userData, callback) {
    const { username, email, password } = userData

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err)
      }

      const sql = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`
      db.run(sql, [username, email, hashedPassword], function (err) {
        if (err) {
          return callback(err)
        }
        callback(null, { id: this.lastID, username, email })
      })
    })
  }

  static findByEmail (email, callback) {
    const sql = `SELECT * FROM users WHERE email = ?`
    db.run(sql, [email], function(err, row) {
        if (err) {
            return callback(err)
        }
        callback(null, row)
    })
  }

  static findById (id, callback) {
    const sql = `SELECT * FROM users WHERE id = ?`;
        db.run(sql, [id], function(err, row) {
        if (err) {
            return callback(err)
        }
        callback(null, row)
    })
  }

  static verifyPassword (plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}

module.exports = User