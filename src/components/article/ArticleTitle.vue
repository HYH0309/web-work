<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import TypeIt from 'typeit'

// 动画配置常量
const ANIMATION_CONFIG = {
  DURATION_RANGE: [5, 10] as [number, number],
  DELAY_RANGE: [0, 3] as [number, number],
  Y_POSITION_RANGE: [10, 90] as [number, number]
}

const typeitTitle = ref<string>(' ')
const typeitInstance = ref<TypeIt | null>(null)
const props = defineProps<{
  title: string
  comments: string[]
  speed?: number
}>()

import { watch } from 'vue'

// 工具函数：生成区间随机数
const getRandomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min

// 预计算弹幕数据
const animatedComments = computed(() => {
  return [...props.comments]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(props.comments.length, Math.floor(Math.random() * 3) + 3))
    .map(comment => {
      const direction = Math.random() > 0.5 ? 'from-right' : 'from-left'
      return {
        comment,
        animation: {
          class: direction,
          style: {
            '--start-y': `${getRandomInRange(...ANIMATION_CONFIG.Y_POSITION_RANGE)}%`,
            '--hue': `${Math.random() * 360}`,
            '--duration': `${getRandomInRange(...ANIMATION_CONFIG.DURATION_RANGE)}s`,
            '--delay': `${getRandomInRange(...ANIMATION_CONFIG.DELAY_RANGE)}s`
          }
        }
      }
    })
})

// TypeIt 生命周期管理
const initTypeIt = () => {
  if (typeitInstance.value) {
    typeitInstance.value.destroy()
  }
  if (props.title) {
    typeitInstance.value = new TypeIt(typeitTitle.value, {
      strings: props.title,
      speed: props.speed || 100,
      loop: true,
      breakLines: false
    }).go()
  }
}

onMounted(initTypeIt)

watch(() => props.title, initTypeIt)

onUnmounted(() => {
  typeitInstance.value?.destroy()
})
</script>

<template>
  <div class="relative h-40 bg-gray-2 rounded-5 dark:bg-gray-6 overflow-hidden">
    <!-- 标题展示 -->
    <h1 ref="typeitTitle" class="text-center text-4xl font-bold py-10 flex-center relative z-10" />

    <!-- 弹幕容器 -->
    <div v-for="(item, index) in animatedComments" :key="index"
      class="barrage-item absolute text-sm whitespace-nowrap px-2 py-1 rounded shadow-sm backdrop-blur-sm bg-opacity-10 bg-white dark:bg-opacity-20 dark:bg-black"
      :class="item.animation.class" :style="item.animation.style">
      {{ item.comment }}
    </div>
  </div>
</template>

<style scoped>
.barrage-item {
  animation: var(--duration) linear var(--delay) infinite both;
  color: hsl(var(--hue), 70%, 60%);
  top: var(--start-y);
  transform: translateY(-50%);
  will-change: transform;
}

.from-right {
  right: 0;
  animation-name: move-right;
}

.from-left {
  left: 0;
  animation-name: move-left;
}

@keyframes move-right {
  from {
    transform: translateX(100%) translateY(-50%);
  }

  to {
    transform: translateX(-100vw) translateY(-50%);
  }
}

@keyframes move-left {
  from {
    transform: translateX(-100%) translateY(-50%);
  }

  to {
    transform: translateX(100vw) translateY(-50%);
  }
}
</style>
