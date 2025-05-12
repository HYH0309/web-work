<script setup lang="ts">
type ResultStatus = 'waiting' | 'running' | 'success' | 'error'

defineProps<{
  status: ResultStatus
  output?: string
  time?: string
  memory?: string
  error?: string
}>()

const statusMap = {
  waiting: { text: '等待中', color: 'bg-gray-500' },
  running: { text: '运行中', color: 'bg-blue-500' },
  success: { text: '通过', color: 'bg-green-500' },
  error: { text: '错误', color: 'bg-red-500' }
}
</script>

<template>
  <div class="p-4 border rounded-lg bg-white dark:bg-gray-800 mt-4">
    <div class="flex items-center mb-4">
      <span class="w-3 h-3 rounded-full mr-2" :class="statusMap[status].color" />
      <span class="font-medium">{{ statusMap[status].text }}</span>
      <div class="ml-auto flex gap-4">
        <span v-if="time">时间: {{ time }}ms</span>
        <span v-if="memory">内存: {{ memory }}MB</span>
      </div>
    </div>

    <pre v-if="output || error" class="p-3 bg-gray-100 dark:bg-gray-700 rounded whitespace-pre-wrap"
      :class="{ 'text-red-500': error }">
      {{ error || output }}
    </pre>
  </div>
</template>
