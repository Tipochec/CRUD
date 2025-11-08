<template>
  <div class="register-view">
    <div class="auth-container">
      <h2>👤 Регистрация</h2>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="username">Имя пользователя:</label>
          <input
            id="username"
            type="text"
            v-model="form.username"
            placeholder="Придумайте имя"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            placeholder="your@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль:</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            placeholder="Минимум 6 символов"
            required
            minlength="6"
          />
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
          <router-link to="/login" class="btn-secondary">
            Уже есть аккаунт? Войти
          </router-link>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'RegisterView',
  
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: ''
      }
    }
  },

  computed: {
    ...mapState(useAuthStore, ['loading', 'error'])
  },

  methods: {
    ...mapActions(useAuthStore, ['register']),

    async handleRegister() {
      try {
        await this.register(this.form)
        this.$router.push('/') // Перенаправляем на главную после успешной регистрации
      } catch {
        // Ошибка уже обработана в хранилище
      }
    }
  }
}
</script>

<style scoped>
/* Стили такие же как в LoginView */
.register-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.auth-container {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.auth-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-primary {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 5px;
  text-align: center;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 5px;
  text-align: center;
}
</style>