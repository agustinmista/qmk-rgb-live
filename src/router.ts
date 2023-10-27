import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue') // Lazy loaded
    },
    {
      path: '/github',
      name: 'github',
      redirect: () => {
        window.location.href = 'https://github.com/agustinmista/qmk-rgb-live'
        return '/redirecting'
      }
    },
  ]
})
