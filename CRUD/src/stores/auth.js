import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials)
        
        // Сохраняем токен и пользователя
        this.token = response.data.token
        this.user = response.data.user
        
        // Сохраняем в localStorage
        localStorage.setItem('token', this.token)
        
        // Устанавливаем заголовок для всех будущих запросов
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Ошибка входа'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/auth/register`, userData)
        
        // Сохраняем токен и пользователя
        this.token = response.data.token
        this.user = response.data.user
        
        // Сохраняем в localStorage
        localStorage.setItem('token', this.token)
        
        // Устанавливаем заголовок для всех будущих запросов
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Ошибка регистрации'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    // Инициализация при запуске приложения
    initialize() {
      if (this.token) {
        // Устанавливаем заголовок для всех запросов
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        // Можно добавить запрос для проверки валидности токена
        // Например: axios.get('/api/auth/me') для получения данных пользователя
      }
    }
  }
})