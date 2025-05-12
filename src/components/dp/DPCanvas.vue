<script setup lang="ts">
import { motion } from 'motion-v'
import { useDPStore } from '@/stores/dpStore'
import { CalendarIcon } from '@heroicons/vue/20/solid'

const store = useDPStore()

const handleCellClick = (i: number, j: number) => {
  console.log(`Clicked cell [${i}][${j}]`)
}

const cellClasses = {
  active: 'bg-blue-400/90 border-blue-600 shadow-lg',
  visited: 'bg-green-200/80 border-green-400',
  default: 'bg-white border-gray-200 hover:bg-gray-50'
}
</script>

<template>
  <div class="axis-container">
    <!-- 表头行 -->
    <div class="row-wrapper">
      <CalendarIcon class="axis-label" />
      <div class="grid-row">
        <div v-for="j in store.state.matrix[0]?.length" :key="j" class="grid-cell header-cell text-base">
          {{ j - 1 }}
        </div>
      </div>
    </div>

    <!-- 数据行 -->
    <div v-for="(row, i) in store.state.matrix" :key="i" class="row-wrapper">
      <div class="axis-label text-base">
        {{ i === 0 ? '空' : `物品${i}` }}
      </div>

      <div class="grid-row">
        <motion.div v-for="(cell, j) in row" :key="j" :class="['grid-cell', cellClasses[cell.state]]" :animate="{
          scale: cell.state === 'active' ? [1, 1.08, 1] : 1,
          transition: { duration: 0.3 }
        }" @click="handleCellClick(i, j)">
          <div class="cell-content">
            <span class="value">{{ cell.value }}</span>
            <span v-if="cell.state === 'active'" class="coordinates text-xs mt-0.5">
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
  @apply flex flex-col p-8 bg-gray-50 rounded-lg shadow-sm gap-2;
}

.row-wrapper {
  @apply flex gap-3 items-center;
}

.grid-row {
  @apply flex gap-2;
}

.axis-label {
  @apply w-14 h-14 flex items-center justify-center text-gray-700 bg-gray-100 rounded-md border-2 border-gray-300 shadow-sm;
}

.grid-cell {
  @apply w-14 h-14 border-2 flex items-center justify-center font-mono cursor-pointer transition-all duration-300 text-base rounded-md;
}

.header-cell {
  @apply bg-gray-100 border-gray-300;
}

.cell-content {
  @apply flex flex-col items-center justify-center gap-0.5;
}

.bg-blue-400\/90 {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1)
  }

  50% {
    transform: scale(1.08)
  }
}
</style>
