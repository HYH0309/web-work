<script setup lang="ts">
import { motion } from 'motion-v'
import { usePlayerStore } from '@/stores/playerStore'
import useAudioPlayer from '@/composables/useAudioPlayer'
import useRotationAnimation from '@/composables/useRotationAnimation'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/outline'
import { computed, onUnmounted, ref } from 'vue'

const { state: playerState, togglePlay } = usePlayerStore()
const { audioRef, progress, handleSeek } = useAudioPlayer()
const { currentRotation } = useRotationAnimation()

// 计算属性避免模板中重复计算
const circleLength = computed(() => 2 * Math.PI * 45)
const strokeDashoffset = computed(() => circleLength.value * (1 - progress.value / 100))

// 拖动状态管理
const isDragging = ref(false)
const dragAngle = ref(0)

const handleDragStart = (e: PointerEvent) => {
  isDragging.value = true
  const element = e.currentTarget as HTMLInputElement
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const handleMove = (moveEvent: PointerEvent) => {
    if (!isDragging.value) return

    const angle = Math.atan2(
      moveEvent.clientY - centerY,
      moveEvent.clientX - centerX
    )
    dragAngle.value = angle
    const progressValue = ((angle + Math.PI) / (2 * Math.PI)) * 100
    handleSeek({ target: { value: progressValue } } as unknown as Event)
  }

  const handleUp = () => {
    isDragging.value = false
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
  }

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp)
}

// 组件卸载时清理事件
onUnmounted(() => {
  isDragging.value = false
})
</script>

<template>
  <div class="fixed bottom-4 left-4 z-50">
    <audio ref="audioRef" hidden controls></audio>

    <motion.div class="player-container" :animate="currentRotation">
      <!-- 唱片图像 -->
      <div class="relative w-26 h-26">
        <img :src="playerState.coverUrl" class="album-cover" :class="{ 'paused': !playerState.isPlaying }"
          alt="Album cover" />

        <!-- 播放按钮（中心区域） -->
        <button class="play-button" @click.stop="togglePlay" aria-label="Play/Pause">
          <component :is="playerState.isPlaying ? PauseIcon : PlayIcon" class="play-icon"
            :class="{ 'playing': playerState.isPlaying }" />
        </button>

        <!-- 整合进度环 -->
        <svg class="progress-ring" viewBox="0 0 100 100">
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#3B82F6" />
            <stop offset="100%" stop-color="#60A5FA" />
          </linearGradient>
          <circle class="progress-track" cx="50" cy="50" r="45" stroke-width="4" />
          <circle class="progress-bar" cx="50" cy="50" r="45" stroke-width="4" stroke-linecap="round"
            :stroke-dasharray="circleLength" :stroke-dashoffset="strokeDashoffset" />
        </svg>

        <!-- 进度条控件（外环区域） -->
        <input type="range" class="progress-input" min="0" max="100" v-model="progress"
          @pointerdown="handleDragStart" />
      </div>
    </motion.div>
  </div>
</template>

<style scoped>
.player-container {
  @apply relative w-26 h-26 transition-transform;
}

.album-cover {
  @apply w-full h-full rounded-full object-cover border-2 border-border shadow-lg;
  @apply transition-all duration-300;

  will-change: transform;
  backface-visibility: hidden;
}

.album-cover.paused {
  filter: grayscale(30%);
}

.play-button {
  @apply absolute inset-0 flex items-center justify-center z-10 bg-background/10;
  @apply rounded-full hover:bg-background/20 transition-colors;
  clip-path: circle(30% at 50% 50%);
}

.play-icon {
  @apply text-text transition-all duration-300 ease-DEFAULT w-10 h-10;
}

.play-icon.playing {
  @apply scale-110 text-primary/80;
}

.progress-ring {
  @apply absolute inset-0 transform -rotate-90;
}

.progress-track {
  @apply stroke-background/10 fill-transparent;
}

.progress-bar {
  @apply stroke-[url(#progress-gradient)] fill-transparent;
  transition: stroke-dashoffset 0.2s linear;
}

.progress-input {
  @apply absolute inset-0 opacity-0 cursor-pointer;
  clip-path: circle(70% at 50% 50%);
}

.track-info {
  @apply mt-2 max-w-[104px] text-center;
}

/* 自定义缓动函数 */
.ease-spring {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
