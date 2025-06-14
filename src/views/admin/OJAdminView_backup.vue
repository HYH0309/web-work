<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { PlusIcon, DocumentArrowUpIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { md } from '@/composables/useMarked'
import { api } from '@/api'
import type { OJProblem, OJTestCase, Result } from '@/types/api'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { OJ_ACTION_BUTTONS, OJ_TABLE_COLUMNS, OJ_MESSAGES } from '@/config/oj-admin'
import { FileHandler, TestCaseUtils, ZipExporter } from '@/utils/oj-admin'

// Main CRUD operations
const {
  items: ojProblems,
  isLoading,
  errorMessage,
  showForm: showProblemForm,
  handleCreate: createProblem,
  handleDelete: deleteProblem,
  loadItems: loadProblems
} = useAdminCrud<OJProblem>({
  fetch: async () => {
    const { status, data } = await api.getOJProblems()
    return status ? data || [] : []
  },
  create: async (problem) => {
    const { status } = await api.postOJProblem(problem)
    return status ? { id: Date.now(), ...problem } : Promise.reject()
  },
  delete: async (id) => {
    const { status } = await api.deleteOJProblem(id)
    return status ? undefined : Promise.reject()
  }
})

// State management
const showTestCaseForm = ref(false)
const showTestCaseView = ref(false)
const showContentPreview = ref(false)
const currentProblemId = ref<number | null>(null)
const previewContent = ref('')
const newProblem = ref<Omit<OJProblem, 'id'>>({ title: '', content: '' })
const testCases = ref<OJTestCase[]>([])
const existingTestCases = ref<OJTestCase[]>([])
const showConfirmDelete = ref(false)
const problemToDelete = ref<OJProblem | null>(null)

// JSON computed property for test cases
const testCaseJson = computed({
  get: () => TestCaseUtils.toJSON(testCases.value),
  set: (value: string) => {
    testCases.value = TestCaseUtils.fromJSON(value)
  }
})

// File upload handler
const handleFileUpload = async (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || [])
  const result = await FileHandler.processUploadedFiles(files)

  if (result.error) {
    errorMessage.value = result.error
  } else {
    testCases.value = [...testCases.value, ...result.testCases]
  }
}

