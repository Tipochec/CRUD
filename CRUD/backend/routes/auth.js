const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your-secret-key-here'; // Временно, потом вынесем в .env

// РЕГИСТРАЦИЯ
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Простая валидация
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
    }

    // Проверяем нет ли уже пользователя с таким email
    User.findByEmail(email, async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
      }

      // Создаем пользователя
      User.create({ username, email, password }, (err, newUser) => {
        if (err) {
          return res.status(500).json({ error: 'Ошибка при создании пользователя' });
        }

        // Генерируем JWT токен
        const token = jwt.sign(
          { userId: newUser.id, email: newUser.email },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'Пользователь успешно создан',
          token,
          user: { id: newUser.id, username: newUser.username, email: newUser.email }
        });
      });
    });

  } catch (error) {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// АВТОРИЗАЦИЯ
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    // Ищем пользователя по email
    User.findByEmail(email, async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
      }

      // Проверяем пароль
      const isPasswordValid = await User.verifyPassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
      }

      // Генерируем JWT токен
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Успешный вход',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      });
    });

  } catch (error) {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;