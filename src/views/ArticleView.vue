<script setup lang="ts">
import { reactive, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { md } from '@/composables/useMarked'
import ArticleToc from '@/components/article/ArticleToc.vue'
import ArticleTitle from '@/components/article/ArticleTitle.vue'
import CommentInput from '@/components/article/CommentInput.vue'
import { motion, useScroll, useSpring } from 'motion-v'
import { api } from '@/api/index'
import type { Comment } from '@/types/api'
const { scrollYProgress } = useScroll()
const scaleX = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
})

const route = useRoute()
const articleId = computed(() => Number(route.params.id))


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
  title: '' as string,
  content: '' as string,
  tocItems: [] as Array<{ id: string, title: string }>,
  comments: [] as string[],
  loading: false,
  error: null as string | null
})

// 提取数据加载逻辑到单独函数
const loadArticleData = async (id: number) => {
  try {
    articleData.loading = true
    const [contentRes, commentsRes] = await Promise.all([
      api.getArticleById(id),
      api.getCommentsByArticleId(id)
    ])
    if (!contentRes?.data) {
      throw new Error('Failed to load article data')
    }
    articleData.comments = commentsRes.data || []
    const fullContent = `[[toc]]\n\n${contentRes.data.content}`
    const fullHtml = md.render(fullContent)

    // 提取标题
    articleData.title = contentRes.data.title
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
  } catch (err) {
    articleData.error = '加载失败，请稍后重试'
    console.error(err)
  } finally {
    articleData.loading = false
  }
}

// 初始加载
onMounted(() => loadArticleData(articleId.value))

// 监听路由参数变化
watch(articleId, (newId: number) => {
  loadArticleData(newId)
})

const handleCommentSubmit = async (content: string) => {
  const comment: Comment = {
    articleId: articleId.value,
    content: content
  }
  try {
    await api.postComment(comment)
    const comments = await api.getCommentsByArticleId(articleId.value)
    articleData.comments = comments.data || []
  } catch (err) {
    articleData.error = '评论提交失败'
    console.error(err)
  }
}
</script>

<template>
  <motion.div id="scroll-indicator" :style="scrollIndicator" class="z-100" />
  <div class=" flex flex-col gap-6 max-w-6xl mx-auto p-4">
    <ArticleTitle :title="articleData.title" :comments="articleData.comments" :speed="8" />
    <div class="grid grid-cols-[auto_1fr] gap-8 min-h-[calc(100vh-200px)]">
      <ArticleToc :items="articleData.tocItems" />
      <article class="max-w-3xl mx-auto w-full px-4 markdown-content" v-html="articleData.content"></article>
    </div>
    <CommentInput @submit="handleCommentSubmit" />
  </div>
</template>

<style scoped>
.markdown-content :deep(h2) {
  @apply text-xl font-bold mt-10 mb-4 pb-2 border-b border-gray-300 dark:border-gray-700;
}

/* 代码块容器 - 暗黑模式背景调淡 */
.markdown-content :deep(pre) {
  @apply rounded-md p-4 my-4 overflow-x-auto font-mono;
  @apply bg-[#f6f8fa] dark:bg-[#1a1f27];
  /* 暗黑模式背景调亮 */
  @apply border border-[#e1e4e8] dark:border-[#3b424d];
  /* 边框颜色调整 */
  line-height: 1.5;
}

/* 行内代码 - 增大字体，无圆角 */
.markdown-content :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  @apply px-1.5 py-0.5;
  @apply bg-[#f6f8fa] dark:bg-[#1a1f27] text-gray-800 dark:text-gray-200;
  @apply border border-[#e1e4e8] dark:border-[#3b424d];
  border-radius: 0 !important;
  /* 确保无圆角 */
}

/* 代码块内的代码 */
.markdown-content :deep(pre code) {
  @apply bg-transparent p-0 border-0;
}

/* 暗黑模式文本颜色 */
.dark .markdown-content :deep(pre code) {
  color: #e6edf3;
  /* 使用更亮的文本颜色提高可读性 */
}

/* 引用块 - 添加边框显示 */
.markdown-content :deep(blockquote) {
  @apply border-l-4 border-gray-300 dark:border-gray-500;
  @apply bg-gray-50 dark:bg-gray-800/30;
  @apply border border-gray-200 dark:border-gray-700;
  /* 添加完整边框 */
  @apply px-4 py-2 my-4 text-gray-700 dark:text-gray-300;
  @apply rounded-sm;
  /* 轻微圆角 */
}

/* 复制按钮 */
.markdown-content :deep(.markdown-it-code-copy) {
  @apply absolute right-2 top-2 p-1 text-sm;
  @apply text-gray-500 dark:text-gray-400 opacity-70 hover:opacity-100;
  @apply bg-[#f6f8fa] dark:bg-[#1a1f27] border border-[#e1e4e8] dark:border-[#3b424d] rounded;
}
</style>
