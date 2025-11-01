<template>
  <div class="home">
    <div class="stats">
      <div class="stat-card income">
        <h3>Доходы</h3>
        <div class="amount">{{ totalIncome }} ₽</div>
      </div>
      <div class="stat-card expense">
        <h3>Расходы</h3>
        <div class="amount">{{ totalExpenses }} ₽</div>
      </div>
      <div class="stat-card balance">
        <h3>Баланс</h3>
        <div class="amount">{{ balance }} ₽</div>
      </div>
    </div>

    <FinanceCharts
      v-if="transactions.length > 0"
      :transactions="transactions"
      :expensesByCategory="expensesByCategory" 
      :monthlyStats="monthlyStats"
    />

    <div class="transactions-section">
      <h2>Последние операции</h2>

      <div v-if="loading" class="loading">Загрузка...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="transactions.length === 0" class="empty">Нет операций. Добавьте первую!</div>

      <div v-else class="transactions-list">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="transaction-item"
          :class="transaction.type"
        >
          <div class="transaction-info">
            <div class="category" :style="{ color: transaction.category_color }">
              {{ transaction.category_name }}
            </div>
            <div class="description">{{ transaction.description }}</div>
            <div class="date">{{ formatDate(transaction.date) }}</div>
          </div>
          <div class="transaction-amount">
            <span class="amount">{{ transaction.amount }} ₽</span>
            <button @click="deleteTransaction(transaction.id)" class="delete-btn">×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTransactionsStore } from '@/stores/transactions'
import { mapState, mapActions, mapGetters } from 'pinia'
import FinanceCharts from '@/components/FinanceCharts.vue'

export default {
  name: 'HomeView',

  components: {
    FinanceCharts,
  },
  computed: {
    ...mapState(useTransactionsStore, ['transactions', 'loading', 'error']),
    ...mapGetters(useTransactionsStore, ['totalIncome', 'totalExpenses', 'balance']),
    ...mapState(useTransactionsStore, ['transactions', 'loading', 'error']),
    ...mapGetters(useTransactionsStore, [
      'totalIncome',
      'totalExpenses',
      'balance',
      'expensesByCategory',
      'monthlyStats',
    ]),
  },

  methods: {
    ...mapActions(useTransactionsStore, ['fetchTransactions', 'deleteTransaction']),

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('ru-RU')
    },
  },

  async mounted() {
    await this.fetchTransactions()
    console.log('📊 Все транзакции:', JSON.parse(JSON.stringify(this.transactions))) // ⬅️ ДОБАВЬ ЭТУ СТРОКУ
    if (this.transactions.length > 0) {
      console.log('🔍 Первая транзакция:', JSON.parse(JSON.stringify(this.transactions[0]))) // ⬅️ И ЭТУ
    }
  },
}
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-card.income {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
}

.stat-card.expense {
  background: linear-gradient(135deg, #dc3545, #fd7e14);
  color: white;
}

.stat-card.balance {
  background: linear-gradient(135deg, #007bff, #6f42c1);
  color: white;
}

.stat-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.stat-card .amount {
  font-size: 1.5rem;
  font-weight: bold;
}

.transactions-section h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.error {
  color: #dc3545;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
}

.transaction-item.income {
  border-left-color: #28a745;
}

.transaction-item.expense {
  border-left-color: #dc3545;
}

.transaction-info {
  flex: 1;
}

.category {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.description {
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.date {
  font-size: 0.8rem;
  color: #adb5bd;
}

.transaction-amount {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.amount {
  font-weight: bold;
  font-size: 1.1rem;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: #c82333;
}
</style>
