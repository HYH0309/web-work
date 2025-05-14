<script setup lang="ts">
import { motion } from 'motion-v'
import { useSearchStore } from '@/stores/searchStore'

const store = useSearchStore()

const cellClass = (cell: string) => {
  switch (cell) {
    case 'start': return 'start-state'
    case 'end': return 'pivot-state'
    case 'wall': return 'wall-state'
    case 'visited': return 'active-state'
    case 'path': return 'path-state'
    default: return 'bg-card'
  }
}

const handleCellClick = (row: number, col: number) => {
  if (store.state.grid[row][col] === 'empty') {
    store.state.grid[row][col] = 'wall'
  } else if (store.state.grid[row][col] === 'wall') {
    store.state.grid[row][col] = 'empty'
  }
}
</script>

<template>
  <div class="grid-container">
    <div v-for="(row, i) in store.state.grid" :key="i" class="grid-row w-10">
      <motion.div v-for="(cell, j) in row" :key="`${i}-${j}-${cell}`" :class="['grid-cell', cellClass(cell)]"
        @click="handleCellClick(i, j)" :animate="{ scale: [1, 1.1, 1] }" :transition="{ duration: 0.3 }" />
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  @apply flex flex-col gap-1 p-4;
}

.grid-row {
  @apply flex gap-1;
}

.grid-cell {
  @apply w-10 h-10 border-border border rounded-sm cursor-pointer theme-transition;
  box-shadow: var(--un-shadow-inset);
}

/* 状态色使用快捷方式 */
.pivot-state {
  @apply state-primary;
}

.active-state {
  @apply state-primary/80;
}

.path-state {
  @apply state-warning;
}

.start-state {
  @apply state-success;
}

.wall-state {
  @apply state-muted;
}
</style>
