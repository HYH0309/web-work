<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Modal from '@/components/composable/BaseModal.vue'
import OJResultPanel from '@/components/oj/OJResultPanel.vue'
import OJLanguageSelector from '@/components/oj/OJLanguageSelector.vue'
import { api } from '@/api'
import type { JudgeResult } from '@/types/api'
import Codemirror from "codemirror-editor-vue3"
import "codemirror/mode/clike/clike"
import "codemirror/mode/python/python"

// 常量配置
const LANGUAGES = [
  { value: 'text/x-java', label: 'Java', icon: 'i-logos:java' },
  { value: 'text/x-c++src', label: 'C++', icon: 'i-logos:c-plusplus' },
  { value: 'text/x-python', label: 'Python', icon: 'i-logos:python' }
]

const LANGUAGE_ID_MAP: Record<string, number> = {
  'text/x-java': 62,
  'text/x-c++src': 54,
  'text/x-python': 71
}

const DEFAULT_CODE = `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`

// 响应式状态
const route = useRoute()
const problemId = computed(() => Number(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id))

const currentLanguage = ref(LANGUAGES[0].value)
const code = ref(DEFAULT_CODE)
const isModalOpen = ref(false)
const isLoading = ref(true)
const error = ref<Error | null>(null)
const problemData = ref<{ title: string; content: string } | null>(null)

// 判题相关状态
const judgeStatus = ref<(JudgeResult & { token?: string }) | null>(null)
const tokens = ref<string[]>([])
const pollingInterval = ref<number>()
const submitStatus = ref<'idle' | 'loading'>('idle')

// 获取题目数据
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

// 提交代码
const submitCode = async () => {
  submitStatus.value = 'loading'
  judgeStatus.value = null

  try {
    const languageId = LANGUAGE_ID_MAP[currentLanguage.value]
    const res = await api.submitCode({
      tid: problemId.value,
      source_code: code.value,
      language_id: languageId
    })

    if (res.status && res.data?.tokens?.length) {
      tokens.value = res.data.tokens
      startPolling()
    }
  } catch (err) {
    console.error('提交失败:', err)
  } finally {
    submitStatus.value = 'idle'
  }
}

// 轮询判题结果
const startPolling = () => {
  const startTime = Date.now()
  const TIMEOUT = 300000 // 5分钟

  pollingInterval.value = window.setInterval(async () => {
    // 超时检查
    if (Date.now() - startTime > TIMEOUT) {
      stopPolling()
      judgeStatus.value = { status: true, msg: 'TIMEOUT' }
      return
    }

    if (!tokens.value.length) return

    try {
      const res = await api.getJudgeResult(tokens.value[0])
      if (res.status && res.msg) {
        judgeStatus.value = { ...res, token: tokens.value[0] }
        if (res.status === true) {
          stopPolling()
        }
      }
    } catch (err) {
      console.error('获取判题结果失败:', err)
    }
  }, 3000)
}

// 停止轮询
const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = undefined
  }
}

// 计算属性
const codemirrorOptions = computed(() => ({
  mode: currentLanguage.value,
  theme: 'default',
  lineNumbers: true,
  fontFamily: 'monospace',
  lineWrapping: true,
  indentUnit: 2
}))

const isSubmitting = computed(() => submitStatus.value === 'loading')

// 生命周期
onMounted(fetchProblem)
watch(problemId, fetchProblem)
onUnmounted(stopPolling)
</script>

<template>
  <div class="container mx-auto p-6 max-w-5xl">
    <!-- 题目详情 -->
    <section
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <header class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ problemData?.title || '加载中...' }}
        </h1>
        <button @click="isModalOpen = true"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">
          提交代码
        </button>
      </header>

      <article class="prose max-w-none dark:prose-invert">
        <pre class="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-sm leading-relaxed overflow-auto border">{{
          problemData?.content || '题目加载中...'
        }}</pre>
      </article>
    </section>

    <!-- 判题结果 -->
    <OJResultPanel v-if="judgeStatus" :status="judgeStatus.status" :msg="judgeStatus.msg" />

    <!-- 代码编辑器弹窗 -->
    <Modal :show="isModalOpen" @close-show="isModalOpen = false">
      <div class="w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <!-- 头部 -->
        <header class="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">代码编辑器</h2>
        </header>

        <!-- 内容区域 -->
        <div class="p-6 space-y-4">
          <!-- 语言选择 -->
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              编程语言：
            </label>
            <OJLanguageSelector v-model="currentLanguage" :languages="LANGUAGES" />
          </div>

          <!-- 代码编辑器 -->
          <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <Codemirror v-model:value="code" :options="codemirrorOptions" height="400" width="100%" />
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-between items-center pt-4">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              支持 Java/C++/Python，Ctrl+Enter 快速提交
            </p>
            <button @click="submitCode" :disabled="isSubmitting"
              class="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
              <span v-if="isSubmitting" class="i-heroicons-arrow-path-20-solid animate-spin w-5 h-5" />
              {{ isSubmitting ? '提交中...' : '提交代码' }}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
