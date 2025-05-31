<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon, TrashIcon, PencilSquareIcon, TagIcon, MagnifyingGlassIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { api } from '@/api'
import type { Tag } from '@/types/api'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { BASE_CLASSES } from '@/config/admin'

// ===================== 使用CRUD组合式函数 =====================
const {
  items: tags,
  isLoading,
  showForm: showTagForm,
  currentItem: editingTag,
  loadItems: loadTags,
  handleCreate: createTag,
  handleUpdate: updateTag,
  handleDelete: deleteTag
} = useAdminCrud<Tag>({
  fetch: async () => {
    const { status, data } = await api.getTags()
    return status ? data || [] : []
  },
  create: async (tag) => {
    const { status } = await api.createTag(tag.name)
    return status ? { id: Date.now(), ...tag } : Promise.reject('创建标签失败')
  },
  delete: async (id) => {
    const { status } = await api.deleteTag(id)
    return status ? undefined : Promise.reject('删除标签失败')
  },
  update: async (id, tag) => {
    if (!tag.name) return Promise.reject('标签名称不能为空')
    const { status } = await api.updateTag(id, { name: tag.name })
    return status ? { id, name: tag.name } : Promise.reject('更新标签失败')
  }
})

// ===================== 状态管理 =====================
const searchQuery = ref('')
const showConfirmDelete = ref(false)
const tagToDelete = ref<Tag | null>(null)
const newTag = ref<Omit<Tag, 'id'>>({ name: '' })
const validationError = ref('')

// ===================== 计算属性 =====================
const filteredTags = computed(() => {
  if (!searchQuery.value) return tags.value
  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const isEmpty = computed(() => tags.value.length === 0)
const isFiltered = computed(() => searchQuery.value !== '')
const noFilterResults = computed(() => isFiltered.value && filteredTags.value.length === 0)

// ===================== 方法 =====================
// 提交表单
const submitTag = async () => {
  validationError.value = ''

  if (!newTag.value.name.trim()) {
    validationError.value = '请输入标签名称'
    return
  }

  // 检查标签名称是否重复
  if (!editingTag.value && tags.value.some(t => t.name.toLowerCase() === newTag.value.name.toLowerCase())) {
    validationError.value = '标签名称已存在'
    return
  }

  try {
    if (editingTag.value && editingTag.value.id) {
      await updateTag(editingTag.value.id, newTag.value)
    } else {
      await createTag(newTag.value)
    }
    showTagForm.value = false
    resetForm()
  } catch (error) {
    console.error('操作标签失败:', error)
  }
}

// 确认删除
const confirmDelete = async () => {
  if (tagToDelete.value) {
    try {
      await deleteTag(tagToDelete.value.id)
      showConfirmDelete.value = false
      tagToDelete.value = null
    } catch (error) {
      console.error('删除标签失败:', error)
    }
  }
}

// 编辑标签
const editTag = (tag: Tag) => {
  editingTag.value = tag
  newTag.value = {
    name: tag.name
  }
  showTagForm.value = true
  validationError.value = ''
}

// 准备删除
const prepareDelete = (tag: Tag) => {
  tagToDelete.value = tag
  showConfirmDelete.value = true
}

// 重置表单
const resetForm = () => {
  newTag.value = { name: '' }
  validationError.value = ''
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
}

loadTags()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 页面头部 -->
    <header :class="[BASE_CLASSES.card, 'shadow-sm mb-4']">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <TagIcon class="h-6 w-6 text-blue-500 mr-2" />
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">标签管理</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="px-6 pb-6">
      <!-- 搜索栏 -->
      <div :class="[BASE_CLASSES.card, 'mb-4 p-4']">
        <div class="flex items-center justify-between gap-4">
          <div class="relative flex-grow">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" v-model="searchQuery"
              class="pl-10 pr-10 py-2 w-15 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="搜索标签..." />
          </div>
          <button @click="showTagForm = true"
            class="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors ml-4">
            <PlusIcon class="h-5 w-5 mr-1" />
            <span>新建标签</span>
          </button>
        </div>
      </div>

      <!-- 标签列表 -->
      <div :class="[BASE_CLASSES.card, 'overflow-hidden']">
        <!-- 标签列表头部 -->
        <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-3">
          <h2 class="text-base font-medium text-gray-700 dark:text-gray-300">
            所有标签
            <span
              class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {{ filteredTags.length }}
            </span>
          </h2>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="p-6">
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" class="h-12 bg-gray-100 dark:bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="isEmpty" class="p-12 flex flex-col items-center justify-center text-center">
          <TagIcon class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-3" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">暂无标签数据</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">您还没有创建任何标签，点击下方按钮创建第一个标签。</p>
          <button @click="showTagForm = true"
            class="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <PlusIcon class="h-5 w-5 mr-1" />
            <span>新建标签</span>
          </button>
        </div>

        <!-- 搜索无结果 -->
        <div v-else-if="noFilterResults" class="p-12 flex flex-col items-center justify-center text-center">
          <MagnifyingGlassIcon class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-3" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">未找到匹配的标签</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">没有标签匹配您的搜索条件"{{ searchQuery }}"</p>
          <button @click="clearSearch"
            class="flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
            <XCircleIcon class="h-5 w-5 mr-1" />
            <span>清除搜索</span>
          </button>
        </div>

        <!-- 标签列表内容 -->
        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="tag in filteredTags" :key="tag.id"
            class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div class="flex items-center">
              <div class="mr-3 flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <TagIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 class="text-base font-medium text-gray-900 dark:text-white">{{ tag.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">ID: {{ tag.id }}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button @click="editTag(tag)"
                class="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-800/40 transition-colors">
                <PencilSquareIcon class="h-5 w-5" />
              </button>
              <button @click="prepareDelete(tag)"
                class="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-800/40 transition-colors">
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- 标签表单模态框 -->
  <AdminModal v-model="showTagForm" :title="editingTag ? `编辑标签 '${editingTag.name}'` : '新建标签'" width="md"
    :loading="isLoading">
    <div class="space-y-4">
      <div>
        <label for="tag-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标签名称</label>
        <input id="tag-name" v-model="newTag.name"
          class="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="输入标签名称" :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': validationError }" />
        <p v-if="validationError" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ validationError }}</p>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end space-x-3">
        <button @click="showTagForm = false"
          class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
          取消
        </button>
        <button @click="submitTag"
          class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800">
          {{ editingTag ? '更新' : '保存' }}
        </button>
      </div>
    </template>
  </AdminModal>

  <!-- 删除确认对话框 -->
  <ConfirmDialog v-model:show="showConfirmDelete" title="删除标签"
    :content="`确定要删除标签 '${tagToDelete?.name || ''}' 吗？此操作不可恢复。`" confirmText="删除" cancelText="取消" :danger="true"
    @confirm="confirmDelete" />
</template>
