<script setup lang="ts">
import { motion } from 'motion-v'
import { ref, onBeforeUnmount } from 'vue'

// 生成随机数组
const generateRandomArray = (length = 6, max = 50) =>
  Array.from({ length }, () => Math.floor(Math.random() * max) + 1)

// 初始状态
const initialOrder = generateRandomArray()
const order = ref([...initialOrder])
const activeIndices = ref<number[]>([])
const isSorting = ref(false)
let intervalId: number | null = null
let sortGenerator: Generator

const stats = ref({ comparisons: 0, swaps: 0 })
const speed = ref(1000)
// 排序算法配置
interface Algorithm {
  name: string
  generator: (arr: number[]) => Generator<number[]>
}
// 算法列表
const algorithms: Algorithm[] = [
  {
    name: '冒泡排序',
    generator: function* (arr: number[]) {
      const n = arr.length

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          stats.value.comparisons++
          activeIndices.value = [j, j + 1]
          yield [...arr]

          if (arr[j] > arr[j + 1]) {
            stats.value.swaps++
            const newArr = [...arr]
              ;[newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]]
            arr = newArr
            activeIndices.value = [j, j + 1]
            yield arr
          }
        }
      }
      activeIndices.value = []
      return arr
    }
  }
]
const selectedAlgorithm = ref(algorithms[0])

// 开始排序
const startSorting = () => {
  if (isSorting.value) return

  isSorting.value = true
  stats.value = { comparisons: 0, swaps: 0 }
  sortGenerator = selectedAlgorithm.value.generator([...order.value])

  intervalId = window.setInterval(() => {
    const result = sortGenerator.next()
    if (result.done) {
      clearInterval(intervalId!)
      isSorting.value = false
    } else {
      order.value = result.value as number[]
    }
  }, speed.value)
}

// 重置数组
const resetArray = () => {
  clearInterval(intervalId!)
  isSorting.value = false
  activeIndices.value = []
  order.value = generateRandomArray()
  stats.value = { comparisons: 0, swaps: 0 }
}

onBeforeUnmount(() => {
  clearInterval(intervalId!)
})

const spring = {
  type: 'spring',
  damping: 15,
  stiffness: 400,
  mass: 0.8
}
</script>

<template>
  <div class="control-group">
    <select class="control-btn algorithm-select" v-model="selectedAlgorithm" :disabled="isSorting">
      <option v-for="algo in algorithms" :key="algo.name" :value="algo">{{ algo.name }}</option>
    </select>

    <button class="control-btn" :class="{ 'disabled': isSorting }" @click="startSorting">
      {{ isSorting ? '排序中...' : '开始排序' }}
    </button>

    <div class="speed-control">
      <label>速度:</label>
      <input type="range" min="100" max="2000" v-model="speed">
    </div>

    <button class="control-btn reset-btn" @click="resetArray" :enable="!isSorting">重置</button>

    <div class="stats-panel">
      <div>比较次数: {{ stats.comparisons }}</div>
      <div>交换次数: {{ stats.swaps }}</div>
    </div>
  </div>
  <div>
    <ul class="sort-container">
      <motion.li v-for="(num, index) in order" :key="num" layout :transition="spring" class="sort-item" :class="{
        'sort-item-active': activeIndices.includes(index),
        'sort-item-swapped': num !== initialOrder[index]
      }" :animate="{
        scale: activeIndices.includes(index) ? 1.2 : 1,
        backgroundColor: activeIndices.includes(index) ? '#34d399' : '#3b82f6'
      }" :style="{ height: `${num * 0.5}rem` }">
        {{ num }}
      </motion.li>
    </ul>
  </div>
</template>

<style scoped>
.control-group {
  @apply flex flex-wrap gap-4 h-100 items-center justify-center m-4 p-4 bg-gray-100 rounded-lg;
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

  input[type="range"] {
    @apply w-32;
  }
}

.stats-panel {
  @apply bg-white p-3 rounded-md shadow-md text-sm text-gray-700;

  div {
    @apply font-mono;
  }
}

.sort-container {
  @apply list-none p-0 m-0 relative flex flex-row gap-20 items-end h-full;
}

.sort-item {
  @apply w-25 rounded-1 flex justify-center items-center justify-center text-white font-bold shadow-md transition-colors &-active {
    @apply shadow-lg z-10;
    animation: pulse 0.5s ease-in-out;
  }

  &-swapped {
    @apply bg-purple-500;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1.2);
  }
}
</style>
