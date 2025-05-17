<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useThemeStore } from '@/stores/themeStore'
import { ref } from 'vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import NavBar from '@/components/NavBar.vue'
const themeStore = useThemeStore()
const isAnimating = ref(false)

const toggleWithAnimation = () => {
  isAnimating.value = true
  themeStore.toggleTheme()
  setTimeout(() => isAnimating.value = false, 600)
}
</script>

<template>
  <button @click="toggleWithAnimation" class="theme-toggle-btn " :class="{ 'animate-pulse': isAnimating }">
    <Icon :icon="themeStore.theme === 'light'
      ? 'ion:star-sharp'
      : 'ion:moon-sharp'" class="text-xl text-foreground  w-15 h-15"
      :class="[themeStore.theme, { animate: isAnimating }]" />
  </button>
  <NavBar />
  <MusicPlayer />

  <RouterView />

</template>

<style scoped>
.theme-toggle-btn {
  @apply fixed top-5 right-5 p-2 rounded-full bg-background/80 backdrop-blur-sm z-100;
  @apply border border-border shadow-sm hover:shadow-md;
  @apply transition-all duration-300 ease-out;
  @apply hover:scale-105 active:scale-95;
  @apply w-15 h-15 flex items-center justify-center;
}
</style>
