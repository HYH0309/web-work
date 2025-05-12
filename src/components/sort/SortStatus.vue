<script setup lang="ts">
import { useSortingStore } from '@/stores/sortStore'
import { ChartBarIcon, ArrowsUpDownIcon, CpuChipIcon } from '@heroicons/vue/24/outline'
import { computed, watch } from 'vue'
import useAnimatedStats from '@/composables/useAnimatedStats'

const store = useSortingStore()
const { animatedValues, startAnimation } = useAnimatedStats({
  comparisons: 0,
  swaps: 0,
  recursionDepth: 0,
  currentGap: 0
})

const metrics = computed(() => {
  const items = [
    {
      id: 'comparisons',
      label: '比较次数',
      value: animatedValues.value.comparisons,
      icon: ChartBarIcon,
      color: 'text-primary-500',
      visible: true
    },
    {
      id: 'swaps',
      label: '交换次数',
      value: animatedValues.value.swaps,
      icon: ArrowsUpDownIcon,
      color: 'text-success-500',
      visible: true
    },
    {
      id: 'recursion',
      label: '递归深度',
      value: animatedValues.value.recursionDepth,
      icon: CpuChipIcon,
      color: 'text-gray-700',
      visible: !!store.state.stats.recursionDepth
    },
    {
      id: 'gap',
      label: '当前间隔',
      value: animatedValues.value.currentGap,
      icon: CpuChipIcon,
      color: 'text-blue-500',
      visible: !!store.state.stats.currentGap
    }
  ]

  return items.filter(item => item.visible)
})

const description = computed(() => store.state.description)

watch(() => store.state.stats, (newVal) => {
  startAnimation({
    comparisons: newVal.comparisons,
    swaps: newVal.swaps,
    recursionDepth: newVal.recursionDepth || 0,
    currentGap: newVal.currentGap || 0
  })
}, { deep: true, immediate: true })
</script>

<template>
  <section class="stats-container">
    <div class="metrics-grid">
      <BaseMetricCard v-for="metric in metrics" :key="metric.id" :metric="metric" />
    </div>

    <!-- 空状态提示 -->
    <div v-if="metrics.length === 0" class="card-base p-4 text-gray-500 text-center">
      暂无可用统计指标
    </div>

    <div class="description-box">
      {{ description }}
    </div>
  </section>
</template>

<style scoped>
.card-base {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300;
}
</style>
