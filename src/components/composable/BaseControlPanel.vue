<template>
  <div class="bg-white rounded-lg shadow-sm p-5 transition-300" :class="[
    direction === 'horizontal' ? 'md:flex-row' : 'flex-col',
    disabled ? 'opacity-50 pointer-events-none' : '',
    'flex gap-4'
  ]">
    <div class="flex-1 flex flex-wrap gap-2">
      <slot></slot>
    </div>
    <div class="flex gap-2 items-center">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  direction?: 'horizontal' | 'vertical'
  disabled?: boolean
}>()
</script>
