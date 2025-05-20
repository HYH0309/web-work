<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon, TrashIcon, DocumentArrowUpIcon } from '@heroicons/vue/24/outline'
import { api } from '@/api'
import type { OJProblem, OJTestCase } from '@/types/api'

const ojProblems = ref<OJProblem[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const showProblemForm = ref(false)
const showTestCaseForm = ref(false)
const currentProblemId = ref<number | null>(null)

const newProblem = ref<OJProblem>({
  id: 0,
  title: '',
  content: ''
})

const testCases = ref<OJTestCase[]>([])
const testCaseJson = computed({
  get: () => JSON.stringify(testCases.value, null, 2),
  set: (value: string) => {
    try {
      testCases.value = JSON.parse(value)
    } catch {
      testCases.value = []
    }
  }
})

const loadProblems = async () => {
  try {
    isLoading.value = true
    const { status, data } = await api.getOJProblems()
    if (status && data) ojProblems.value = data
  } finally {
    isLoading.value = false
  }
}

const createProblem = async () => {
  if (!newProblem.value.title.trim() || !newProblem.value.content.trim()) {
    errorMessage.value = '请填写题目标题和内容'
    return
  }

  try {
    isLoading.value = true
    const { status, data } = await api.postOJProblem(newProblem.value)
    if (status && data) {
      currentProblemId.value = data
      showTestCaseForm.value = true
      await loadProblems()
      showProblemForm.value = false
    }
  } finally {
    isLoading.value = false
  }
}

const createTestCases = async () => {
  if (!currentProblemId.value || testCases.value.length === 0) {
    errorMessage.value = '请先创建题目并添加测试用例'
    return
  }

  try {
    isLoading.value = true
    const { status } = await api.postOJTestCase(testCases.value, currentProblemId.value)
    if (status) {
      showTestCaseForm.value = false
      testCases.value = []
      currentProblemId.value = null
    }
  } finally {
    isLoading.value = false
  }
}

const deleteProblem = async (id: number) => {
  try {
    isLoading.value = true
    const { status } = await api.deleteOJProblem(id)
    if (status) await loadProblems()
  } finally {
    isLoading.value = false
  }
}

loadProblems()
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">OJ题目管理</h1>
      <button @click="showProblemForm = true" class="btn bg-blue-500 text-white">
        <PlusIcon class="h-5 w-5 mr-1" />
        新建题目
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="problem in ojProblems" :key="problem.id">
            <td class="px-6 py-4 whitespace-nowrap font-mono">{{ problem.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ problem.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap space-x-2">
              <button @click="deleteProblem(problem.id)" class="text-red-500 hover:text-red-700">
                <TrashIcon class="h-5 w-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminModal v-model="showProblemForm" title="新建题目" width="2xl" :loading="isLoading">
      <div class="space-y-4">
        <div>
          <label class="block mb-2">标题</label>
          <input v-model="newProblem.title" class="input w-full" />
        </div>
        <div>
          <label class="block mb-2">题目内容</label>
          <textarea v-model="newProblem.content" class="textarea w-full h-64"></textarea>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-4">
          <button @click="showProblemForm = false" class="btn bg-gray-100">
            取消
          </button>
          <button @click="createProblem" class="btn bg-blue-500 text-white">
            保存
          </button>
        </div>
      </template>
    </AdminModal>

    <AdminModal v-model="showTestCaseForm" title="添加测试用例" width="2xl" :loading="isLoading">
      <div class="space-y-4">
        <div>
          <label class="block mb-2">测试用例 (JSON数组格式)</label>
          <textarea v-model="testCaseJson" class="textarea w-full h-64 font-mono text-sm"
            placeholder='[{"input":"...", "output":"..."}, ...]'></textarea>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-4">
          <button @click="showTestCaseForm = false" class="btn bg-gray-100">
            取消
          </button>
          <button @click="createTestCases" class="btn bg-blue-500 text-white">
            <DocumentArrowUpIcon class="h-5 w-5 mr-1" />
            批量导入
          </button>
        </div>
      </template>
    </AdminModal>
  </div>
</template>
