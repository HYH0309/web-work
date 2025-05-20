<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import AdminModal from '@/components/admin/AdminModal.vue'
import type { Tag } from '@/types/api'
import ArticleTableRow from '@/components/article/ArticleTableRow.vue'
import { api } from '@/api'
import type { ArticleSummary } from '@/types/api'

const articles = ref<ArticleSummary[]>([])
const selectedArticles = ref<number[]>([])
const isLoading = ref(false)

const showCreateForm = ref(false)
const newArticle = ref({
  title: '',
  content: '',
  tag_ids: [] as number[]
})

const tags = ref<Tag[]>([])

const loadTags = async () => {
  const { status, data } = await api.getTags()
  if (status && data) tags.value = data
}

const createArticle = async () => {
  isLoading.value = true
  try {
    const { status } = await api.createArticle(newArticle.value)
    if (status) {
      showCreateForm.value = false
      await loadArticles()
      newArticle.value = { title: '', content: '', tag_ids: [] }
    }
  } finally {
    isLoading.value = false
  }
}

const loadArticles = async () => {
  isLoading.value = true
  try {
    const { status, data } = await api.getArticles()
    if (status && data) articles.value = data
  } finally {
    isLoading.value = false
  }
}

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

const deleteSelected = async () => {
  if (!selectedArticles.value.length) return

  isLoading.value = true
  try {
    const results = await Promise.all(
      selectedArticles.value.map(id => api.deleteArticle(id))
    )
    if (results.every(r => r.status)) {
      await loadArticles()
      selectedArticles.value = []
    }
  } finally {
    isLoading.value = false
  }
}

// 初始化加载
onMounted(() => {
  loadArticles()
  loadTags()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">文章管理</h1>
    <div class="flex justify-end gap-4 mb-6">
      <button v-if="selectedArticles.length" @click="deleteSelected" class="btn bg-red-500 text-white">
        删除选中({{ selectedArticles.length }})
      </button>
      <button @click="showCreateForm = true" class="btn bg-blue-500 text-white">
        <PlusIcon class="h-5 w-5 mr-1" />
        新增文章
      </button>
    </div>

    <div class="bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" class="h-4 w-4" :checked="selectedArticles.length === articles.length"
                @change="(e) => toggleSelectAll((e.target as HTMLInputElement).checked)" />
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              标题
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              标签
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              发布时间
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <ArticleTableRow v-for="article in articles" :key="article.id" :article="article"
            :selected="selectedArticles.includes(article.id)"
            @update:selected="(selected) => toggleSelect(article.id, selected)" />
        </tbody>
      </table>
    </div>
  </div>

  <AdminModal v-model="showCreateForm" title="新建文章" width="2xl" :loading="isLoading">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">标题</label>
        <input v-model="newArticle.title" type="text" class="input w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">内容</label>
        <textarea v-model="newArticle.content" class="textarea w-full h-48" placeholder="请输入文章内容..."></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">标签</label>
        <div class="flex flex-wrap gap-2">
          <label v-for="tag in tags" :key="tag.id"
            class="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
            <input type="checkbox" :value="tag.id" v-model="newArticle.tag_ids" class="h-4 w-4" />
            <span>{{ tag.name }}</span>
          </label>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end space-x-4 mt-6">
        <button @click="showCreateForm = false" class="btn bg-gray-100 text-gray-700">
          取消
        </button>
        <button @click="createArticle" class="btn bg-blue-500 text-white">
          提交
        </button>
      </div>
    </template>
  </AdminModal>
</template>
