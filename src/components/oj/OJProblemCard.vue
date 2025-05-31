<script setup lang="ts">
defineProps<{ id: number; title: string }>()
</script>

<template>
  <RouterLink :to="{ name: 'OJDetail', params: { id } }" class="block no-underline">
    <div tabindex="0" class="oj-problem-card">
      <div class="flex items-center gap-3">
        <h3 class="oj-problem-title">{{ title }}</h3>
      </div>
      <div class="oj-problem-id">题目ID: #{{ id }}</div>
    </div>
  </RouterLink>
</template>

<style scoped>
.oj-problem-card {
  @apply p-6 rounded-xl bg-white shadow-lg dark:bg-sky-950 border border-sky-100 dark:border-sky-900 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-sky-50 dark:hover:bg-sky-900 active:scale-95 focus:ring-2 focus:ring-sky-300 outline-none;
}

.oj-problem-title {
  @apply text-lg font-semibold text-sky-700 dark:text-sky-200 truncate;
}

.oj-problem-id {
  @apply mt-2 text-xs text-gray-400;
}
</style>
