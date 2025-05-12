<script setup lang="ts">
import { motion } from 'motion-v'
import { useSearchStore } from '@/stores/searchStore'

const store = useSearchStore()

const cellClass = (cell: string) => {
  switch (cell) {
    case 'start': return 'bg-green-500'
    case 'end': return 'bg-red-500'
    case 'wall': return 'bg-gray-800'
    case 'visited': return 'bg-blue-400'
    case 'path': return 'bg-yellow-400'
    default: return 'bg-purple'
  }
}

const handleCellClick = (row: number, col: number) => {
  // Toggle between empty and wall
  if (store.state.grid[row][col] === 'empty') {
    store.state.grid[row][col] = 'wall'
  } else if (store.state.grid[row][col] === 'wall') {
    store.state.grid[row][col] = 'empty'
  }
}
</script>

<template>
  <div class="grid-container">
    <div v-for="(row, i) in store.state.grid" :key="i" class="grid-row">
      <motion.div v-for="(cell, j) in row" :key="`${i}-${j}-${cell}`" :class="['grid-cell', cellClass(cell)]"
        @click="handleCellClick(i, j)" :animate="{
          scale: [1, 1.1, 1],
        }" />
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
  @apply w-11 h-11 border border-gray-300 rounded-sm cursor-pointer rounded-sm;
}
</style>
