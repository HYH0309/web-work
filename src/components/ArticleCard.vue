<script setup lang="ts">
defineProps<{
  title: string
  tags?: string[]  // 简化为字符串数组
  date?: string
  cover?: string   // 更简短的属性名
}>()
</script>

<template>
  <article class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
    <!-- 封面图 -->
    <img v-if="cover" :src="cover" class="w-full h-40 object-cover rounded-t-lg" loading="lazy">

    <!-- 内容区域 -->
    <div class="p-4">
      <!-- 元信息 -->
      <div v-if="date" class="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
        <div class="i-heroicons-calendar w-4 h-4" />
        {{ date }}
      </div>

      <!-- 标题 -->
      <h3 class="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
        {{ title }}
      </h3>

      <!-- 标签 -->
      <div v-if="tags?.length" class="flex flex-wrap gap-1.5">
        <span v-for="(tag, i) in tags" :key="i" class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
          {{ tag }}
        </span>
      </div>
    </div>
  </article>
</template>
