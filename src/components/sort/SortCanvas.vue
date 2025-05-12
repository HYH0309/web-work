<script setup lang="ts">
import { motion } from 'motion-v'
import { useSortingStore } from '@/stores/sortStore'

const store = useSortingStore()
const spring = { type: 'spring', damping: 15, stiffness: 400, mass: 0.8 }
</script>

<template>
  <div class="flex flex-col items-center gap-4 align-bottom">
    <ul class="sort-container ">
      <motion.li v-for="(num, index) in store.state.order" :key="num" layout :layout-id="'item-' + num"
        :transition="spring" class="sort-item" :class="[
          store.state.stats.pivotIndex === index ? 'bg-danger-500 scale-120 z-10' : '',
          store.state.activeIndices.includes(index) ? 'bg-active-500 scale-110 shadow-lg shadow-blue-500/30' : '',
          !store.state.activeIndices.includes(index) && store.state.stats.pivotIndex !== index ? 'bg-success-500' : ''
        ]" :style="{
          height: num * 0.5 + 'rem',
        }">
        {{ num }}
      </motion.li>
    </ul>
  </div>
</template>

<style scoped>
.sort-container {
  @apply list-none p-0 m-0 relative flex flex-row gap-20 items-end h-full px-8;
}

.sort-item {
  @apply w-25 rounded-1 flex items-center justify-center text-white font-bold shadow-md transition-colors;
}
</style>
