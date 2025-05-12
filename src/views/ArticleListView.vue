<script setup lang="ts">
import { ref, computed } from 'vue'
import ArticleCard from '@/components/blog/ArticleCard.vue'
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
const pageSize = 9
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
  <div class="min-h-screen bg-gray-50 p-6 w-screen max-w-7xl mx-auto">
    <!-- 筛选组件 -->
    <ArticleFilter :available-tags="availableTags" :initial-search-title="searchTitle"
      :initial-selected-tags="selectedTags" @update:search-title="(val: string) => searchTitle = val"
      @update:selected-tags="(val: string[]) => selectedTags = val" />

    <!-- 状态显示 -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">正在加载文章...</p>
    </div>

    <div v-else-if="isEmpty" class="text-center py-12">
      <p class="text-gray-500">没有找到符合条件的文章</p>
    </div>

    <!-- 网格布局 -->
    <div v-else class="article-grid">
      <ArticleCard v-for="article in paginatedArticles" :key="article.id" :article="article" class="article-card" />
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)"
        :class="['pagination-btn', { 'active': page === currentPage }]">
        {{ page }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  @apply mb-8 backdrop-blur-sm bg-white/50 rounded-xl p-6 shadow-sm border border-gray-100;
}

.search-input {
  @apply w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-300 placeholder-gray-400;
}

.filter-tags {
  @apply mt-4 flex flex-wrap gap-2 items-center;
}

.tag-icon {
  @apply w-5 h-5;
}

.filter-label {
  @apply text-sm font-medium text-slate-500;
}

.tag-btn {
  @apply px-3.5 py-1 rounded-full transition-all duration-200;
}

.tag-btn-active {
  @apply bg-indigo-100/80 text-indigo-600 border border-indigo-300/50 hover:bg-indigo-200/60;
}

.tag-btn:not(.tag-btn-active) {
  @apply bg-slate-50 text-slate-500 hover:bg-white hover:shadow-xs hover:border-indigo-100 hover:text-indigo-600;
}

.article-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
}

.article-card {
  @apply transform transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-sm hover:shadow-md;
}

.pagination {
  @apply mt-12 flex justify-center gap-2;
}

.pagination-btn {
  @apply px-4 py-2 rounded-lg border font-medium transition-colors duration-200 bg-white text-slate-600 border-gray-200 hover:bg-gray-50;
}

.pagination-btn.active {
  @apply bg-indigo-500 text-white border-indigo-600 hover:bg-indigo-600;
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
