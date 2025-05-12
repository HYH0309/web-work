import 'virtual:uno.css'
import './assets/main.css'
import './assets/prism.css'
import 'github-markdown-css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
