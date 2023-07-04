import { createApp } from 'vue'

import app from './app.vue'
import { router } from './router'
import { pinia } from './store'

import './assets/css/main.css'

createApp(app)
  .use(router)
  .use(pinia)
  .mount('#app')
