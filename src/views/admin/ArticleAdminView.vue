<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PlusIcon, DocumentTextIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { BASE_CLASSES } from '@/config/admin'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { api } from '@/api'
import type { ArticleRequest, Tag, ArticleSummary } from '@/types/api'

// ===================== 状态管理 =====================
const articles = ref<ArticleSummary[]>([])
const selectedArticles = ref<number[]>([])
const isLoading = ref(false)
const searchQuery = ref('')

// 模态框状态
const showCreateForm = ref(false)
const showConfirmDelete = ref(false)
const showMarkdownHelp = ref(false)
// 单个文章删除
const articleToDelete = ref<ArticleSummary | null>(null)
const showSingleDeleteConfirm = ref(false)

// 表单状态
const newArticle = ref<ArticleRequest>({
  title: '',
  content: '',
  tag_ids: [] as number[]
})
const tags = ref<Tag[]>([])
const tagSearch = ref('')

// ===================== 计算属性 =====================
const allTagIds = computed(() => tags.value.map(t => t.id))
const filteredTags = computed(() => {
  if (!tagSearch.value) return tags.value
  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.value.toLowerCase())
  )
})

const filteredArticles = computed(() => {
  if (!searchQuery.value) return articles.value

  const query = searchQuery.value.toLowerCase()
  return articles.value.filter(article =>
    article.title.toLowerCase().includes(query) ||
    article.tags.some(tag => tag.toLowerCase().includes(query))
  )
})

const selectedCount = computed(() => selectedArticles.value.length)
const hasSelectedAll = computed(() => selectedArticles.value.length === articles.value.length && articles.value.length > 0)
const isEmpty = computed(() => articles.value.length === 0)

// ===================== 方法 =====================
// 标签管理
const toggleAllTags = () => {
  newArticle.value.tag_ids = newArticle.value.tag_ids.length === allTagIds.value.length
    ? []
    : [...allTagIds.value]
}

const loadTags = async () => {
  try {
    const { status, data } = await api.getTags()
    if (status && data) tags.value = data
  } catch (error) {
    console.error('加载标签失败:', error)
  }
}

// 文章管理
const createArticle = async () => {
  if (!newArticle.value.title.trim()) {
    // 可以添加表单验证提示
    return
  }

  isLoading.value = true
  try {
    const { status } = await api.createArticle(newArticle.value)
    if (status) {
      showCreateForm.value = false
      await loadArticles()
      resetForm()
    }
  } catch (error) {
    console.error('创建文章失败:', error)
  } finally {
    isLoading.value = false
  }
}

