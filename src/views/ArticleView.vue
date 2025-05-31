<script setup lang="ts">
import { reactive, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { md } from '@/composables/useMarked'
import ArticleToc from '@/components/article/ArticleToc.vue'
import ArticleTitle from '@/components/article/ArticleTitle.vue'
import ArticleComments from '@/components/article/ArticleComments.vue'
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
  height: '6px',
  originX: 0,
  backgroundColor: '#38bdf8', // sky-400
  borderRadius: '3px',
  zIndex: 100
}

const articleData = reactive({
  title: '' as string,
  content: '' as string,
  tocItems: [] as Array<{ id: string, title: string }>,
  comments: [] as string[],
  loading: false,
  error: null as string | null
})

// 数据加载
const loadArticleData = async (id: number) => {
  try {
    articleData.loading = true
    articleData.error = null
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

onMounted(() => loadArticleData(articleId.value))
watch(articleId, (newId: number) => {
  loadArticleData(newId)
})

const handleCommentSubmit = async (content: string) => {
  const comment: Comment = {
    article_id: articleId.value,
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
  <!-- 滚动进度条 -->
  <motion.div id="scroll-indicator" :style="scrollIndicator" class="z-100" />

  <div class="flex flex-col gap-8  mx-auto p-4">
    <!-- 文章标题 -->
    <ArticleTitle :title="articleData.title" :comments="articleData.comments" :speed="8" />

    <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 min-h-[calc(100vh-200px)]">
      <!-- 目录卡片（去除外层背景和圆角，避免重复） -->
      <div class="hidden md:block">
        <ArticleToc :items="articleData.tocItems" />
      </div>
      <!-- 正文卡片 -->
      <div v-if="articleData.loading" class="bg-sky-50 dark:bg-sky-900 rounded-xl shadow p-8 text-center text-sky-400">
        正在加载文章内容...
      </div>
      <div v-else-if="articleData.error"
        class="bg-rose-50 dark:bg-rose-900 rounded-xl shadow p-8 text-center text-rose-400">
        {{ articleData.error }}
      </div>
      <article v-else class="max-w-3xl mx-auto w-full px-4 py-8  rounded-2xl shadow-lg markdown-content"
        v-html="articleData.content"></article>
    </div>

    <!-- 评论区卡片 -->
    <div class="max-w-3xl mx-auto w-full">
      <ArticleComments :comments="articleData.comments" :loading="articleData.loading" :error="articleData.error"
        @submit="handleCommentSubmit" />
    </div>
  </div>
</template>

<style scoped>
.markdown-content :deep(h2) {
  @apply text-xl font-bold mt-10 mb-4 pb-2 border-b border-gray-300 dark:border-gray-700;
}

.markdown-content :deep(pre) {
  @apply rounded-md p-4 my-4 overflow-x-auto font-mono;
  @apply bg-[#f6f8fa] dark:bg-[#1a1f27];
  @apply border border-[#e1e4e8] dark:border-[#3b424d];
  line-height: 1.5;
}

.markdown-content :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  @apply px-1.5 py-0.5;
  @apply bg-[#f6f8fa] dark:bg-[#1a1f27] text-gray-800 dark:text-gray-200;
  @apply border border-[#e1e4e8] dark:border-[#3b424d];
  border-radius: 0 !important;
}

.markdown-content :deep(pre code) {
  @apply bg-transparent p-0 border-0;
}

.dark .markdown-content :deep(pre code) {
  color: #e6edf3;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-gray-300 dark:border-gray-500;
  @apply bg-gray-50 dark:bg-gray-800/30;
  @apply border border-gray-200 dark:border-gray-700;
  @apply px-4 py-2 my-4 text-gray-700 dark:text-gray-300;
  @apply rounded-sm;
}

.markdown-content :deep(.markdown-it-code-copy) {
  @apply absolute right-2 top-2 p-1 text-sm;
  @apply text-gray-500 dark:text-gray-400 opacity-70 hover:opacity-100;
  @apply bg-[#f6f8fa] dark:bg-[#1a1f27] border border-[#e1e4e8] dark:border-[#3b424d] rounded;
}
</style>
