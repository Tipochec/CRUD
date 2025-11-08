const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-here'; // Должен совпадать с тем, что в auth.js

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Формат: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Токен доступа отсутствует' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }

    req.user = user; // Добавляем данные пользователя в запрос
    next(); // Передаем управление следующему middleware/роуту
  });
};

module.exports = { authenticateToken };