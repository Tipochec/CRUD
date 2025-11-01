const express = require('express');
const cors = require('cors');
const transactionsRouter = require('./routes/transactions');
const categoriesRouter = require('./routes/categories'); // новый импорт



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключаем роуты
app.use('/api/transactions', transactionsRouter);
app.use('/api/categories', categoriesRouter); // новый роут

// Тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working! 🚀' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/`);
});