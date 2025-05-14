<script setup lang="ts">
import { motion } from 'motion-v'
import { useDPStore } from '@/stores/dpStore'
import { CalendarIcon } from '@heroicons/vue/20/solid'

const store = useDPStore()

const handleCellClick = (i: number, j: number) => {
  console.log(`Clicked cell [${i}][${j}]`)
}

// 使用主题变量定义状态类
const cellClasses = {
  active: 'bg-primary-500/90 border-primary-600 shadow-active',
  visited: 'bg-success-300/80 border-success-400',
  default: 'bg-card border-border hover:bg-background-muted'
}
</script>

<template>
  <div class="axis-container">
    <!-- 表头行 -->
    <div class="row-wrapper">
      <CalendarIcon class="axis-label text-text-muted" />
      <div class="grid-row">
        <div v-for="j in store.state.matrix[0]?.length" :key="j" class="grid-cell header-cell text-text-muted">
          {{ j - 1 }}
        </div>
      </div>
    </div>

    <!-- 数据行 -->
    <div v-for="(row, i) in store.state.matrix" :key="i" class="row-wrapper theme-transition">
      <div class="axis-label text-text-muted">
        {{ i === 0 ? '空' : `物品${i}` }}
      </div>

      <div class="grid-row">
        <motion.div v-for="(cell, j) in row" :key="j" :class="['grid-cell', cellClasses[cell.state]]" :animate="{
          scale: cell.state === 'active' ? [1, 1.08, 1] : 1,
          transition: { duration: 0.3 }
        }" @click="handleCellClick(i, j)">
          <div class="cell-content">
            <span class="value text-text">{{ cell.value }}</span>
            <span v-if="cell.state === 'active'" class="coordinates text-on-primary text-xs">
              ({{ i }},{{ j }})
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.axis-container {
  @apply flex flex-col p-8 bg-background-muted rounded-lg shadow-card gap-2;
}

.row-wrapper {
  @apply flex gap-3 items-center;
}

.grid-row {
  @apply flex gap-2;
}

.axis-label {
  @apply w-14 h-14 flex items-center justify-center bg-background-muted rounded-md border-2 border-border shadow-sm theme-transition;
}

.grid-cell {
  @apply w-14 h-14 border-2 flex items-center justify-center font-mono cursor-pointer theme-transition rounded-md;
}

.header-cell {
  @apply bg-background-muted;
}

.cell-content {
  @apply flex flex-col items-center justify-center gap-0.5;
}

.bg-primary-500\/90 {
  animation: theme-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes theme-pulse {

  0%,
  100% {
    transform: scale(1)
  }

  50% {
    transform: scale(1.08)
  }
}
</style>
