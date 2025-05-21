<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon, TrashIcon, DocumentArrowUpIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/vue/24/outline'
import { api } from '@/api'
import type { OJProblem, OJTestCase, Result } from '@/types/api'
import AdminModal from '@/components/admin/AdminModal.vue'
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
  errorMessage.value = ''
  if (!newProblem.value.title.trim() || !newProblem.value.content.trim()) {
    errorMessage.value = '请填写题目标题和内容'
    return
  }

  try {
    isLoading.value = true
    const result: Result = await api.postOJProblem(newProblem.value)
    if (result.status) {
      await loadProblems()
      showProblemForm.value = false
      newProblem.value = { id: 0, title: '', content: '' } // Reset form
    } else {
      errorMessage.value = '题目创建失败，请检查网络或数据格式'
    }
  } catch {
    errorMessage.value = '请求异常，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

const handleFileUpload = async (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || []);
  const fileMap = new Map<string, { input?: string; output?: string }>();

  try {
    await Promise.all(files.map(async (file) => {
      const content = await file.text();
      const match = file.name.match(/^(\d+)\.(in|out)$/);
      if (!match) return;

      const [, index, type] = match;
      if (!fileMap.has(index)) fileMap.set(index, {});
      const entry = fileMap.get(index)!;
      if (type === 'in') {
        entry.input = content;
      } else {
        entry.output = content;
      }
    }));

    const newTestCases = Array.from(fileMap.entries())
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([index, { input, output }]) => {
        if (!input || !output) {
          errorMessage.value = `测试用例${index}缺少输入或输出文件`;
          return null;
        }
        return { input, output };
      })
      .filter(Boolean) as OJTestCase[];

    testCases.value = [...testCases.value, ...newTestCases];
    if (newTestCases.length === 0) {
      errorMessage.value = '未找到有效的测试用例文件';
    }
  } catch {
    errorMessage.value = '文件读取失败，请检查文件格式';
  }
};

const createTestCases = async () => {
  errorMessage.value = '';
  if (!currentProblemId.value) {
    errorMessage.value = '请先选择题目';
    return;
  }
  if (testCases.value.length === 0) {
    errorMessage.value = '请添加至少一个测试用例'
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

// 测试用例操作方法
const addTestCase = () => {
  testCases.value.push({ input: '', output: '' });
};

const removeTestCase = (index: number) => {
  testCases.value.splice(index, 1);
};

const downloadTestCases = async () => {
  try {
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    testCases.value.forEach((testCase, index) => {
      zip.file(`${index + 1}.in`, testCase.input);
      zip.file(`${index + 1}.out`, testCase.output);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `testcases-${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch {
    errorMessage.value = '导出文件失败，请重试';
  }
};

const showTestCaseView = ref(false)
const existingTestCases = ref<OJTestCase[]>([])

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
};

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
              <button @click="currentProblemId = problem.id; showTestCaseForm = true"
                class="text-green-500 hover:text-green-700" title="添加测试用例">
                <PlusIcon class="h-5 w-5" />
              </button>
              <button @click="viewTestCases(problem.id)" class="text-blue-500 hover:text-blue-700" title="查看测试用例">
                <EyeIcon class="h-5 w-5" />
              </button>
              <button @click="deleteProblem(problem.id)" class="text-red-500 hover:text-red-700" title="删除题目">
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
          <button @click="showProblemForm = false" class="btn bg-gray-300 hover:bg-gray-400">
            取消
          </button>
          <button @click="createProblem" class="btn bg-blue-500 text-white hover:bg-blue-600">
            保存
          </button>
        </div>
      </template>
    </AdminModal>

    <!-- 查看测试用例弹窗 -->
    <AdminModal v-model="showTestCaseView" title="测试用例详情" width="2xl">
      <div class="max-h-[70vh] overflow-y-auto pr-2 scrollbar scrollbar-w-2 scrollbar-thumb-rounded-full">
        <div v-for="(testCase, index) in existingTestCases" :key="index" class="p-4 bg-gray-50 rounded-lg mb-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">输入样例 #{{ index + 1 }}</label>
              <pre class="font-mono text-sm p-2 bg-white rounded border border-gray-200">{{ testCase.input }}</pre>
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">输出样例 #{{ index + 1 }}</label>
              <pre class="font-mono text-sm p-2 bg-white rounded border border-gray-200">{{ testCase.output }}</pre>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="downloadTestCases" class="btn bg-gray-500 hover:bg-gray-600 text-white">
          <ArrowDownTrayIcon class="h-5 w-5 mr-1" />
          导出ZIP包
        </button>
      </template>
    </AdminModal>

    <AdminModal v-model="showTestCaseForm" title="添加测试用例" width="2xl" :loading="isLoading">
      <div class="space-y-4">
        <div class="flex gap-2">
          <button @click="addTestCase"
            class="btn bg-green-500 hover:bg-green-600 text-white transition-all duration-200">
            <PlusIcon class="h-4 w-4 mr-1" />
            新增测试用例
          </button>
          <button @click="downloadTestCases"
            class="btn bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200">
            <ArrowDownTrayIcon class="h-4 w-4 mr-1" />
            导出为文件
          </button>
          <div class="ml-4 flex items-center">
            <input type="file" webkitdirectory multiple @change="handleFileUpload"
              class="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="(testCase, index) in testCases" :key="index"
            class="group relative p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
            <button @click="removeTestCase(index)" class="absolute right-2 top-2 p-1 text-red-500 hover:text-red-700"
              title="删除用例">
              <TrashIcon class="h-4 w-4" />
            </button>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">
                  输入样例 #{{ index + 1 }}
                </label>
                <textarea v-model="testCase.input"
                  class="textarea w-full h-32 font-mono text-sm bg-gray-50 border-gray-200" placeholder="输入内容..." />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">
                  输出样例 #{{ index + 1 }}
                </label>
                <textarea v-model="testCase.output"
                  class="textarea w-full h-32 font-mono text-sm bg-gray-50 border-gray-200" placeholder="输出内容..." />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <details class="cursor-pointer">
            <summary class="text-sm font-medium text-gray-700">JSON 预览</summary>
            <pre class="mt-2 text-sm font-mono text-gray-600 overflow-auto max-h-40">{{ testCaseJson }}</pre>
          </details>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-4">
          <button @click="createTestCases" class="btn bg-blue-500 text-white">
            <DocumentArrowUpIcon class="h-5 w-5 mr-1" />
            批量导入
          </button>
        </div>
      </template>
    </AdminModal>
  </div>
</template>
