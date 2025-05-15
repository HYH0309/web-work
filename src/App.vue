<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useThemeStore } from '@/stores/themeStore'
import { ref } from 'vue'

const themeStore = useThemeStore()
const isAnimating = ref(false)

const toggleWithAnimation = () => {
  isAnimating.value = true
  themeStore.toggleTheme()
  setTimeout(() => isAnimating.value = false, 600)
}
</script>

<template>
  <button @click="toggleWithAnimation" class="theme-toggle-btn" :class="{ 'animate-pulse': isAnimating }">
    <Icon :icon="themeStore.theme === 'light'
      ? 'ion:star-sharp'
      : 'ion:moon-sharp'" class="text-xl text-foreground transition-all duration-500 w-10 h-10" :class="{
        'scale-125 rotate-12': isAnimating && themeStore.theme === 'dark',
        'scale-75 -rotate-12': isAnimating && themeStore.theme === 'light'
      }" />
  </button>
  <RouterView />
</template>

<style scoped>
.theme-toggle-btn {
  @apply fixed top-5 right-5 p-2 rounded-full bg-background/80 backdrop-blur-sm;
  @apply border border-border shadow-sm hover:shadow-md;
  @apply transition-all duration-300 ease-out;
  @apply hover:scale-105 active:scale-95;
  @apply w-10 h-10 flex items-center justify-center;
}

/* 自定义星星闪烁动画 */
@keyframes star-twinkle {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }

  100% {
    opacity: 0.8;
    transform: scale(1);
  }
}

/* 自定义月亮浮动动画 */
@keyframes moon-float {
  0% {
    transform: translateY(0) rotate(-15deg);
  }

  50% {
    transform: translateY(-3px) rotate(15deg);
  }

  100% {
    transform: translateY(0) rotate(-15deg);
  }
}

.theme-toggle-btn:hover .ion\:star-sharp {
  animation: star-twinkle 1.5s infinite;
}

.theme-toggle-btn:hover .ion\:moon-sharp {
  animation: moon-float 2s ease-in-out infinite;
}
</style>
