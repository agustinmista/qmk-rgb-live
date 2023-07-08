import { createRouter, createWebHistory } from 'vue-router'
import ConfiguratorView from '@/views/ConfiguratorView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',
      name: 'home',
      component: ConfiguratorView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue') // Lazy loaded
    }
  ]
})
