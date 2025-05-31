<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from "@headlessui/vue"
defineProps<{
  modelValue: string
  languages: Array<{ value: string; label: string; icon: string }>
}>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <RadioGroup :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" class="flex gap-2">
    <RadioGroupOption v-for="lang in languages" :key="lang.value" :value="lang.value" class="language-option"
      :title="lang.label">
      <span :class="lang.icon" class="w-8 h-8"></span>
    </RadioGroupOption>
  </RadioGroup>
</template>

<style scoped>
.language-option {
  @apply p-2 rounded-full cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-800 transition-colors flex items-center gap-2;
}

.language-option[aria-checked='true'] {
  @apply bg-emerald-400 text-white hover:bg-emerald-500;
}
</style>
