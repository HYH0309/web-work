<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'

const playerStore = usePlayerStore()
const audio = ref<HTMLAudioElement | null>(null)

const seek = (e: MouseEvent) => {
  if (!audio.value || !(e.currentTarget instanceof HTMLElement)) return
  const rect = e.currentTarget.getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  audio.value.currentTime = pos * audio.value.duration
  playerStore.updateProgress() // 手动触发进度更新
}

const handleProgressInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const audioEl = audio.value
  if (audioEl && !isNaN(audioEl.duration)) {
    audioEl.currentTime = (Number(target.value) / 100) * audioEl.duration
    playerStore.updateProgress() // 手动触发进度更新
  }
}
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar" @click="seek">
      <div class="progress-indicator" :style="{ width: `${playerStore.progress}%` }"></div>
      <div class="time-display left">
        {{ playerStore.formattedTime }}
      </div>
      <div class="time-display right">
        {{ playerStore.formattedTime }}
      </div>
      <input type="range" min="0" max="100" :value="playerStore.progress" @input="handleProgressInput"
        class="progress-input" />
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  @apply flex justify-center;
}

.progress-bar {
  @apply w-[120px] h-1.5 bg-muted rounded-full relative;
}

.progress-indicator {
  @apply h-full bg-primary rounded-full transition-width duration-100 ease-linear;
}

.time-display {
  @apply absolute top-1/2 -translate-y-1/2 text-xs text-muted-foreground w-5;
}

.time-display.left {
  @apply left-0 ml-[-24px] text-right;
}

.time-display.right {
  @apply right-0 mr-[-24px];
}

.progress-input {
  @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer;
}
</style>
