<template>
  <div class="finance-charts">
    <h2>📊 Статистика</h2>

    <div class="charts-grid">
      <!-- Диаграмма расходов по категориям -->
      <div class="chart-container">
        <h3>Расходы по категориям</h3>
        <canvas ref="expensesChart"></canvas>
      </div>

      <!-- График по месяцам -->
      <div class="chart-container">
        <h3>Доходы и расходы по месяцам</h3>
        <canvas ref="monthlyChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'FinanceCharts',

  props: {
    transactions: {
      type: Array,
      required: true,
    },
    expensesByCategory: {
      type: Array,
      required: true,
    },
    monthlyStats: {
      type: Array,
      required: true,
    },
  },


  data() {
    return {
      expensesChart: null,
      monthlyChart: null,
    }
  },

  mounted() {

    this.renderCharts()
  },

  methods: {
    renderCharts() {
      this.renderExpensesChart()
      this.renderMonthlyChart()
    },

    renderExpensesChart() {
      const ctx = this.$refs.expensesChart.getContext('2d')

      // 🔥 РЕАЛЬНЫЕ ДАННЫЕ
      const labels = this.expensesByCategory.map((item) => item.name)
      const data = this.expensesByCategory.map((item) => item.amount)
      const colors = this.generateColors(labels.length)

      this.expensesChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: colors,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed
                  return `${context.label}: ${value} ₽`
                },
              },
            },
          },
        },
      })
    },

    renderMonthlyChart() {
      const ctx = this.$refs.monthlyChart.getContext('2d')

      // 🔥 РЕАЛЬНЫЕ ДАННЫЕ
      const labels = this.monthlyStats.map((item) => {
        const [year, month] = item.month.split('-')
        return `${month}/${year}`
      })

      this.monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Доходы',
              data: this.monthlyStats.map((item) => item.income),
              backgroundColor: '#28a745',
            },
            {
              label: 'Расходы',
              data: this.monthlyStats.map((item) => item.expense),
              backgroundColor: '#dc3545',
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `${value} ₽`,
              },
            },
          },
        }, // ✅ ТЕПЕРЬ options ЗАКРЫВАЕТСЯ ЗДЕСЬ
      })
    },

    // 🔥 ГЕНЕРАТОР ЦВЕТОВ ДЛЯ ДИАГРАММЫ
    generateColors(count) {
      const colors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF',
      ]
      return colors.slice(0, count)
    },
  },

  beforeUnmount() {
    if (this.expensesChart) {
      this.expensesChart.destroy()
    }
    if (this.monthlyChart) {
      this.monthlyChart.destroy()
    }
  },
}
</script>

<style scoped>
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.chart-container {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
  text-align: center;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
