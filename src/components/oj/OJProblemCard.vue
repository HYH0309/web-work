<script setup lang="ts">
defineProps<{
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
}>()

const difficultyColors = {
  easy: 'bg-emerald-100 text-emerald-800',
  medium: 'bg-amber-100 text-amber-800',
  hard: 'bg-rose-100 text-rose-800'
}
</script>

<template>
  <div class="p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all cursor-pointer">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <span class="px-2 py-1 text-xs rounded-full font-medium" :class="difficultyColors[difficulty]">
        {{ difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难' }}
      </span>
    </div>
  </div>
</template>
