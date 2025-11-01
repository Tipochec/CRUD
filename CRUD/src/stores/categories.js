import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/categories`)
        this.categories = response.data
      } catch (error) {
        this.error = 'Ошибка при загрузке категорий'
        console.error('Error fetching categories:', error)
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    incomeCategories: (state) => state.categories.filter((c) => c.type === 'income'),
    expenseCategories: (state) => state.categories.filter((c) => c.type === 'expense'),

  }
})
