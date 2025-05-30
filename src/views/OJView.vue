<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Editor from '@/components/composable/BaseEditor.vue'
import Modal from '@/components/composable/BaseModal.vue'
import { api } from '@/api'
import type { JudgeResult } from '@/types/api'

const route = useRoute()
const problemId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? Number(id[0]) : Number(id)
})

const isLoading = ref(true)
const isModalOpen = ref(true) // 初始化时打开代码编辑器
const error = ref<Error | null>(null)
const problemData = ref<{
  title: string
  content: string
}>()

const fetchProblem = async () => {
  try {
    isLoading.value = true
    const res = await api.getOJProblemById(problemId.value)
    if (res.status && res.data) {
      problemData.value = res.data
    }
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err))
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProblem)

watch(problemId, fetchProblem)

const code = ref('')
const isSubmitting = ref(false)

// 语言类型到ID的映射
const languageIdMap: Record<string, number> = {
  'text/x-java': 62,
  'text/x-c++src': 54,
  'text/x-python': 71
}
const judgeStatus = ref<JudgeResult & { token?: string } | null>(null)
const currentTokens = ref<string[]>([])
const currentTokenIndex = ref(0)
const pollingInterval = ref<number>()

const statusMap = computed(() => ({
  AC: { text: '答案正确', class: 'text-green-600' },
  WA: { text: '答案错误', class: 'text-red-600' },
  TL: { text: '超时限制', class: 'text-amber-600' },
  CE: { text: '编译错误', class: 'text-purple-600' },
  RE: { text: '运行错误', class: 'text-pink-600' },
  RUNNING: { text: '判题中...', class: 'text-blue-600' },
  STOPPED: { text: '已停止', class: 'text-gray-500' },
  TIMEOUT: { text: '判题超时', class: 'text-gray-600' }
}))

const handleSubmit = async (payload?: { code: string, language: string }) => {
  try {
    isSubmitting.value = true
    const sourceCode = payload?.code || code.value
    const languageId = payload?.language ? languageIdMap[payload.language] : 71 // Default to Python if not specified

    const res = await api.submitCode({
      tid: problemId.value,
      source_code: sourceCode,
      language_id: languageId
    })

    if (res.status && res.data?.tokens?.length) {
      currentTokens.value = res.data.tokens
      startPolling()
    }
  } finally {
    isSubmitting.value = false
  }
}

const startPolling = () => {
  const startTime = Date.now()

  pollingInterval.value = window.setInterval(async () => {
    if (Date.now() - startTime > 300000) { // 5分钟超时
      stopPolling()
      judgeStatus.value = { status: false, msg: 'TIMEOUT' }
      return
    }

    if (currentTokenIndex.value >= currentTokens.value.length - 1) {
      stopPolling()
      return
    }

    const currentToken = currentTokens.value[currentTokenIndex.value]
    const res = await api.getJudgeResult(currentToken)

    if (res.status && res.data) {
      judgeStatus.value = { ...res.data, token: currentToken }

      if (res.data.status) {
        currentTokenIndex.value++
        if (currentTokenIndex.value >= currentTokens.value.length - 1) {
          stopPolling()
        }
      }
    }
  }, 3000)
}

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = undefined
  }
}

const retrySubmit = () => {
  judgeStatus.value = null
  currentTokens.value = []
  currentTokenIndex.value = 0
  handleSubmit()
}

onUnmounted(stopPolling)
</script>

<template>
  <div class="container mx-auto p-4 max-w-6xl">
    <div class="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
      <!-- 题目详情和判题结果 -->
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ problemData?.title }}</h1>
          <button class="bg-green" @click="isModalOpen = true"></button>
        </div>

        <article class="prose max-w-none">
          <pre class="whitespace-pre-wrap">{{ problemData?.content }}</pre>
        </article>
      </div>

      <!-- 代码编辑和提交 -->
      <div class="space-y-4">
        <div class="h-96">
          <Modal :show="isModalOpen" @close-show="isModalOpen = false">
            <Editor v-model="code" @submit="handleSubmit" />
          </Modal>
        </div>

        <div class="sticky top-4 space-y-6">
          <button @click="() => handleSubmit()" :disabled="isSubmitting"
            class="w-full px-6 py-3 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isSubmitting" class="i-heroicons-arrow-path-20-solid animate-spin w-5 h-5"></span>
            <span v-else class="i-heroicons-code-bracket-20-solid w-5 h-5"></span>
            {{ isSubmitting ? '提交中...' : '提交代码' }}
          </button>

          <div v-if="judgeStatus" class="p-4 rounded-lg border" :class="{
            'bg-emerald-50 border-emerald-200 text-emerald-600': judgeStatus.msg === 'AC',
            'bg-rose-50 border-rose-200 text-rose-600': ['WA', 'CE', 'RE'].includes(judgeStatus.msg),
            'bg-amber-50 border-amber-200 text-amber-600': ['TL', 'TIMEOUT'].includes(judgeStatus.msg),
            'bg-blue-50 border-blue-200 text-blue-600': judgeStatus.msg === 'RUNNING'
          }">
            <div class="flex items-center gap-3">
              <span v-if="judgeStatus.msg === 'AC'" class="i-heroicons-check-circle-20-solid w-5 h-5"></span>
              <span v-else-if="['WA', 'CE', 'RE'].includes(judgeStatus.msg)"
                class="i-heroicons-exclamation-circle-20-solid w-5 h-5"></span>
              <span v-else-if="judgeStatus.msg === 'RUNNING'"
                class="i-heroicons-arrow-path-20-solid animate-spin w-5 h-5"></span>
              <span v-else class="i-heroicons-clock-20-solid w-5 h-5"></span>
              <span class="font-medium">{{ statusMap[judgeStatus.msg].text }}</span>
              <button v-if="judgeStatus.msg === 'TIMEOUT' || judgeStatus.msg === 'STOPPED'" @click="retrySubmit"
                class="text-sm underline">
                重试
              </button>
            </div>
            <div v-if="judgeStatus.msg === 'RUNNING'" class="mt-2 text-sm">
              正在检查判题状态...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
