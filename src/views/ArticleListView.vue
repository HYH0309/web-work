<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ArticleCard from '@/components/article/ArticleCard.vue'
import ArticleFilter from '@/components/article/ArticleFilter.vue'
import { api } from '@/api/index'
import type { ArticleSummary, Tag } from '@/types/api'

const allArticles = ref<ArticleSummary[]>([]) // Initialize as empty array
const allTags = ref<Tag[]>([]) // Initialize as empty array
const searchTitle = ref('')
const selectedTags = ref<string[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isEmpty = computed(() => filteredArticles.value.length === 0)

onMounted(async () => {
  try {
    const [articlesRes, tagsRes] = await Promise.all([
      api.getArticles(),
      api.getTags()
    ])

    // More robust data validation
    if (articlesRes.status && articlesRes.data) {
      console.log('Raw articles data:', articlesRes.data)
      allArticles.value = articlesRes.data
    } else {
      throw new Error('bug')
    }
    if (tagsRes.status && tagsRes.data) {
      console.log('Raw tags data:', tagsRes.data)
      allTags.value = Array.isArray(tagsRes.data) ? tagsRes.data : []
    } else {
      throw new Error('标签数据格式不正确')
    }

  } catch (err) {
    error.value = '数据加载失败，请稍后重试'
    console.error('加载数据错误:', err)
    // Ensure we have empty arrays even on error
    allArticles.value = []
    allTags.value = []
  } finally {
    isLoading.value = false
  }
})

const availableTags = computed(() => {
  return (allTags.value || []).map(tag => tag?.name || '').filter(Boolean)
})

const filteredArticles = computed(() => {
  // Ensure we're always working with an array
  console.log('Filtering articles:', allArticles.value)
  const articles = Array.isArray(allArticles.value) ? allArticles.value : []

  return articles
    .filter(article => {
      // Additional null checks for article properties
      if (!article?.title || !article?.tags) return false

      const titleMatch = article.title.toLowerCase().includes(searchTitle.value.toLowerCase())
      const tagMatch = selectedTags.value.length === 0 ||
        selectedTags.value.some(tag => article.tags?.includes(tag))
      return titleMatch && tagMatch
    })
    .sort((a, b) => {
      // Handle potential missing createdAt
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
})
</script>

<template>
  <div class="container bg-background mx-auto">
    <!-- 筛选组件 -->
    <ArticleFilter :available-tags="availableTags" :initial-search-title="searchTitle"
      :initial-selected-tags="selectedTags" @update:search-title="(val: string) => searchTitle = val"
      @update:selected-tags="(val: string[]) => selectedTags = val" />

    <div class="divider"></div>

    <!-- 状态显示 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="mt-4 text-muted">正在加载文章...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-error">{{ error }}</p>
      <button class="mt-4 px-4 py-2 bg-primary text-white rounded" @click="onMounted">
        重试
      </button>
    </div>
    <div v-else-if="isEmpty" class="text-center py-12">
      <p class="text-text-muted">没有找到符合条件的文章</p>
    </div>

    <!-- 文章网格 -->
    <div v-else class="article-grid">
      <ArticleCard v-for="article in filteredArticles" :key="article.id" :article="article" />
    </div>
  </div>
</template>

<style scoped>
.loading-spinner {
  @apply animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto;
}

.article-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

@media (max-width: 640px) {
  .pagination {
    @apply flex-wrap;
  }

  .pagination-btn {
    @apply px-3 py-1.5 text-sm;
  }
}
</style>
