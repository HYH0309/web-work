<script setup lang="ts">
defineProps<{
  title: string
  description: string
  examples: Array<{ input: string; output: string }>
}>()
</script>

<template>
  <div class="p-4 border rounded-lg bg-white dark:bg-gray-800">
    <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>
    <div class="prose dark:prose-invert max-w-none" v-html="description" />

    <div v-for="(example, index) in examples" :key="index" class="mt-4">
      <h3 class="font-medium">示例 {{ index + 1 }}</h3>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div>
          <h4 class="text-sm font-medium">输入</h4>
          <pre class="p-2 bg-gray-100 dark:bg-gray-700 rounded">{{ example.input }}</pre>
        </div>
        <div>
          <h4 class="text-sm font-medium">输出</h4>
          <pre class="p-2 bg-gray-100 dark:bg-gray-700 rounded">{{ example.output }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
