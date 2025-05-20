<script setup lang="ts">
defineProps<{
  id: number,
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
}>()

const difficultyColors = {
  easy: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  hard: 'bg-danger/10 text-danger'
}
</script>

<template>
  <RouterLink :to="`/oj/${id}`" class="no-underline">
    <div class="card-base cursor-pointer p-6 hover:transform-gpu hover:scale-[1.02] transition-all duration-300">
      <div class="grid grid-cols-[1fr_auto] items-center gap-4">
        <h3 class="text-lg font-medium text-foreground truncate">{{ title }}</h3>
        <span class="px-3 py-1.5 text-sm rounded-full font-medium" :class="difficultyColors[difficulty]">
          {{ difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难' }}
        </span>
      </div>
      <div class="mt-4 flex justify-between items-center text-sm text-muted-foreground">
        <span>通过率: 85%</span>
        <span>提交数: 1.2k</span>
      </div>
    </div>
  </RouterLink>
</template>
