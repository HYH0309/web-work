<script setup lang="ts">
import { reactive } from 'vue'
import { md } from '@/composables/useMarked'
import ArticleToc from '@/components/article/ArticleToc.vue'

const articleData = reactive({
  title: '',
  content: '',
  tocItems: [] as Array<{ id: string, title: string }>
})

// 模拟数据初始化
const mockData = `# Vue3 组合式API指南

## 核心概念
组合式API是Vue3的主要特性，它允许您：
- 更灵活地组织代码
- 更好地复用逻辑
- 更清晰的代码结构

## 响应式基础
\`\`\`ts
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({
  name: 'Vue3',
  version: '3.2.0'
})
\`\`\`

> 提示：ref用于基本类型，reactive用于对象

## 生命周期
- setup() 替代了 beforeCreate 和 created
- onMounted/onUpdated/onUnmounted 等新API

## 进阶特性
### 自定义Hook
\`\`\`ts
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}
\`\`\`

### 性能优化
- 更高效的虚拟DOM
- Tree-shaking支持
- 更小的运行时体积`
const fullContent = `[[toc]]\n\n${mockData}`
const fullHtml = md.render(fullContent)

// 提取标题
const titleMatch = mockData.match(/^#\s+(.+)/)
articleData.title = titleMatch ? titleMatch[1] : ''

// 提取TOC项
const parser = new DOMParser()
const doc = parser.parseFromString(fullHtml, 'text/html')
const tocLinks = doc.querySelectorAll('.toc a')
articleData.tocItems = Array.from(tocLinks).map(link => ({
  id: link.getAttribute('href')?.substring(1) || '',
  title: link.textContent || ''
}))

// 获取主要内容
const tocEnd = fullHtml.indexOf('</nav>') + 6
articleData.content = fullHtml.slice(tocEnd)
</script>

<template>
  <div class="article-view">
    <h1 class="article-title">{{ articleData.title }}</h1>
    <div class="article-grid">
      <ArticleToc :items="articleData.tocItems" />
      <article class="markdown-content prose" v-html="articleData.content"></article>
    </div>
  </div>
</template>

<style scoped>
.article-view {
  @apply flex flex-col gap-6 max-w-6xl mx-auto p-4;
  background: linear-gradient(to bottom right,
      rgba(var(--un-bg-base), 0.9),
      rgba(var(--un-bg-card), 0.8));
}

.markdown-content :deep(h2) {
  @apply markdown-heading;
}

.markdown-content :deep(pre) {
  @apply markdown-code;
}

.markdown-content :deep(.markdown-it-code-copy) {
  @apply btn-float
}
</style>