const loadArticles = async () => {
  isLoading.value = true
  try {
    const { status, data } = await api.getArticles()
    if (status && data) articles.value = data
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 选择管理
const toggleSelect = (id: number, checked: boolean) => {
  if (checked) {
    selectedArticles.value.push(id)
  } else {
    selectedArticles.value = selectedArticles.value.filter(item => item !== id)
  }
}

const toggleSelectAll = (checked: boolean) => {
  selectedArticles.value = checked ? articles.value.map(a => a.id) : []
}

// 删除操作
const deleteSelected = async () => {
  if (!selectedArticles.value.length) return
  showConfirmDelete.value = false

  isLoading.value = true
  try {
    const results = await Promise.all(
      selectedArticles.value.map(id => api.deleteArticle(id))
    )
    if (results.every(r => r.status)) {
      await loadArticles()
      selectedArticles.value = []
    }
  } catch (error) {
    console.error('删除文章失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 单个文章删除相关方法
const prepareDeleteSingle = (article: ArticleSummary) => {
  articleToDelete.value = article
  showSingleDeleteConfirm.value = true
}

const deleteSingleArticle = async () => {
  if (!articleToDelete.value) return

  isLoading.value = true
  try {
    const { status } = await api.deleteArticle(articleToDelete.value.id)
    if (status) {
      await loadArticles()
      // 如果该文章在选中列表中，也要移除
      selectedArticles.value = selectedArticles.value.filter(id => id !== articleToDelete.value?.id)
    }
  } catch (error) {
    console.error('删除文章失败:', error)
  } finally {
    isLoading.value = false
    showSingleDeleteConfirm.value = false
    articleToDelete.value = null
  }
}

// 辅助方法
const resetForm = () => {
  newArticle.value = { title: '', content: '', tag_ids: [] }
  tagSearch.value = ''
}

// 格式化日期
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 初始化加载
onMounted(() => {
  loadArticles()
  loadTags()
})
</script>

<template>
  <div class="min-h-screen">
    <!-- 主内容区 -->
    <main class="pb-6">
      <!-- 工具栏 -->
      <div :class="[BASE_CLASSES.card, 'mb-4 p-4']">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <!-- 搜索框 -->
          <div class="relative w-full sm:w-64">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
            </div>
            <input v-model="searchQuery" type="text" class="pl-10 pr-4 py-2 w-full text-sm rounded-lg border border-gray-200
                dark:border-gray-700 dark:bg-gray-800 dark:text-white
                focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400" placeholder="搜索文章标题或标签..." />
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center space-x-3 w-full sm:w-auto">
            <button @click="showCreateForm = true"
              class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg flex items-center">
              <PlusIcon class="h-4 w-4 mr-1" />
              新建文章
            </button>
            <button v-if="selectedCount" @click="showConfirmDelete = true"
              class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg flex items-center">
              <TrashIcon class="h-4 w-4 mr-1" />
              删除选中 ({{ selectedCount }})
            </button>
          </div>
        </div>
      </div>

      <!-- 文章表格 -->
      <div :class="[BASE_CLASSES.card, 'overflow-hidden']">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="w-12 px-6 py-3 text-left">
                  <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500
                      dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800" :checked="hasSelectedAll"
                    @change="(e) => toggleSelectAll((e.target as HTMLInputElement).checked)" />
                </th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  标题
                </th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  标签
                </th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  发布时间
                </th>
                <th scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <!-- 加载状态 -->
              <template v-if="isLoading">
                <tr v-for="i in 3" :key="i">
                  <td colspan="5" class="px-6 py-4">
                    <div class="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>
                </tr>
              </template>

              <!-- 空状态 -->
              <tr v-else-if="isEmpty">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <DocumentTextIcon class="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">暂无文章</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">
                      还没有创建任何文章。点击下方按钮开始创建您的第一篇文章。
                    </p>
                    <button @click="showCreateForm = true"
                      class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg">
                      添加第一篇文章
                    </button>
                  </div>
                </td>
              </tr>

              <!-- 搜索无结果 -->
              <tr v-else-if="filteredArticles.length === 0 && searchQuery">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <MagnifyingGlassIcon class="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">未找到匹配结果</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                      没有找到与 "<span class="font-medium">{{ searchQuery }}</span>" 相关的文章。
                      尝试使用不同的搜索词或清除搜索条件。
                    </p>
                  </div>
                </td>
              </tr>

              <!-- 文章列表 -->
              <template v-else>
                <tr v-for="article in filteredArticles" :key="article.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500
                        dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      :checked="selectedArticles.includes(article.id)"
                      @change="(e) => toggleSelect(article.id, (e.target as HTMLInputElement).checked)" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ article.title }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="tag in article.tags" :key="tag" class="px-2 py-1 text-xs font-medium rounded-md
                        bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {{ tag }}
                      </span>
                      <span v-if="article.tags.length === 0" class="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600
                        dark:bg-gray-700 dark:text-gray-400">
                        无标签
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(article.createdAt) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="prepareDeleteSingle(article)" class="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/30
                        rounded-md text-red-600 dark:text-red-400
                        transition-all duration-200 transform-gpu">
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- 新建文章模态框 -->
    <AdminModal v-model="showCreateForm" title="新建文章" width="2xl" :loading="isLoading">
      <div class="space-y-4">
        <!-- 标题输入 -->
        <div>
          <label for="article-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标题</label>
          <input id="article-title" v-model="newArticle.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="请输入文章标题" />
        </div>

        <!-- 内容输入 -->
        <div class="relative">
          <label for="article-content"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">内容</label>
          <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <textarea id="article-content" v-model="newArticle.content" class="w-full h-64 px-4 py-3 text-sm font-mono focus:outline-none
                dark:bg-gray-700 dark:text-white" placeholder="请输入文章内容（支持Markdown语法）..."></textarea>
            <div class="absolute bottom-4 right-4 flex gap-2">
              <span class="text-xs bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded
                text-gray-500 dark:text-gray-400">
                字数：{{ newArticle.content.length }}
              </span>
              <button type="button" @click="showMarkdownHelp = true" class="text-xs bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded
                text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
                语法帮助
              </button>
            </div>
          </div>
        </div>

        <!-- 标签选择 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">标签</label>
            <button type="button" @click="toggleAllTags"
              class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              {{ newArticle.tag_ids.length === allTagIds.length ? '取消全选' : '全选' }}
            </button>
          </div>

          <!-- 标签搜索 -->
          <div class="relative">
            <div
              class="relative w-full overflow-hidden rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              <input type="text" v-model="tagSearch"
                class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-700 dark:text-white focus:ring-0"
                placeholder="搜索标签..." />
            </div>

            <!-- 标签列表 -->
            <div v-if="filteredTags.length > 0" class="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg
                ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <div v-if="filteredTags.length === 0"
                class="relative cursor-default select-none px-4 py-2 text-gray-500 dark:text-gray-400">
                未找到匹配标签
              </div>
              <div v-for="tag in filteredTags" :key="tag.id"
                class="relative cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                @click="() => {
                  const index = newArticle.tag_ids.indexOf(tag.id)
                  if (index === -1) {
                    newArticle.tag_ids.push(tag.id)
                  } else {
                    newArticle.tag_ids.splice(index, 1)
                  }
                }">
                <span class="block truncate"
                  :class="{ 'font-medium': newArticle.tag_ids.includes(tag.id), 'font-normal': !newArticle.tag_ids.includes(tag.id) }">
                  {{ tag.name }}
                </span>
                <span v-if="newArticle.tag_ids.includes(tag.id)"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="showCreateForm = false" class="px-4 py-2 bg-gray-100 text-gray-700
            rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            取消
          </button>
          <button @click="createArticle" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
              dark:bg-blue-600 dark:hover:bg-blue-500" :disabled="isLoading">
            提交
          </button>
        </div>
      </template>
    </AdminModal>

    <!-- Markdown帮助模态框 -->
    <AdminModal v-model="showMarkdownHelp" title="Markdown语法帮助" width="lg">
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标题</h3>
            <pre class="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
          # 一级标题
          ## 二级标题
          ### 三级标题</pre>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">列表</h3>
            <pre class="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
          - 无序列表项
          - 无序列表项
          1. 有序列表项
          2. 有序列表项</pre>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">强调</h3>
            <pre class="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
          *斜体文本*
          **粗体文本**
          ***粗斜体文本***</pre>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">链接与图片</h3>
            <pre class="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
          [链接文本](https://example.com)
          ![图片描述](https://example.com/image.jpg)</pre>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">代码</h3>
            <pre class="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
          `行内代码`

          ```javascript
          // 代码块
          function hello() {
          console.log('Hello');
          }
          ```</pre>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">引用与分割线</h3>
            <pre class="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
          > 引用文本

          ---
          分割线</pre>
          </div>
        </div>
      </div>
    </AdminModal>
  </div>

  <!-- 批量删除确认对话框 -->
  <ConfirmDialog v-model:show="showConfirmDelete" title="确认批量删除文章" :content="`您确定要删除选中的 ${selectedCount} 篇文章吗？此操作不可撤销。`"
    confirmText="确认删除" cancelText="取消" :danger="true" @confirm="deleteSelected" />

  <!-- 单个文章删除确认对话框 -->
  <ConfirmDialog v-model:show="showSingleDeleteConfirm" title="确认删除文章"
    :content="`您确定要删除文章《${articleToDelete?.title}》吗？此操作不可撤销。`" confirmText="确认删除" cancelText="取消" :danger="true"
    @confirm="deleteSingleArticle" />
</template>
