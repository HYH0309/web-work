<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { md } from '@/composables/useMarked'
import ArticleToc from '@/components/article/ArticleToc.vue'
import ArticleTitle from '@/components/article/ArticleTitle.vue'
import CommentInput from '@/components/article/CommentInput.vue'
import { CommentService } from '@/api/comment'
import { motion, useScroll, useSpring } from 'motion-v'

const { scrollYProgress } = useScroll()
const scaleX = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
})


const scrollIndicator = {
  scaleX: scaleX,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '10px',
  originX: 0,
  backgroundColor: '#ff0088'
}

const articleData = reactive({
  title: '',
  content: '',
  tocItems: [] as Array<{ id: string, title: string }>,
  comments: [] as string[]
})

onMounted(async () => {
  articleData.comments = await CommentService.getComments()
})

const handleCommentSubmit = async (comment: string) => {
  await CommentService.addComment(comment)
  articleData.comments = await CommentService.getComments()
}

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
  <motion.div id="scroll-indicator" :style="scrollIndicator" class="z-100" />
  <div class=" flex flex-col gap-6 max-w-6xl mx-auto p-4">
    <ArticleTitle title="观众弹幕" :comments="articleData.comments" :speed="8" />
    <div class="grid grid-cols-[auto_1fr] gap-8 min-h-[calc(100vh-200px)]">
      <ArticleToc :items="articleData.tocItems" />
      <article class="max-w-3xl mx-auto w-full px-4 markdown-content" v-html="articleData.content"></article>
    </div>
    <CommentInput @submit="handleCommentSubmit" />
  </div>
</template>

<style scoped>
.markdown-content :deep(h2) {
  @apply text-2xl font-semibold mt-12 mb-6 pb-2 border-b border-border/50;
}

.markdown-content :deep(pre) {
  @apply rounded-lg p-4 my-4 border border-border/20 shadow-sm overflow-x-auto rounded-2xl bg-gray-1 dark:bg-gray-4;
}

.markdown-content :deep(code) {
  @apply font-mono text-sm px-1.5 py-0.5 rounded;
}

.markdown-content :deep(pre code) {
  @apply bg-transparent p-0;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-primary/50 bg-muted/30 italic px-4 py-2 my-4 text-text/80;
}

.markdown-content :deep(.markdown-it-code-copy) {
  @apply btn-ghost absolute right-2 top-2 p-2 text-sm opacity-80 hover:opacity-100;
}
</style>
