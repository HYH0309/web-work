<script setup lang="ts">
import { MoonIcon, StarIcon } from '@heroicons/vue/24/outline'
import { TransitionRoot } from '@headlessui/vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const toggleTheme = () => themeStore.toggleTheme()
</script>

<template>
  <button @click="toggleTheme" class="fixed top-5 right-5 p-2 rounded-full bg-background/80 backdrop-blur-sm z-[100]
           border border-border shadow-sm hover:shadow-md transition-all duration-300 ease-out
           hover:scale-105 active:scale-95 size-15 flex items-center justify-center">
    <TransitionRoot :show="true" enter-active-class="transform transition duration-500 ease-out"
      enter-from-class="opacity-0 rotate-90 scale-75" enter-to-class="opacity-100 rotate-0 scale-100"
      leave-active-class="transform transition duration-500 ease-in" leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 -rotate-90 scale-75">
      <MoonIcon v-if="themeStore.theme === 'light'" class="w-6 h-6 text-foreground" />
      <StarIcon v-else class="w-6 h-6 text-foreground" />
    </TransitionRoot>
  </button>
</template>
