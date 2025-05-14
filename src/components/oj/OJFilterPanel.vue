<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

function updateValue(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="relative mb-10 w-full">
    <input :value="modelValue" @input="updateValue" type="text" placeholder="搜索题目..."
      class="block w-lg pl-10 pr-3 py-2 border  border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mx-auto" />
  </div>
</template>
