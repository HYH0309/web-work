<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
</script>

<template>
  <button @click="themeStore.toggleTheme" class="fixed top-4 right-4 p-2 rounded-full bg-primary-500 text-white">
    {{ themeStore.theme === 'light' ? '🌙' : '☀️' }}
  </button>
  <RouterView />
</template>

<style scoped></style>
