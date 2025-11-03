import { defineStore } from 'pinia' // defineStore — создаёт ханилище pinia
import axios from 'axios' // axios - для HTTP запросов к backend

const API_URL = 'http://localhost:3000/api' // API_URL - базовый URL нашего Express сервера

export const useTransactionsStore = defineStore('transactions', { // defineStore() - функция Pinia для создания хранилища // 'transactions' - уникальное имя хранилища // useTransactionsStore - переменная, через которую будем использовать хранилище
  state: () => ({ // состояние, даные нашего приложения. 
    transactions: [], // все транзакуии
    loading: false, // идёт ли загрузка
    error: null, // ошибки
  }),

  actions: { // объяснение ниже
    async fetchTransactions() { // обяъснение async ниже
      this.loading = true // Начинаю загрузку → показываю спиннер
      this.error = null //  Сбрасываю предыдущие ошибки
      try { // объяснение констрекуции снизу
        const response = await axios.get(`${API_URL}/transactions`) // забиваем в переменную запрос к backend // Иду на сервер за данными и ЖДУ ответа await — заставляет JS ждать до тех пор, пока проимс справа от него не выполнится, соответсвенно пока не сработае запрос на backend
        this.transactions = response.data // сохранёем ответ в this.transaction
      } catch (error) {
        this.error = 'Ошибка при загрузке операций' // Что-то пошло не так → показываю ошибку пользователю
        console.error('Error fetching transactions:', error)
      } finally {
        this.loading = false // Загрузка завершена → убираю спиннер
      }
    },

    async addTransaction(transactionData) { // transactionData - это объект с данными новой транзакции, который приходит из компонента Функция 'добавитьТранзакцию', принимает 'данныеТранзакции
      try {
        const response = await axios.post(`${API_URL}/transactions`, transactionData) // забиваем в переменную запрос к backend объяснения на функции выше // кратко Отправляю POST запрос на сервер с данными транзакции

        console.log('✅ Store: Ответ от бэкенда:', response.data)
        await this.fetchTransactions() // Обновляю список транзакций (чтобы показать новую)
        return response.data // Возвращаю ответ от сервера (например, ID новой транзакции)
      } catch (error) {
        console.error('❌ Store: Ошибка при добавлении:', error)
        throw error // Если ошибка - передаю ее в компонент
      }
    },

    async deleteTransaction(id) { // функция удаление по id — самый лёгкий способ так как id всегда уникально
      try {
        await axios.delete(`${API_URL}/transactions/${id}`) // Метод: DELETE - специальный HTTP метод для удаления {id} - указывается тот который мы хотим удалить
        await this.fetchTransactions() // После удаления обновляю список транзакций (чтобы удаленная исчезла из интерфейса)
      } catch (error) {
        console.error('Error deleting transaction:', error)
        throw error // Если ошибка - передаю ее в компонент
      }
    },
  },

  getters: { // Getter - это КАЛЬКУЛЯТОР, который АВТОМАТИЧЕСКИ пересчитывается
    totalIncome: (state) => { // общийДоход получает состояние хранилища, оно указано в начале кода
      return state.transactions // работаем со всеми транзакциями
        .filter((t) => t.type === 'income') // .filter() - "отфильтруй и оставь только..." (t) - текущая транзакция (t = transaction) t.type === 'income' - "...транзакции где тип = 'доход'"
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) // .reduce() - "пройдись по массиву и посчитай сумму" (sum, t) - sum = текущая сумма, t = текущая транзакция sum + parseFloat(t.amount) - "добавь к сумме amount транзакции" parseFloat() - превращает строку в число ("1000" → 1000) 0 - начальная сумма = 0
    },

    totalExpenses: (state) => { // общиеЗатраты получает состояние хранилища, оно указано в начале кода
      return state.transactions // работаем со всеми транзакциями
        .filter((t) => t.type === 'expense') // .filter() - "отфильтруй и оставь только..." (t) - текущая транзакция (t = transaction) t.type === 'expense' - "...транзакции где тип = 'затраты'"
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    },

    balance: (state) => {
      return state.totalIncome - state.totalExpenses // просто делаем вычисления
        //         ↑                   ↑
        //    геттер дохода       геттер расходов
        //    (уже посчитан)      (уже посчитан)
    },
    expensesByCategory: (state) => { // Создаю геттер 'расходыПоКатегориям', который получает состояние хранилища
      const expenses = state.transactions.filter((t) => t.type === 'expense')// state.transactions - все транзакции из хранилища .filter() - метод фильтрации массива (t) - параметр (текущая транзакция) t.type === 'expense' - условие: тип транзакции = "расход" const expenses - сохраняем результат в переменную 
      const categories = {} // Создаю пустой объект, который будет хранить категории и их суммы

      expenses.forEach((transaction) => { // expenses.forEach() - перебираем КАЖДУЮ расходную транзакцию (transaction) - текущая транзакция в цикле
        const category = transaction.category_name || 'Другое' // transaction.category_name - пытаемся взять название категории из транзакции || 'Другое' - оператор "ИЛИ": если слева пусто/null/undefined, берем 'Другое' const category - сохраняем итоговое название категории 
        categories[category] = (categories[category] || 0) + parseFloat(transaction.amount) // объяснение ниже
      })

      return Object.entries(categories).map(([name, amount]) => ({ // Object.entries(categories) - превращаем объект в массив пар [ключ, значение] .map() - преобразуем каждый элемент массива ([name, amount]) - деструктуризация: name = название категории (первый элемент пары) amount = сумма (второй элемент пары)
        name,
        amount,
      }))
    },

    monthlyStats: (state) => { // Создаю геттер 'статистикаПоМесяцам', который получает состояние хранилища
      const months = {} // Создаю пустой объект для группировки по месяцам
      state.transactions.forEach((transaction) => { // Перебираю КАЖДУЮ транзакцию в хранилище
        const date = new Date(transaction.created_at) // transaction.created_at - дата создания транзакции из базы данных new Date() - создаем объект Дата из строки
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}` // date.getFullYear() - получаем год  date.getMonth() + 1 - получаем месяц  и прибавляем 1  ${...} - шаблонная строка (склеиваем год и месяц)  

        if (!months[monthKey]) { //  "если месяца еще нет в объекте"
          months[monthKey] = { income: 0, expense: 0 } //  создаем структуру для месяца с нулевыми значениями
        }

        if (transaction.type === 'income') { // объяснения ниже
          months[monthKey].income += parseFloat(transaction.amount)
        } else {
          months[monthKey].expense += parseFloat(transaction.amount)
        }
      })

      return Object.entries(months) // Превращаем объект месяцев в массив пар [ключ, значение]
        .map(([month, data]) => ({ // для каждой пары [месяц, данные]
          month, // month - ключ месяца 
          ...data, // ...data - распаковываем объект {income: X, expense: Y}
        }))
        .slice(-6) // берем ПОСЛЕДНИЕ 6 элементов массива
    },
  },
})



// ПОДРОБНОЕ ОБЪЯСНЕНИЕ НЕКОТОРЫХ МОМЕНТОВ

// async ключевое слово async перед функцией гарантирует, что эта функция в любом случае вернёт Promise
// Что такое Promise?
// Promise – это специальный объект, который содержит своё состояние. Вначале pending («ожидание»), затем – одно из: fulfilled («выполнено успешно») или rejected («выполнено с ошибкой»).

//КОНСТРУКЦИЯ try-catch-finally
// try { ... } - "ПОПЫТАЙСЯ СДЕЛАТЬ" — Выполняем код, который МОЖЕТ вызвать ошибку
// catch (error) { ... } - "ЕСЛИ НЕ ПОЛУЧИЛОСЬ" — Срабатывает когда: Сервер не отвечает Нет интернета Сервер вернул ошибку (500, 404)
// finally { ... } - "В ЛЮБОМ СЛУЧАЕ" — Выполняется ВСЕГДА: Если успех (try) Если ошибка (catch) Даже если return в середине функции


// РЕДАКТИРОВАНИЕ async ФУНКЦИИ
// ОБЯЗАТЕЛЬНАЯ СТРУКТУРА
// async fetchTransactions() {  // ← НЕ УБИРАЙ async!
//   this.loading = true
//   try {
//     // твой код здесь
//   } catch (error) {          // ← НЕ УБИРАЙ catch!
//     // обработка ошибок
//   } finally {                // ← НЕ УБИРАЙ finally!
//     this.loading = false
//   }
// }


// ОБЪЯСНЕНИЕ transactionData и как мы получаем данные от юзера
// Компонент Vue 
//     ↓ (передает)
// Pinia Store (transactionData) 
//     ↓ (отправляет HTTP POST)
// Backend Router (req.body) 
//     ↓ (передает в модель)  
// Model Transaction (transactionData)
//     ↓ (выполняет SQL)
// База данных SQLite


// Actions - это ФУНКЦИИ, которые:
// ХОДЯТ НА СЕРВЕР (делают API запросы)
// МЕНЯЮТ ДАННЫЕ в хранилище (state)
// ОБРАБАТЫВАЮТ ОШИБКИ (если сервер не отвечает)
// СООБЩАЮТ КОГДА ЗАГРУЗКА (loading = true/false)


//обяъснение categories[category] = (categories[category] || 0) + parseFloat(transaction.amount) 
// Левая часть:
// categories[category] - обращаемся к свойству объекта по названию категории

// Правая часть:
// categories[category] || 0 -
// Если категория УЖЕ есть в объекте → берем ее текущую сумму
// Если категории НЕТ → начинаем с 0
// parseFloat(transaction.amount) - превращаем сумму транзакции в число
// + - прибавляем сумму транзакции к текущей сумме категории
// Итог: Увеличиваем сумму категории на сумму текущей транзакции


// transaction.type === 'income' - проверяем тип транзакции
// months[monthKey].income += ... - если доход, добавляем к доходам месяца
// months[monthKey].expense += ... - если расход, добавляем к расходам месяца
// parseFloat(transaction.amount) - превращаем сумму в число

