<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useMotion } from '@vueuse/motion'
import { useThemeStore } from '@/stores/themeStore'
import { computed, ref, watch } from 'vue'

const themeStore = useThemeStore()
const isLight = computed(() => themeStore.theme === 'light')
const iconRef = ref<HTMLElement>()
const buttonRef = ref<HTMLButtonElement>()

// 按钮悬停动画
useMotion(buttonRef, {
  hover: {
    scale: 1.05,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95
  }
})

// 图标切换动画
const iconMotion = useMotion(iconRef, {
  initial: {
    opacity: 0,
    rotate: 90,
    scale: 0.75,
    y: 10
  },
  enter: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
      mass: 0.5
    }
  }
})

// 监听主题变化触发动画
watch(isLight, (newVal) => {
  // 先执行退出动画
  iconMotion.apply({
    opacity: 0,
    rotate: newVal ? 90 : -90,
    scale: 0.75,
    y: newVal ? 10 : -10,
    transition: {
      duration: 200
    }
  })

  // 短暂延迟后执行进入动画
  setTimeout(() => {
    iconMotion.apply({
      opacity: 1,
      rotate: 0,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 15
      }
    })
  }, 200)
})

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<template>
  <button ref="buttonRef" @click="toggleTheme" class="fixed top-5 right-5 p-2 rounded-full bg-background/80 backdrop-blur-sm
           border border-border shadow-sm transition-all duration-200 ease-out
           focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center
           w-12 h-12" aria-label="Toggle theme" :title="isLight ? 'Switch to dark mode' : 'Switch to light mode'">
    <div ref="iconRef" class="flex items-center justify-center">
      <MoonIcon v-if="isLight" class="w-6 h-6 text-foreground" />
      <SunIcon v-else class="w-6 h-6 text-foreground" />
    </div>
  </button>
</template>
