<script setup lang="ts">
import { motion } from 'motion-v'
import { usePlayerStore } from '@/stores/playerStore'
import useAudioPlayer from '@/composables/useAudioPlayer'
import useRotationAnimation from '@/composables/useRotationAnimation'
import useVolumeControl from '@/composables/useVolumeControl'
import useDragProgress from '@/composables/useDragProgress'
import useKeyboardControls from '@/composables/useKeyboardControls'
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Z_INDEX } from '@/config/z-index'

// 播放器状态和音频控制
const { state: playerState, togglePlay } = usePlayerStore()
const { audioRef, progress, handleSeek } = useAudioPlayer()
const { currentRotation } = useRotationAnimation()

// 音量控制
const {
  volume,
  showVolumeControl,
  toggleVolumeControl,
  updateVolume
} = useVolumeControl()

// 进度条拖拽控制
const handleProgressChange = (value: number) => {
  const mockEvent = {
    target: { value: value.toString() }
  } as Event & { target: HTMLInputElement }
  handleSeek(mockEvent)
}

const { isDragging, startDrag } = useDragProgress(handleProgressChange)

// 按钮缩放动画
const buttonScale = ref(1)
let scaleTimeoutId: ReturnType<typeof setTimeout> | null = null

watch(() => playerState.isPlaying, () => {
  if (scaleTimeoutId) {
    clearTimeout(scaleTimeoutId)
  }
  buttonScale.value = 1.2
  scaleTimeoutId = setTimeout(() => {
    buttonScale.value = 1
    scaleTimeoutId = null
  }, 200)
})

// 键盘控制
useKeyboardControls({
  onPlay: togglePlay,
  onSeekBackward: (amount = 5) => {
    const newProgress = Math.max(0, progress.value - amount)
    handleProgressChange(newProgress)
  },
  onSeekForward: (amount = 5) => {
    const newProgress = Math.min(100, progress.value + amount)
    handleProgressChange(newProgress)
  },
  onVolumeUp: () => updateVolume(Math.min(1, volume.value + 0.1)),
  onVolumeDown: () => updateVolume(Math.max(0, volume.value - 0.1)),
  onMute: () => updateVolume(volume.value > 0 ? 0 : 1)
})

// 进度环计算
const circleLength = computed(() => 2 * Math.PI * 45)
const strokeDashoffset = computed(() => circleLength.value * (1 - progress.value / 100))

// 时间格式化
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// 当前时间和总时长的格式化显示
const currentTimeText = computed(() => formatTime(playerState.currentTime))
const durationText = computed(() => formatTime(playerState.duration))

// 音频元素初始化
onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})

// 组件卸载时清理所有资源
onUnmounted(() => {
  if (scaleTimeoutId) {
    clearTimeout(scaleTimeoutId)
    scaleTimeoutId = null
  }
})
</script>

<template>
  <div class="fixed bottom-4 left-4" :style="{ zIndex: Z_INDEX.MUSIC_PLAYER }">
    <audio ref="audioRef" hidden controls></audio>

    <!-- 歌曲信息卡片 -->
    <transition name="slide-up">
      <div v-if="playerState.isPlaying" class="song-info mb-2">
        <div class="text-sm font-medium text-text truncate">
          {{ playerState.currentSong?.name || '未知歌曲' }}
        </div>
        <div class="text-xs text-text/60 truncate">
          {{ playerState.currentSong?.artist || '未知艺术家' }}
        </div>
        <div class="text-xs text-text/40 mt-1">
          {{ currentTimeText }} / {{ durationText }}
        </div>
      </div>
    </transition>

    <motion.div
      class="player-container"
      :animate="currentRotation"
      :class="{ 'dragging': isDragging }"
    >
      <!-- 唱片图像 -->
      <div class="relative w-26 h-26">
        <img
          :src="playerState.coverUrl"
          class="album-cover"
          :class="{
            'paused': !playerState.isPlaying,
            'dragging': isDragging
          }"
          alt="Album cover"
        />

        <!-- 播放按钮（中心区域） -->
        <motion.button
          class="play-button"
          @click.stop="togglePlay"
          aria-label="Play/Pause"
          :animate="{ scale: buttonScale }"
          :transition="{ type: 'spring' }"
        >
          <transition name="fade-zoom" mode="out-in">
            <component
              :is="playerState.isPlaying ? PauseIcon : PlayIcon"
              class="play-icon"
              :key="playerState.isPlaying ? 'playing' : 'paused'"
            />
          </transition>
        </motion.button>

        <!-- 音量控制按钮 -->
        <button
          class="volume-button"
          @click="toggleVolumeControl"
          aria-label="Volume Control"
        >
          <component
            :is="volume > 0 ? SpeakerWaveIcon : SpeakerXMarkIcon"
            class="volume-icon"
          />
        </button>

        <!-- 音量控制滑块 -->
        <transition name="slide-fade">
          <div v-if="showVolumeControl" class="volume-control">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model="volume"
              @input="updateVolume(Number(($event.target as HTMLInputElement).value))"
              class="volume-slider"
              aria-label="Volume"
            />
            <div class="text-xs text-text/60 text-center mt-1">
              {{ Math.round(volume * 100) }}%
            </div>
          </div>
        </transition>

        <!-- 进度环背景轨道 -->
        <svg class="progress-ring" viewBox="0 0 100 100">
          <circle
            class="progress-bg"
            cx="50"
            cy="50"
            r="45"
            stroke-width="8"
            fill="transparent"
          />
          <circle
            class="progress-track"
            cx="50"
            cy="50"
            r="45"
            stroke-width="4"
            fill="transparent"
          />
          <circle
            class="progress-bar"
            cx="50"
            cy="50"
            r="45"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="circleLength"
            :stroke-dashoffset="strokeDashoffset"
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#3B82F6" />
              <stop offset="100%" stop-color="#60A5FA" />
            </linearGradient>
          </defs>
        </svg>

        <!-- 进度条控件（外环区域） -->
        <input
          type="range"
          class="progress-input"
          min="0"
          max="100"
          v-model="progress"
          @pointerdown="startDrag"
          aria-label="Seek"
        />
      </div>
    </motion.div>
  </div>
