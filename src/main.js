import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import markdownrender from './mardownrender/markdownRender'
import './mardownrender/mermaid'

createApp(App).use(store).mount('#app')