<template>
  <div class="add-transaction">
    <h2>➕ Добавить операцию</h2>
    
    <form @submit.prevent="submitForm" class="transaction-form">
      <!-- Тип операции -->
      <div class="form-group">
        <label>Тип операции:</label>
        <div class="radio-group">
          <label>
            <input type="radio" v-model="form.type" value="income" />
            Доход
          </label>
          <label>
            <input type="radio" v-model="form.type" value="expense" />
            Расход
          </label>
        </div>
      </div>

      <!-- Сумма -->
      <div class="form-group">
        <label for="amount">Сумма (₽):</label>
        <input
          id="amount"
          type="number"
          v-model.number="form.amount"
          placeholder="Введите сумму"
          step="0.01"
          min="0"
        />
      </div>

      <!-- Своя категория -->
      <div class="form-group">
        <label for="category">На что потратил/откуда доход:</label>
        <input
          id="category"
          type="text"
          v-model="form.category_name"
          maxlength="50"
        />
        <div class="hint">Просто впишите своими словами</div>
      </div>

      <!-- Описание -->
      <div class="form-group">
        <label for="description">Описание (необязательно):</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Дополнительные детали..."
          rows="2"
        ></textarea>
      </div>

      <!-- Кнопки -->
      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Добавление...' : 'Добавить операцию' }}
        </button>
        <router-link to="/" class="btn-secondary">
          Отмена
        </router-link>
      </div>

      <!-- Ошибки -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
import { useTransactionsStore } from '@/stores/transactions'
import { mapActions } from 'pinia'

export default {
  name: 'AddTransactionView',
  
  data() {
    return {
      form: {
        type: 'expense',
        amount: null,
        category_name: '',
        description: ''
      },
      loading: false,
      error: null
    }
  },

  methods: {
    ...mapActions(useTransactionsStore, ['addTransaction']),

    async submitForm() {
      // Валидация

      if (!this.form.amount || this.form.amount <= 0) {
        this.error = 'Введите корректную сумму'
        return
      }

      if (!this.form.category_name.trim()) {
        this.error = 'Введите на что потратили или откуда доход'
        return
      }

      this.loading = true
      this.error = null

      try {
        await this.addTransaction(this.form)
        // Очищаем форму после успешного добавления
        this.form = {
          type: 'expense',
          amount: null,
          category_name: '',
          description: ''
        }
        this.$router.push('/') // Возвращаем на главную после успеха
      } catch (error) {
        this.error = 'Ошибка при добавлении операции: ' + error.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.add-transaction {
  max-width: 500px;
  margin: 0 auto;
}

.transaction-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.hint {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-align: center;
  flex: 1;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 5px;
  margin-top: 1rem;
}
</style>