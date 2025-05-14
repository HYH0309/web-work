<script setup lang="ts">
import { ref, computed } from 'vue'
import ArticleCard from '@/components/article/ArticleCard.vue'
import ArticleFilter from '@/components/article/ArticleFilter.vue'
import type { ArticleSummary } from '@/types/article'

// 虚拟数据生成
const generateMockData = (count = 50): ArticleSummary[] => {
  const tagsPool = ['前端', 'Vue', '算法', 'TypeScript', '工程化', 'Node.js']
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `虚拟文章标题 ${i + 1}`,
    tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 },
      () => tagsPool[Math.floor(Math.random() * tagsPool.length)]),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    coverUrl: `https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=800`
  }))
}

const allArticles = ref<ArticleSummary[]>([])
const searchTitle = ref('')
const selectedTags = ref<string[]>([])
const currentPage = ref(1)
const pageSize = 6
const isLoading = ref(true)
const isEmpty = computed(() => filteredArticles.value.length === 0)

// 模拟数据加载
setTimeout(() => {
  isLoading.value = false
  allArticles.value = generateMockData(50)
}, 1000)

const availableTags = computed(() => {
  return Array.from(new Set(allArticles.value.flatMap(article => article.tags)))
})

const filteredArticles = computed(() => {
  return allArticles.value.filter(article => {
    const titleMatch = article.title.toLowerCase().includes(searchTitle.value.toLowerCase())
    const tagMatch = selectedTags.value.length === 0 ||
      selectedTags.value.every(tag => article.tags.includes(tag))
    return titleMatch && tagMatch
  })
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / pageSize))

const handlePageChange = (page: number) => {
  currentPage.value = page
}

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
      <p class="mt-4 text-text-muted">正在加载文章...</p>
    </div>

    <div v-else-if="isEmpty" class="text-center py-12">
      <p class="text-text-muted">没有找到符合条件的文章</p>
    </div>

    <!-- 文章网格 -->
    <div v-else class="article-grid">
      <ArticleCard v-for="article in paginatedArticles" :key="article.id" :article="article" />
    </div>

    <div class="border-b border-border my-6"></div>

    <!-- 分页 -->
    <div class="mt-6 flex-center gap-2">
      <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)"
        :class="['btn-sm border-none', { 'bg-success': page === currentPage }]">
        {{ page }}
      </button>
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
