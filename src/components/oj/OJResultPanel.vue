<script setup lang="ts">
import { computed } from 'vue'

type StatusKey =
  | 'Accept'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Compile Error'
  | 'Runtime Error'
  | 'Pending'
  | 'TIMEOUT'
  | 'STOPPED'

const props = defineProps<{
  status: boolean
  msg: StatusKey | string
}>()

const statusMap: Record<StatusKey, { text: string; color: string; icon: string }> = {
  Accept: { text: '答案正确', color: 'bg-emerald-500', icon: 'i-heroicons-check-circle-20-solid' },
  'Wrong Answer': { text: '答案错误', color: 'bg-rose-400', icon: 'i-heroicons-x-circle-20-solid' },
  'Time Limit Exceeded': { text: '超时限制', color: 'bg-amber-400', icon: 'i-heroicons-clock-20-solid' },
  'Compile Error': { text: '编译错误', color: 'bg-purple-400', icon: 'i-heroicons-x-circle-20-solid' },
  'Runtime Error': { text: '运行错误', color: 'bg-pink-400', icon: 'i-heroicons-x-circle-20-solid' },
  Pending: { text: '判题中...', color: 'bg-sky-400', icon: 'i-heroicons-arrow-path-20-solid' },
  TIMEOUT: { text: '判题超时', color: 'bg-gray-400', icon: 'i-heroicons-clock-20-solid' },
  STOPPED: { text: '已停止', color: 'bg-gray-400', icon: 'i-heroicons-clock-20-solid' }
}

// 计算当前状态信息
const statusInfo = computed(() => {
  const msgKey = props.msg as StatusKey

  if (!props.status) {
    return statusMap['Pending']
  }

  // 如果 msg 是已知的状态键，返回对应的状态信息
  if (statusMap[msgKey]) {
    return statusMap[msgKey]
  }

  // 如果是未知状态，返回默认状态并使用原始消息
  return {
    text: props.msg,
    color: 'bg-gray-400',
    icon: 'i-heroicons-question-mark-circle-20-solid'
  }
})

// 计算动画类
const animationClass = computed(() => {
  return !props.status ? 'animate-spin' : ''
})
</script>

<template>
  <div class="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-all duration-200">
    <div class="flex items-center gap-3">
      <!-- 状态图标 -->
      <div :class="[
        statusInfo.icon,
        statusInfo.color,
        'w-6 h-6 rounded-full flex items-center justify-center text-white',
        animationClass
      ]" />

      <!-- 状态文本 -->
      <span class="font-medium text-lg" :class="props.status ? 'text-gray-900 dark:text-gray-100' : 'text-sky-400'">
        {{ statusInfo.text }}
      </span>
    </div>

    <!-- 判题进行中的提示 -->
    <div v-if="!props.status" class="text-sky-400 text-sm mt-2 flex items-center gap-2">
      <div class="w-1 h-1 bg-sky-400 rounded-full animate-pulse" />
      正在检查判题状态...
    </div>
  </div>
</template>
