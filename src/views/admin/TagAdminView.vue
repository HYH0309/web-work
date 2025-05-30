<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import { api } from '@/api'
import type { Tag } from '@/types/api'
import AdminModal from '@/components/admin/AdminModal.vue'
const tags = ref<Tag[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const showTagForm = ref(false)
const editingTag = ref<Tag | null>(null)

const newTag = ref({
  name: ''
})

const loadTags = async () => {
  try {
    isLoading.value = true
    const { status, data } = await api.getTags()
    if (status && data) tags.value = data
  } finally {
    isLoading.value = false
  }
}

const submitTag = async () => {
  if (!newTag.value.name.trim()) {
    errorMessage.value = '请输入标签名称'
    return
  }

  try {
    isLoading.value = true
    if (editingTag.value) {
      const { status } = await api.updateTag(editingTag.value.id, newTag.value)
      if (status) {
        await loadTags()
        showTagForm.value = false
      }
    } else {
      const { status } = await api.createTag(newTag.value.name)
      if (status) {
        await loadTags()
        showTagForm.value = false
      }
    }
  } finally {
    isLoading.value = false
  }
}

const deleteTag = async (id: number) => {
  try {
    isLoading.value = true
    const { status } = await api.deleteTag(id)
    if (status) await loadTags()
  } finally {
    isLoading.value = false
  }
}

const editTag = (tag: Tag) => {
  editingTag.value = tag
  newTag.value = {
    name: tag.name
  }
  showTagForm.value = true
}

loadTags()
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">标签管理</h1>
      <button @click="showTagForm = true" class="btn bg-blue-500 text-white">
        <PlusIcon class="h-5 w-5 mr-1" />
        新建标签
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 w-20">ID</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 min-w-[200px]">名称</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-gray-500 w-32">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <template v-if="isLoading">
              <tr v-for="i in 3" :key="i">
                <td class="px-6 py-4" colspan="4">
                  <div class="h-12 bg-gray-100 animate-pulse rounded"></div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="tag in tags" :key="tag.id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-4 py-3 whitespace-nowrap font-mono text-sm">{{ tag.id }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ tag.name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">
                  <div class="inline-flex space-x-3">
                    <button @click="editTag(tag)"
                      class="p-2 bg-blue-50 rounded-md text-blue-600 hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all duration-200 transform-gpu"
                      title="编辑">
                      <PencilSquareIcon class="h-5 w-5" />
                    </button>
                    <button @click="(e: MouseEvent) => { e.preventDefault(); deleteTag(tag.id) }"
                      class="p-2 bg-red-50 rounded-md text-red-600 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all duration-200 transform-gpu"
                      title="删除">
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <div v-if="!isLoading && tags.length === 0" class="text-center p-8 text-gray-500">
          暂无标签数据
        </div>
      </div>
    </div>

    <AdminModal v-model="showTagForm" :title="editingTag ? '编辑标签' : '新建标签'" width="md" :loading="isLoading">
      <div class="space-y-4">
        <div>
          <label class="block mb-2">标签名称</label>
          <input v-model="newTag.name" class="input w-full" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-4">
          <button @click="submitTag" class="btn bg-blue-500 text-white">
            {{ editingTag ? '更新' : '保存' }}
          </button>
        </div>
      </template>
    </AdminModal>
  </div>
</template>
