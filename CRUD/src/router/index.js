import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '@/views/HomeView.vue'
import AddTransactionView from '@/views/AddTransactionView.vue'
import LoginView from '@/views/LoginView.vue' 
import RegisterView from '@/views/RegisterView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'add',
          name: 'add',
          // Пока заглушка - создадим позже
          component: AddTransactionView
        },
        {
          path: ' login',
          name: ' login',
          component: LoginView
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterView
        }
      ]
    }
  ]
})

export default router