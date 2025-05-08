<script setup lang="ts">
import { motion } from 'motion-v'
import useSorting from '../composables/useSortingVisualizer'

const { state, algorithms, startSorting, resetArray, statsDisplay } = useSorting()
const spring = { type: 'spring', damping: 15, stiffness: 400, mass: 0.8 }
</script>

<template>
  <div class="control-group">
    <select class="control-btn algorithm-select" v-model="state.selectedAlgorithm" :disabled="state.isSorting">
      <option v-for="algo in algorithms" :key="algo.name" :value="algo">{{ algo.name }}</option>
    </select>

    <button class="control-btn" :class="{ 'disabled': state.isSorting }" @click="startSorting">
      {{ state.isSorting ? '排序中...' : '开始排序' }}
    </button>

    <div class="speed-control">
      <label>速度:</label>
      <input type="range" min="100" max="2000" v-model="state.speed">
    </div>

    <button class="control-btn reset-btn" @click="resetArray" :disabled="state.isSorting">重置</button>

    <div class="stats-panel">
      <div>比较次数: {{ statsDisplay.comparisons }}</div>
      <div>交换次数: {{ statsDisplay.swaps }}</div>
      <div v-if="statsDisplay.recursionDepth">递归深度: {{ statsDisplay.recursionDepth }}</div>
      <div v-if="statsDisplay.currentGap">当前间隔: {{ statsDisplay.currentGap }}</div>
      <div v-if="state.description">{{ state.description }}</div>
    </div>
  </div>
  <div class=" flex flex-col items-center gap-4 align-bottom ">
    <ul class="sort-container">
      <motion.li v-for="(num, index) in state.order" :key="num" layout :transition="spring" class="sort-item" :style="{
        scale: state.activeIndices.includes(index) ? 1.2 : 1,
        background: state.stats.pivotIndex === index ? 'orange' : state.activeIndices.includes(index) ? 'lightblue' : 'lightgreen'
      }" :animate="{ height: `${num * 0.5}rem` }">
        {{ num }}
      </motion.li>
    </ul>
  </div>
</template>

<style scoped>
.control-group {
  @apply flex flex-wrap gap-4 h-15 items-center justify-center m-15 p-4 bg-gray-100 rounded-lg;
}

.control-btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded-md transition-colors hover:bg-blue-600;

  &.disabled {
    @apply bg-gray-400 cursor-not-allowed;
  }

  &.algorithm-select {
    @apply bg-green-500 hover:bg-green-600;
  }

  &.reset-btn {
    @apply bg-red-500 hover:bg-red-600;
  }
}

.speed-control {
  @apply flex items-center gap-2;
}

.stats-panel {
  @apply bg-white p-3 rounded-md shadow-md text-sm text-gray-700;

  div {
    @apply font-mono;
  }
}

.sort-container {
  @apply list-none p-0 m-0 relative flex flex-row gap-20 items-end h-100;
}

.sort-item {
  @apply w-25 rounded-1 flex items-center justify-center text-white font-bold shadow-md transition-colors
}
</style>
