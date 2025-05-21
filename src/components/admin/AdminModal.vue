<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { XMarkIcon } from "@heroicons/vue/24/outline";
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String as () => 'sm' | 'md' | 'lg' | 'xl' | '2xl',
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const widthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl'
}
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="relative z-50" @close="emit('update:modelValue', false)">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-80vh items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              :class="[widthClasses[width as keyof typeof widthClasses], 'w-full bg-white p-6 rounded-lg shadow-xl transition-all']">
              <div v-if="$slots.header" class="mb-4">
                <slot name="header"></slot>
              </div>

              <template v-else>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium">{{ title }}</h3>
                  <button @click="emit('update:modelValue', false)"
                    class="text-gray-400 hover:text-gray-500 transition-colors" :disabled="loading">
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
              </template>

              <div class="space-y-4">
                <slot></slot>
              </div>

              <div v-if="$slots.footer" class="mt-6">
                <slot name="footer"></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
