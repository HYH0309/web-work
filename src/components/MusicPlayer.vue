<script setup lang="ts">
import { motion } from 'motion-v'
import { usePlayerStore } from '@/stores/playerStore'
import useAudioPlayer from '@/composables/useAudioPlayer'
import useRotationAnimation from '@/composables/useRotationAnimation'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/outline'

const { state: playerState, togglePlay } = usePlayerStore()
const { audioRef, progress, handleSeek } = useAudioPlayer()
const { currentRotation } = useRotationAnimation()

const handleDragStart = (e: PointerEvent) => {
  const element = e.currentTarget as HTMLInputElement
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const handleMove = (moveEvent: PointerEvent) => {
    const angle = Math.atan2(
      moveEvent.clientY - centerY,
      moveEvent.clientX - centerX
    )
    const progress = ((angle + Math.PI) / (2 * Math.PI)) * 100
    handleSeek({ target: { value: progress } } as unknown as Event)
  }

  const handleUp = () => {
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
  }

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp)
}
</script>

<template>
  <div class="fixed bottom-4 left-4">
    <audio ref="audioRef" hidden controls></audio>

    <motion.div class="relative w-26 h-26" :animate="currentRotation">
      <!-- 唱片图像 -->
      <img :src="playerState.coverUrl"
        class="w-full h-full rounded-full object-cover border-2 border-border shadow-lg transition-transform duration-300 group-hover:scale-95 ">

      <!-- 播放按钮（中心区域） -->
      <div class="absolute inset-0 flex items-center justify-center z-10" @click.stop="togglePlay"
        style="clip-path: circle(30% at 50% 50%)">
        <component :is="playerState.isPlaying ? PauseIcon : PlayIcon"
          class="text-text/30 transition-transform duration-100 w-10 h-10"
          :class="{ 'scale-110': playerState.isPlaying }" />
      </div>

      <!-- 整合进度环 -->
      <svg class="absolute inset-0" viewBox="0 0 100 100">
        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3B82F6" />
          <stop offset="100%" stop-color="#60A5FA" />
        </linearGradient>
        <circle class="stroke-background/10 " cx="50" cy="50" r="45" stroke-width="4" fill="transparent" />
        <circle class="stroke-[url(#progress-gradient)]" cx="50" cy="50" r="45" stroke-width="4" fill="transparent"
          stroke-linecap="round"
          :style="`stroke-dasharray: ${2 * Math.PI * 45}; stroke-dashoffset: ${2 * Math.PI * 45 * (1 - progress / 100)}`"
          style="transition: stroke-dashoffset 0.2s linear" />
      </svg>

      <!-- 进度条控件（外环区域） -->
      <input type="range" class="absolute inset-0 opacity-0 cursor-pointer" min="0" max="100" v-model="progress"
        @pointerdown="handleDragStart" style="clip-path: circle(70% at 50% 50%)">
    </motion.div>
  </div>
</template>
