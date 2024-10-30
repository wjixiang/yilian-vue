import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import './mardownrender/mermaid'
import router from './router/router'
import markdownRender from '@/mardownrender/markdownRender';

const app = createApp(App)
app.use(store)
app.use(router)

app.mount('#app')