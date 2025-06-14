<!--
  ArticleAdminView v4.0功能集成示例
  展示如何将TagAdminView的成功模式应用到文章管理

  主要特性：
  - 智能缓存集成
  - 批量操作支持
  - 虚拟滚动（大数据集）
  - 多格式数据导出
  - 增强键盘导航
-->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 页面头部 -->
    <header :class="[BASE_CLASSES.card, 'shadow-sm mb-4']">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 :class="['text-xl font-bold', BASE_CLASSES.heading]">文章管理</h1>
            <div class="flex items-center gap-2 mt-1">
              <p :class="['text-sm', BASE_CLASSES.subtext]">管理网站文章内容</p>
              <span v-if="articles.length > 0" :class="['text-xs px-2 py-1 rounded-full', BASE_CLASSES.badge]">
                {{ filteredArticles.length }}/{{ articles.length }}
              </span>
            </div>
          </div>
          <button
            @click="showCreateForm = true"
            :class="['px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2', BASE_CLASSES.button]"
          >
            <PlusIcon class="h-4 w-4" />
            新建文章
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="px-6 pb-6">
      <!-- 搜索工具栏 -->
      <div :class="[BASE_CLASSES.card, 'mb-4 p-4']">
        <div class="flex items-center gap-4">
          <div class="flex-1 relative">
            <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章标题或标签..."
              :class="['w-full pl-10 pr-4 py-2 border rounded-lg', BASE_CLASSES.input]"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- v4.0 批量操作工具栏 -->
      <BatchOperationToolbar
        v-if="!isLoading && !isEmpty"
        :selected-count="selectedCount"
        :total-count="filteredArticles.length"
        :operations="batchOperations"
        :is-processing="isBatchProcessing"
        :progress="operationProgress"
        :operation-result="lastOperationResult"
        class="mb-4"
        @execute-operation="handleBatchOperation"
        @select-all="handleSelectAll"
        @clear-selection="deselectAll"
      />

      <!-- 文章列表卡片 -->
      <div :class="[BASE_CLASSES.card, 'overflow-hidden']">
        <section aria-labelledby="articles-heading">
          <h2 id="articles-heading" class="sr-only">文章列表</h2>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="p-6" role="status" aria-live="polite">
            <div class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="flex items-center space-x-4">
                  <div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="isEmpty" class="flex flex-col items-center justify-center py-12">
            <DocumentTextIcon class="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">暂无文章</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4 text-center">
              您还没有创建任何文章。开始写作，分享您的想法和知识。
            </p>
            <button
              @click="showCreateForm = true"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
            >
              创建第一篇文章
            </button>
          </div>

          <!-- 无搜索结果 -->
          <div v-else-if="noFilterResults" class="flex flex-col items-center justify-center py-12">
            <MagnifyingGlassIcon class="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">无搜索结果</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
              没有找到包含 "{{ searchQuery }}" 的文章
            </p>
            <button
              @click="searchQuery = ''"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
            >
              清除搜索
            </button>
          </div>

          <!-- v4.0 虚拟滚动列表（大数据集） -->
          <VirtualList
            v-else-if="useVirtualList"
            :items="filteredArticles"
            :item-height="100"
            :container-height="600"
            :selectable="true"
            :multi-select="true"
            class="border-t border-gray-200 dark:border-gray-700"
            @select="handleVirtualListSelect"
          >
            <template #default="{ item: article, index, isSelected: itemSelected }">
              <article class="p-6 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div class="flex items-start space-x-4">
                  <!-- 选择复选框 -->
                  <div class="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      :checked="itemSelected"
                      @change="handleToggleSelect(article)"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      :aria-label="`选择文章 ${article.title}`"
                    />
                  </div>

                  <!-- 文章内容 -->
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {{ article.title }}
                    </h3>
                    <div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <time :datetime="article.createdAt">
                        {{ formatDate(article.createdAt) }}
                      </time>
                      <span class="mx-2">·</span>
                      <span>{{ article.tags.length }} 个标签</span>
                    </div>
                    <div v-if="article.tags.length > 0" class="mt-3 flex flex-wrap gap-1">
                      <span
                        v-for="tag in article.tags.slice(0, 3)"
                        :key="tag"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {{ tag }}
                      </span>
                      <span
                        v-if="article.tags.length > 3"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      >
                        +{{ article.tags.length - 3 }}
                      </span>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex-shrink-0 flex items-center space-x-2">
                    <button
                      @click="editArticle(article)"
                      class="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="编辑文章"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="confirmDeleteArticle(article)"
                      class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="删除文章"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            </template>
          </VirtualList>

          <!-- 常规表格视图（小数据集） -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      :checked="hasSelectedAll"
                      @change="handleSelectAll"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                    />
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    标题
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    标签
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    发布时间
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="article in filteredArticles" :key="article.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      :checked="isSelected(article.id)"
                      @change="handleToggleSelect(article)"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ article.title }}
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="tag in article.tags.slice(0, 2)"
                        :key="tag"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {{ tag }}
                      </span>
                      <span
                        v-if="article.tags.length > 2"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      >
                        +{{ article.tags.length - 2 }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    {{ formatDate(article.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end items-center space-x-2">
                      <button
                        @click="editArticle(article)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        编辑
                      </button>
                      <button
                        @click="confirmDeleteArticle(article)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>

    <!-- 创建/编辑文章模态框 -->
    <AdminModal v-model="showCreateForm" title="创建新文章" width="xl" :loading="isLoading">
      <!-- 文章表单内容 -->
      <div class="space-y-6">
        <!-- 表单字段... -->
      </div>
    </AdminModal>

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model="showSingleDeleteConfirm"
      title="确认删除文章"
      :message="`确定要删除文章 "${articleToDelete?.title}" 吗？此操作不可撤销。`"
      confirm-text="删除"
      cancel-text="取消"
      variant="danger"
      @confirm="deleteArticle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PlusIcon, DocumentTextIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

// v4.0 新功能导入
import VirtualList from '@/components/common/VirtualList.vue'
import BatchOperationToolbar from '@/components/common/BatchOperationToolbar.vue'
import { useSmartCache } from '@/composables/useSmartCache'
import { useBatchOperations } from '@/composables/useBatchOperations'
import { useDataExport, createCommonFields } from '@/composables/useDataExport'

import { api } from '@/api'
import type { ArticleRequest, Tag, ArticleSummary } from '@/types/api'
import { BASE_CLASSES } from '@/config/admin'

// v4.0 智能缓存配置
const { fetchWithCache, clearCache } = useSmartCache({
  key: 'article-list',
  ttl: 300000, // 5分钟缓存
  enablePersist: true
})

// v4.0 数据导出
const { exportData, supportedFormats } = useDataExport<ArticleSummary>()

// v4.0 批量操作
const {
  selectedItems,
  selectedCount,
  hasSelection,
  isProcessing: isBatchProcessing,
  operationProgress,
  lastOperationResult,
  selectItem,
  deselectItem,
  toggleItem,
  selectAll,
  deselectAll,
  isSelected,
  getSelectedItems,
  executeBatchOperation,
  createDeleteOperation,
  createExportOperation
} = useBatchOperations<ArticleSummary>()

// ===================== 状态管理 =====================
const articles = ref<ArticleSummary[]>([])
const isLoading = ref(false)
const searchQuery = ref('')

// 模态框状态
const showCreateForm = ref(false)
const showSingleDeleteConfirm = ref(false)
const articleToDelete = ref<ArticleSummary | null>(null)

// ===================== 计算属性 =====================
const filteredArticles = computed(() => {
  if (!searchQuery.value) return articles.value

  const query = searchQuery.value.toLowerCase()
  return articles.value.filter(article =>
    article.title.toLowerCase().includes(query) ||
    article.tags.some(tag => tag.toLowerCase().includes(query))
  )
})

const isEmpty = computed(() => articles.value.length === 0)
const isFiltered = computed(() => searchQuery.value !== '')
const noFilterResults = computed(() => isFiltered.value && filteredArticles.value.length === 0)
const hasSelectedAll = computed(() => selectedCount.value === filteredArticles.value.length && filteredArticles.value.length > 0)

// v4.0 批量操作列表
const batchOperations = computed(() => [
  createDeleteOperation(
    async (items: ArticleSummary[]) => {
      for (const article of items) {
        await api.deleteArticle(article.id)
      }
      await loadArticles() // 刷新列表
    },
    {
      confirmationMessage: `确定要删除选中的 ${selectedCount.value} 篇文章吗？此操作不可撤销。`
    }
  ),
  createExportOperation(
    async (items: ArticleSummary[]) => {
      const commonFields = createCommonFields()
      const articleFields = [
        commonFields.id,
        { key: 'title', label: '标题', type: 'string' as const },
        { key: 'tags', label: '标签', type: 'array' as const, formatter: (tags: string[]) => tags.join(', ') },
        { key: 'createdAt', label: '创建时间', type: 'date' as const },
        { key: 'updatedAt', label: '更新时间', type: 'date' as const }
      ]

      await exportData(items, {
        format: supportedFormats[0],
        fields: articleFields,
        filename: `articles_export_${items.length}`,
        includeHeaders: true
      })
    },
    {
      label: '导出文章',
      successMessage: '文章导出成功',
      category: '数据操作'
    }
  )
])

// v4.0 虚拟滚动配置
const useVirtualList = computed(() => filteredArticles.value.length > 50)

// ===================== 方法 =====================
// v4.0 批量操作相关
const handleSelectAll = () => {
  if (selectedCount.value === filteredArticles.value.length) {
    deselectAll()
  } else {
    selectAll(filteredArticles.value, (article) => article.id)
  }
}

const handleToggleSelect = (article: ArticleSummary) => {
  toggleItem(article.id)
}

const handleVirtualListSelect = (selection: { items: ArticleSummary[], isSelected: boolean }) => {
  selection.items.forEach(article => {
    if (selection.isSelected) {
      selectItem(article.id)
    } else {
      deselectItem(article.id)
    }
  })
}

const handleBatchOperation = async (operation: any) => {
  const selectedArticleList = getSelectedItems(filteredArticles.value, (article) => article.id)

  try {
    await executeBatchOperation(operation, selectedArticleList)
    // 操作成功后刷新数据
    await loadArticles()
    clearCache() // 清除缓存确保数据最新
  } catch (error) {
    console.error('批量操作失败:', error)
  }
}

// 数据加载
const loadArticles = async () => {
  try {
    isLoading.value = true

    // v4.0 使用智能缓存
    const cachedData = await fetchWithCache(async () => {
      const { status, data } = await api.getArticles()
      return status ? data || [] : []
    })

    articles.value = cachedData
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 文章操作
const editArticle = (article: ArticleSummary) => {
  // 编辑文章逻辑
  console.log('编辑文章:', article)
}

const confirmDeleteArticle = (article: ArticleSummary) => {
  articleToDelete.value = article
  showSingleDeleteConfirm.value = true
}

const deleteArticle = async () => {
  if (!articleToDelete.value) return

  try {
    isLoading.value = true
    const { status } = await api.deleteArticle(articleToDelete.value.id)

    if (status) {
      await loadArticles()
      clearCache() // 清除缓存
      // 如果该文章在选中列表中，也要移除
      deselectItem(articleToDelete.value.id)
    }
  } catch (error) {
    console.error('删除文章失败:', error)
  } finally {
    isLoading.value = false
    showSingleDeleteConfirm.value = false
    articleToDelete.value = null
  }
}

// 工具函数
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadArticles()
})
</script>
