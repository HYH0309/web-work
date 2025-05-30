<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PlusIcon, ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/24/outline'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot
} from '@headlessui/vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import type { ArticleRequest, Tag } from '@/types/api'
import ArticleTableRow from '@/components/article/ArticleTableRow.vue'
import { api } from '@/api'
import type { ArticleSummary } from '@/types/api'

const articles = ref<ArticleSummary[]>([])
const selectedArticles = ref<number[]>([])
const isLoading = ref(false)

const showCreateForm = ref(false)
const newArticle = ref<ArticleRequest>({
  title: '',
  content: '',
  tag_ids: [] as number[]
})

const tags = ref<Tag[]>([])
const tagSearch = ref('')
const showMarkdownHelp = ref(false)
const allTagIds = computed(() => tags.value.map(t => t.id))

const filteredTags = computed(() => {
  if (!tagSearch.value) return tags.value
  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.value.toLowerCase())
  )
})

const toggleAllTags = () => {
  newArticle.value.tag_ids = newArticle.value.tag_ids.length === allTagIds.value.length
    ? []
    : [...allTagIds.value]
}

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
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-slate-800">文章管理</h1>
      <div class="flex gap-3">
        <button v-if="selectedArticles.length" @click="deleteSelected"
          class="btn bg-red-500 hover:bg-red-600 text-white transition-colors">
          删除选中({{ selectedArticles.length }})
        </button>
        <button @click="showCreateForm = true"
          class="btn bg-sky-600 hover:bg-sky-700 text-white transition-colors flex items-center gap-1.5">
          <PlusIcon class="h-5 w-5" />
          <span>新增文章</span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto relative">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80 backdrop-blur-sm sticky top-0">
            <tr>
              <th class="w-12 px-4 py-3">
                <input type="checkbox" class="h-4 w-4 rounded text-sky-600 focus:ring-sky-500"
                  :checked="selectedArticles.length === articles.length"
                  @change="(e) => toggleSelectAll((e.target as HTMLInputElement).checked)" />
              </th>
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-700 min-w-[200px]">
                标题
              </th>
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-700 hidden md:table-cell">
                标签
              </th>
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-700 hidden lg:table-cell">
                发布时间
              </th>
              <th class="px-6 py-3 text-right text-sm font-medium text-slate-700 min-w-[120px]">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-if="isLoading">
              <tr v-for="i in 3" :key="i">
                <td class="px-4 py-4" colspan="5">
                  <div class="h-12 bg-slate-100 animate-pulse rounded"></div>
                </td>
              </tr>
            </template>
            <template v-else>
              <ArticleTableRow v-for="article in articles" :key="article.id" :article="article"
                :selected="selectedArticles.includes(article.id)"
                @update:selected="(selected) => toggleSelect(article.id, selected)"
                class="hover:bg-slate-50 transition-colors duration-150" />
            </template>
          </tbody>
        </table>
        <div v-if="!isLoading && articles.length === 0" class="text-center p-8 text-slate-400">
          <span class="i-heroicons-document-text-20-solid w-6 h-6 mx-auto mb-2"></span>
          <p>暂无数据</p>
        </div>
      </div>
    </div>
  </div>

  <AdminModal v-model="showCreateForm" title="新建文章" width="2xl" :loading="isLoading">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">标题</label>
        <input v-model="newArticle.title" type="text" class="input w-full" />
      </div>

      <div class="relative">
        <label class="block text-sm font-medium mb-2">内容</label>
        <div class="border rounded-lg overflow-hidden">
          <textarea v-model="newArticle.content" class="w-full h-64 font-mono text-sm p-4 focus:outline-none"
            placeholder="请输入文章内容（支持Markdown语法）..."></textarea>
          <div class="absolute bottom-4 right-4 flex gap-2">
            <span class="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
              字数：{{ newArticle.content.length }}
            </span>
            <button type="button" @click="showMarkdownHelp = true"
              class="text-blue-500 hover:text-blue-700 text-xs bg-white/80 px-2 py-1 rounded">
              语法帮助
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-slate-700">标签</label>
          <button type="button" @click="toggleAllTags" class="text-xs text-sky-600 hover:text-sky-800">
            {{ newArticle.tag_ids.length === allTagIds.length ? '取消全选' : '全选' }}
          </button>
        </div>

        <Combobox v-model="newArticle.tag_ids" multiple>
          <div class="relative mt-1">
            <div
              class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm">
              <ComboboxInput class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-slate-700 focus:ring-0"
                placeholder="搜索标签..." @change="tagSearch = $event.target.value" />
              <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
              </ComboboxButton>
            </div>
            <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <ComboboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-slate-100 focus:outline-none sm:text-sm">
                <div v-if="filteredTags.length === 0"
                  class="relative cursor-default select-none px-4 py-2 text-slate-500">
                  未找到匹配标签
                </div>
                <ComboboxOption v-for="tag in filteredTags" as="template" :key="tag.id" :value="tag.id"
                  v-slot="{ active, selected }">
                  <li class="relative cursor-default select-none py-2 pl-10 pr-4" :class="{
                    'bg-sky-100 text-sky-900': active,
                    'text-slate-700': !active,
                  }">
                    <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                      {{ tag.name }}
                    </span>
                    <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>
            </TransitionRoot>
          </div>
        </Combobox>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end space-x-4 mt-6">
        <button @click="createArticle" class="btn bg-blue-500 text-white">
          提交
        </button>
      </div>
    </template>
  </AdminModal>
</template>
