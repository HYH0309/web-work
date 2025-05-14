<script setup lang="ts">
import { motion } from 'motion-v'
import { useSortingStore } from '@/stores/sortStore'

const store = useSortingStore()
const spring = { type: 'spring', damping: 15, stiffness: 400, mass: 0.8 }
</script>

<template>
  <div class="sort-visualization-container">
    <ul class="sort-list">
      <motion.li v-for="(num, index) in store.state.order" :key="num" layout :layout-id="'item-' + num"
        :transition="spring" class="sort-item theme-transition" :class="[
          {
            'pivot-state': store.state.stats.pivotIndex === index,
            'active-state': store.state.activeIndices.includes(index),
            'default-state': !store.state.activeIndices.includes(index) &&
              store.state.stats.pivotIndex !== index
          }
        ]" :style="{
          '--item-height': `${num * 0.5}rem`,
          '--item-color': `rgb(var(--un-color-primary-500))`
        }">
        {{ num }}
      </motion.li>
    </ul>
  </div>
</template>

<style scoped>
.sort-visualization-container {
  @apply flex flex-col items-center gap-4 h-[60vh] pb-4;
}

.sort-list {
  @apply list-none p-0 m-0 flex gap-4 items-end h-full w-full px-4;
}

.sort-item {
  @apply w-25 min-w-[1.5rem] rounded-md flex items-center justify-center text-on-primary font-bold shadow-sm transition-all;
  height: var(--item-height);
  background-color: var(--item-color);
}

.pivot-state {
  @apply bg-danger text-on-danger scale-125 z-10 shadow-danger/30;
}

.active-state {
  @apply bg-primary text-on-primary scale-110 shadow-active;
}

.default-state {
  @apply bg-success text-on-success shadow-sm;
}
</style>
