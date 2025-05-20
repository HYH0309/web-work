<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
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

onMounted(async () => {
  try {
    articleData.loading = true
    const [contentRes, commentsRes] = await Promise.all([
      api.getArticleById(articleId.value),
      api.getCommentsByArticleId(articleId.value)
    ])
    if (!contentRes?.data) {
      throw new Error('Failed to load article data')
    }
    articleData.comments = commentsRes.data || []
    const fullContent = `[[toc]]\n\n${contentRes.data.content}`
    const fullHtml = md.render(fullContent)

    // 提取标题
    articleData.title = contentRes.data.title
    console.log(articleData)
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