// Test case operations
const addTestCase = () => testCases.value.push(TestCaseUtils.createEmpty())
const removeTestCase = (index: number) => testCases.value.splice(index, 1)
const downloadTestCases = async () => {
  try {
    await ZipExporter.exportTestCases(testCases.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '导出失败'
  }
}
const createTestCases = async () => {
  errorMessage.value = ''

  if (!currentProblemId.value) {
    errorMessage.value = OJ_MESSAGES.error.selectProblem
    return
  }

  if (testCases.value.length === 0) {
    errorMessage.value = OJ_MESSAGES.error.noTestCases
    return
  }

  try {
    isLoading.value = true
    const result: Result = await api.postOJTestCase(testCases.value, currentProblemId.value)
    if (result.status) {
      showTestCaseForm.value = false
      testCases.value = []
      currentProblemId.value = null
    } else {
      errorMessage.value = '测试用例保存失败，请检查数据格式'
    }
  } catch {
    errorMessage.value = '请求异常，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// Content and modals
const showProblemContent = (content: string) => {
  previewContent.value = md.render(content)
  showContentPreview.value = true
}

const viewTestCases = async (problemId: number) => {
  try {
    isLoading.value = true
    const { status, data } = await api.getOJTestCases(problemId)
    if (status && data) {
      existingTestCases.value = data
      showTestCaseView.value = true
    }
  } finally {
    isLoading.value = false
  }
}

// Action handlers
const actions = {
  handleAddTestCase: (problem: OJProblem) => {
    currentProblemId.value = problem.id
    showTestCaseForm.value = true
  },

  handlePreview: (problem: OJProblem) => {
    showProblemContent(problem.content)
  },

  handleViewTestCases: (problem: OJProblem) => {
    viewTestCases(problem.id)
  },

  handleDelete: (problem: OJProblem, event?: Event) => {
    if (event) event.preventDefault()
    problemToDelete.value = problem
    showConfirmDelete.value = true
  }
}

// Action dispatcher
const handleAction = (actionType: string, problem: OJProblem, event?: Event) => {
  const handler = actions[actionType as keyof typeof actions]
  if (handler) handler(problem, event)
}

loadProblems()

// 确认删除操作
const confirmDelete = async () => {
  if (problemToDelete.value) {
    try {
      await deleteProblem(problemToDelete.value.id)
      showConfirmDelete.value = false
      problemToDelete.value = null
    } catch (error) {
      console.error('删除题目失败:', error)
    }
  }
}
</script>

<template>
  <!-- 工具栏 -->
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" 
       role="toolbar" 
       aria-label="OJ题目管理工具栏">
    <div class="text-sm text-gray-600 dark:text-gray-400" aria-live="polite" role="status">
      OJ题目管理 (共 {{ ojProblems.length }} 道题目)
    </div>
    <button @click="showProblemForm = true"
            class="w-full sm:w-auto px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="新建OJ题目">
      <PlusIcon class="h-4 w-4 mr-1" aria-hidden="true" />
      新建题目
    </button>
  </div>

  <!-- 表格 -->
  <section class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" 
           aria-labelledby="problems-table-title">
    <h2 id="problems-table-title" class="sr-only">OJ题目列表</h2>
    
    <!-- 移动端卡片布局 -->
    <div class="block md:hidden space-y-2" 
         role="list" 
         :aria-label="`共${ojProblems.length}道OJ题目`">
      <div v-for="problem in ojProblems" :key="problem.id"
           class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
           role="listitem">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ problem.title }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">ID: {{ problem.id }}</div>
          </div>
          <div class="flex gap-2 ml-4" role="group" :aria-label="`${problem.title}题目操作`">
            <button v-for="action in OJ_ACTION_BUTTONS" :key="action.type"
                    @click="handleAction(action.handler, problem, $event)" 
                    :class="[
                      'p-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm',
                      action.bgColor,
                      action.textColor,
                      action.hoverBg
                    ]" 
                    :title="action.title"
                    :aria-label="`${action.title}: ${problem.title}`">
              <component :is="action.icon" class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div v-if="ojProblems.length === 0" 
           class="p-8 text-center text-gray-500 dark:text-gray-400" 
           role="status">
        <div class="flex flex-col items-center">
          <p class="mb-2">暂无数据</p>
          <button @click="showProblemForm = true"
                  class="text-sm text-purple-600 dark:text-purple-400 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                  aria-label="添加第一个OJ题目">
            添加第一个题目
          </button>
        </div>
      </div>
    </div>

    <!-- 桌面端表格布局 -->
    <table class="hidden md:table min-w-full" 
           role="table"
           aria-labelledby="problems-table-title"
           aria-describedby="problems-table-desc">
      <caption id="problems-table-desc" class="sr-only">
        OJ题目管理表格，包含题目ID、标题和操作按钮，共{{ ojProblems.length }}条记录
      </caption>
      <thead class="bg-gray-50 dark:bg-gray-800/50">
        <tr role="row">
          <th v-for="column in OJ_TABLE_COLUMNS" 
              :key="column.key" 
              :class="[
                'px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700',
                column.width || '',
                `text-${column.align || 'left'}`
              ]"
              scope="col"
              role="columnheader">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700/50">
        <tr v-for="problem in ojProblems" 
            :key="problem.id"
            class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-200"
            role="row">
          <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600 dark:text-gray-300" role="cell">
            {{ problem.id }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white" role="cell">
            {{ problem.title }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right" role="cell">
            <div class="flex gap-2 justify-end" role="group" :aria-label="`${problem.title}题目操作`">
              <button v-for="action in OJ_ACTION_BUTTONS" 
                      :key="action.type"
                      @click="handleAction(action.handler, problem, $event)" 
                      :class="[
                        'p-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm',
                        action.bgColor,
                        action.textColor,
                        action.hoverBg
                      ]" 
                      :title="action.title"
                      :aria-label="`${action.title}: ${problem.title}`">
                <component :is="action.icon" class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="ojProblems.length === 0">
          <td :colspan="OJ_TABLE_COLUMNS.length" 
              class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
              role="cell">
            <div class="flex flex-col items-center">
              <p class="mb-2">暂无数据</p>
              <button @click="showProblemForm = true"
                      class="text-sm text-purple-600 dark:text-purple-400 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                      aria-label="添加第一个OJ题目">
                添加第一个题目
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- 模态框 -->
  <AdminModal v-model="showProblemForm" title="新建题目" width="xl" :loading="isLoading">
    <div class="space-y-6">
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">标题</label>
        <input v-model="newProblem.title"
          class="block w-3/4 mx-auto text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors" 
          placeholder="请输入题目标题" />
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">题目内容 (支持Markdown)</label>
        <textarea v-model="newProblem.content"
          class="block w-3/4 mx-auto h-48 text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors resize-none"
          placeholder="请输入题目内容，支持Markdown格式"></textarea>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end space-x-3">
        <button @click="showProblemForm = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
          取消
        </button>
        <button @click="createProblem(newProblem)"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors">
          保存
        </button>
      </div>
    </template>
  </AdminModal>

  <!-- 题目内容预览弹窗 -->
  <AdminModal v-model="showContentPreview" title="题目内容预览" width="xl">
    <div class="prose prose-sm max-w-none dark:prose-invert">
      <div v-html="previewContent"></div>
    </div>
  </AdminModal>

  <!-- 查看测试用例弹窗 -->
  <AdminModal v-model="showTestCaseView" title="测试用例详情" width="xl">
    <div class="max-h-[60vh] overflow-y-auto pr-1 scrollbar scrollbar-w-1 scrollbar-thumb-rounded-full">
      <template v-if="existingTestCases.length">
        <div v-for="(testCase, index) in existingTestCases" :key="index"
          class="p-3 mb-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">输入 #{{ index + 1 }}</label>
              <pre
                class="font-mono text-xs p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 max-h-32 overflow-auto">{{ testCase.input }}</pre>
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">输出 #{{ index + 1 }}</label>
              <pre
                class="font-mono text-xs p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 max-h-32 overflow-auto">{{ testCase.output }}</pre>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <p class="mb-2">暂无测试用例数据</p>
        <button @click="showTestCaseForm = true; currentProblemId = null"
          class="text-sm text-purple-600 dark:text-purple-400 hover:underline">
          添加测试用例
        </button>
      </div>
    </div>
    <template #footer>
      <button @click="downloadTestCases"
        class="px-3 py-1.5 bg-gray-500 text-white hover:bg-gray-600 text-sm rounded-lg">
        <ArrowDownTrayIcon class="h-4 w-4 mr-1 inline" />
        导出ZIP包
      </button>
    </template>
  </AdminModal>

  <AdminModal v-model="showTestCaseForm" title="添加测试用例" width="xl" :loading="isLoading">
    <div class="space-y-3">
      <!-- 操作按钮行 -->
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="flex gap-2 flex-shrink-0">
          <button @click="addTestCase" class="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg">
            <PlusIcon class="h-3 w-3 mr-0.5 inline" />新增
          </button>
        </div>
        <!-- 文件上传区域 -->
        <div class="flex-grow">
          <input type="file" webkitdirectory multiple @change="handleFileUpload"
            class="w-full text-xs text-gray-500 dark:text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 dark:file:bg-gray-700 dark:file:text-gray-200" />
        </div>
      </div>

      <div class="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        <div v-for="(testCase, index) in testCases" :key="index"
          class="group relative p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200">
          <button @click="removeTestCase(index)"
            class="absolute right-2 top-2 p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="删除用例">
            <TrashIcon class="h-4 w-4" />
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                输入 #{{ index + 1 }}
              </label>
              <textarea v-model="testCase.input"
                class="block w-full h-24 font-mono text-sm px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                placeholder="输入测试数据..."></textarea>
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                输出 #{{ index + 1 }}
              </label>
              <textarea v-model="testCase.output"
                class="block w-full h-24 font-mono text-sm px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                placeholder="期望输出..." />
            </div>
          </div>
        </div>
        <div v-if="testCases.length === 0"
          class="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
          <p class="mb-3 text-sm">请添加测试用例或上传文件</p>
          <button @click="addTestCase" class="text-sm text-purple-600 dark:text-purple-400 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
            点击添加第一个测试用例
          </button>
        </div>
      </div>

      <details
        class="cursor-pointer text-xs bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-dashed border-gray-200 dark:border-gray-700">
        <summary class="font-medium text-gray-700 dark:text-gray-300">JSON 预览</summary>
        <pre class="mt-1 font-mono text-gray-600 dark:text-gray-300 overflow-auto max-h-24">{{ testCaseJson }}</pre>
      </details>
    </div>
    <template #footer>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p class="text-xs text-gray-500 dark:text-gray-400" v-if="currentProblemId">
          正在为题目 #{{ currentProblemId }} 添加测试用例
        </p>
        <button @click="createTestCases"
          class="w-full sm:w-auto px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg flex items-center justify-center">
          <DocumentArrowUpIcon class="h-4 w-4 mr-1" />
          保存测试用例
        </button>
      </div>
    </template>
  </AdminModal>

  <!-- 删除确认对话框 -->
  <ConfirmDialog v-model:show="showConfirmDelete" title="删除题目"
    :content="`确定要删除题目 '${problemToDelete?.title || ''}' 吗？此操作不可恢复。`" confirmText="删除" cancelText="取消" :danger="true"
    @confirm="confirmDelete" />
</template>
