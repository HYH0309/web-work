<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  metric: {
    icon: Component
    color: string
    label: string
    value: string | number
  }
}>()
</script>

<template>
  <div class="metric-card">
    <component :is="metric.icon" class="metric-icon" :class="metric.color" />
    <div class="metric-content">
      <span class="metric-label">{{ metric.label }}:{{ ' ' }}</span>
      <span class="metric-value" :class="metric.color"> {{ metric.value }}</span>
    </div>
  </div>
</template>
<style scoped>
.metric-card {
  @apply card-base flex items-center p-3 rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-700;
}

.metric-icon {
  @apply w-6 h-6 shrink-0 mr-3;
}

.metric-content {
  @apply min-w-0 space-y-1
}

.metric-label {
  @apply text-sm text-gray-600 dark: text-gray-400 truncate;
}

.metric-value {
  @apply text-base font-semibold truncate
}
</style>
