import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchTransactions() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/transactions`)
        this.transactions = response.data
      } catch (error) {
        this.error = 'Ошибка при загрузке операций'
        console.error('Error fetching transactions:', error)
      } finally {
        this.loading = false
      }
    },

    async addTransaction(transactionData) {
      try {
        console.log('🔄 Store: Отправляю данные в бэкенд:', transactionData)
        console.log('🔄 Store: URL запроса:', `${API_URL}/transactions`)

        const response = await axios.post(`${API_URL}/transactions`, transactionData)

        console.log('✅ Store: Ответ от бэкенда:', response.data)
        await this.fetchTransactions()
        return response.data
      } catch (error) {
        console.error('❌ Store: Ошибка при добавлении:', error)
        console.error('❌ Store: Данные запроса:', error.config?.data)
        console.error('❌ Store: Статус ошибки:', error.response?.status)
        console.error('❌ Store: Текст ошибки:', error.response?.data)
        throw error
      }
    },

    async deleteTransaction(id) {
      try {
        await axios.delete(`${API_URL}/transactions/${id}`)
        await this.fetchTransactions() // Обновляем список
      } catch (error) {
        console.error('Error deleting transaction:', error)
        throw error
      }
    },
  },

  getters: {
    totalIncome: (state) => {
      return state.transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    },

    totalExpenses: (state) => {
      return state.transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    },

    balance: (state) => {
      return state.totalIncome - state.totalExpenses
    },
    expensesByCategory: (state) => {
      const expenses = state.transactions.filter((t) => t.type === 'expense')
      const categories = {}

      expenses.forEach((transaction) => {
        const category = transaction.category_name || 'Другое'
        categories[category] = (categories[category] || 0) + parseFloat(transaction.amount)
      })

      return Object.entries(categories).map(([name, amount]) => ({
        name,
        amount,
      }))
    },

    monthlyStats: (state) => {
      const months = {}

      state.transactions.forEach((transaction) => {
        const date = new Date(transaction.created_at)
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`

        if (!months[monthKey]) {
          months[monthKey] = { income: 0, expense: 0 }
        }

        if (transaction.type === 'income') {
          months[monthKey].income += parseFloat(transaction.amount)
        } else {
          months[monthKey].expense += parseFloat(transaction.amount)
        }
      })

      return Object.entries(months)
        .map(([month, data]) => ({
          month,
          ...data,
        }))
        .slice(-6) // последние 6 месяцев
    },
  },
})
