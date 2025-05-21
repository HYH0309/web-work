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
  newTag.value.name = tag.name
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

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="tag in tags" :key="tag.id">
            <td class="px-6 py-4 whitespace-nowrap font-mono">{{ tag.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ tag.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap space-x-2">
              <button @click="editTag(tag)" class="text-blue-500 hover:text-blue-700">
                <PencilSquareIcon class="h-5 w-5" />
              </button>
              <button @click="deleteTag(tag.id)" class="text-red-500 hover:text-red-700">
                <TrashIcon class="h-5 w-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
