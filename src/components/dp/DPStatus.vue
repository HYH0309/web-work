<script setup lang="ts">
import { useDPStore } from '@/stores/dpStore'
import { computed, watch } from 'vue'
import useAnimatedStats from '@/composables/useAnimatedStats'
import BaseMetricCard from '@/components/composable/BaseMetricCard.vue'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@heroicons/vue/20/solid'

const store = useDPStore()
const { animatedValues, startAnimation } = useAnimatedStats({
  currentStep: 0,
  maxValue: 0,
  remainingCapacity: 0
})

const description = computed(() => store.state.description)
const metrics = computed(() => [
  {
    id: 'step',
    label: '步骤',
    value: animatedValues.value.currentStep,
    icon: ChartBarIcon,
    color: 'text-primary-500'
  },
  {
    id: 'value',
    label: '最大价值',
    value: animatedValues.value.maxValue,
    icon: CurrencyDollarIcon,
    color: 'text-success-500'
  },
  {
    id: 'capacity',
    label: '剩余容量',
    value: animatedValues.value.remainingCapacity,
    icon: CubeIcon,
    color: 'text-gray-700'
  },
])

watch(() => store.state.stats, (newStats) => {
  startAnimation({
    currentStep: newStats.currentStep,
    maxValue: newStats.maxValue,
    remainingCapacity: newStats.remainingCapacity
  })
}, { immediate: true, deep: true })
</script>

<template>
  <section class="stats-container">
    <div class="metrics-grid">
      <BaseMetricCard v-for="metric in metrics" :key="metric.id" :metric="metric" />
    </div>

    <div v-if="description" class="description-box">
      {{ description }}
    </div>

    <div class="items-section">
      <div class="items-grid">
        <div v-for="item in store.state.stats.items" :key="item.id" class="item-card">
          <span class="item-id">物品 {{ item.id + 1 }}</span>
          <div class="item-properties">
            <span>重:{{ item.weight }}</span>
            <span>值:{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-container {
  @apply space-y-3;
}

.items-section {
  @apply p-2 rounded-lg bg-gray-50;
}

.items-title {
  @apply text-sm font-medium text-gray-600 mb-2 px-1;
}

.items-grid {
  @apply grid grid-cols-3 sm:grid-cols-5 gap-1;
}

.item-card {
  @apply p-1 text-center text-sm rounded hover:bg-gray-100 transition-colors;
}

.item-id {
  @apply text-primary-600 font-medium truncate;
}

.item-properties {
  @apply text-gray-600 truncate space-x-1;
}
</style>
