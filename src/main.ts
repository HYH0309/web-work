// main.ts
import '@unocss/reset/normalize.css' // 重置样式
import 'github-markdown-css' // Markdown 样式
import 'highlight.js/styles/intellij-light.css' // 代码高亮
import './assets/main.css'
// 确保 UnoCSS 在最后加载
import 'virtual:uno.css'

// Vue 应用初始化
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