</template>

<style scoped>
.song-info {
  @apply bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50 max-w-48;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.player-container {
  @apply relative w-26 h-26 transition-transform;
}

.player-container.dragging {
  @apply scale-105;
}

.album-cover {
  @apply w-full h-full rounded-full object-cover border-2 border-border shadow-lg transition-all duration-300;
  will-change: transform;
  backface-visibility: hidden;
  box-shadow: 0 4px 24px 0 rgba(59, 130, 246, 0.10);
  transition: box-shadow 0.3s, filter 0.3s;
}

.album-cover.paused {
  filter: grayscale(30%);
  box-shadow: 0 2px 8px 0 rgba(59, 130, 246, 0.06);
}

.album-cover.dragging {
  box-shadow: 0 8px 32px 0 rgba(16, 185, 129, 0.18);
  filter: brightness(1.08);
}

.play-button {
  @apply absolute inset-0 flex items-center justify-center z-10 bg-background/10 rounded-full hover:bg-background/20 transition-colors;
  clip-path: circle(30% at 50% 50%);
  transition: background 0.2s;
}

.volume-button {
  @apply absolute top-1 right-1 w-7 h-7 flex items-center justify-center bg-background/20 rounded-full hover:bg-background/30 transition-all duration-200;
}

.volume-icon {
  @apply w-4 h-4 text-text/70;
}

.volume-control {
  @apply absolute -top-16 right-0 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50;
}

.volume-slider {
  @apply w-20 h-1 bg-border rounded-lg appearance-none cursor-pointer;
}

.volume-slider::-webkit-slider-thumb {
  @apply appearance-none w-3 h-3 bg-primary rounded-full cursor-pointer;
}

.volume-slider::-moz-range-thumb {
  @apply w-3 h-3 bg-primary rounded-full border-0 cursor-pointer;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.play-icon {
  @apply text-text transition-all duration-300 ease-DEFAULT w-10 h-10;
}

.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.play-icon.playing {
  @apply scale-110 text-primary/80;
}

.progress-ring {
  @apply absolute inset-0 transform -rotate-90;
}

.progress-bg {
  stroke: #e0e7ef;
  opacity: 0.5;
}

.dark .progress-bg {
  stroke: #334155;
  opacity: 0.6;
}

.progress-track {
  @apply stroke-background/10 fill-transparent;
}

.progress-bar {
  @apply fill-transparent;
  stroke: url(#progress-gradient);
  transition: stroke-dashoffset 0.2s linear;
}

.progress-input {
  @apply absolute inset-0 opacity-0 cursor-pointer;
  clip-path: circle(70% at 50% 50%);
}

/* 响应式优化 */
@media (max-width: 640px) {
  .song-info {
    @apply max-w-40 text-xs;
  }

  .volume-control {
    @apply -top-14;
  }
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  .player-container,
  .album-cover,
  .play-icon,
  .volume-icon {
    transition: none !important;
    animation: none !important;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .album-cover {
    border-width: 3px;
  }

  .progress-bg {
    opacity: 0.8;
  }

  .volume-control,
  .song-info {
    border-width: 2px;
  }
}
</style>
