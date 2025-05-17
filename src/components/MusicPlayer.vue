<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { motion } from 'motion-v'
import { usePlayerStore } from '@/stores/playerStore'

const { state: playerState, togglePlay, setVolume } = usePlayerStore()
const audioRef = ref<HTMLAudioElement | null>(null)
const progress = ref(0)

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const handleSeek = (e: Event) => {
  if (!audioRef.value) return
  const target = e.target as HTMLInputElement
  const seekTime = (Number(target.value) / 100) * audioRef.value.duration
  audioRef.value.currentTime = seekTime
}
// 加载示例音乐
onMounted(() => {
  if (audioRef.value) {
    audioRef.value.src = '/music/song1.mp3'
    usePlayerStore().setAudioElement(audioRef.value)

    audioRef.value.addEventListener('canplay', () => {
      console.log('音频已加载可播放')
    })
    audioRef.value.addEventListener('error', (e) => {
      console.error('音频加载错误:', e)
    })
    audioRef.value.addEventListener('timeupdate', () => {
      if (audioRef.value) {
        playerState.currentTime = audioRef.value.currentTime
        playerState.duration = audioRef.value.duration
        progress.value = (playerState.currentTime / playerState.duration) * 100
      }
    })
  }
})
// 新增旋转相关逻辑
const ROTATION_SPEED = 10 // 控制旋转速度（度数/秒）
const accumulatedRotation = ref(0)
let lastUpdateTime = 0
let animationFrameId = 0

const calculateRotation = (currentTime: number, isPlaying: boolean) => {
  if (!isPlaying) return accumulatedRotation.value

  const now = Date.now()
  const deltaTime = (now - lastUpdateTime) / 1000 // 转换为秒
  lastUpdateTime = now

  accumulatedRotation.value += deltaTime * ROTATION_SPEED
  return accumulatedRotation.value % 360
}

// 响应播放状态变化
watch(() => playerState.isPlaying, (isPlaying) => {
  if (isPlaying) {
    lastUpdateTime = Date.now()
    updateRotation()
  } else {
    cancelAnimationFrame(animationFrameId)
  }
})

const updateRotation = () => {
  if (!playerState.isPlaying) return

  // 更新用于计算的当前时间
  if (audioRef.value) {
    playerState.currentTime = audioRef.value.currentTime
  }

  animationFrameId = requestAnimationFrame(updateRotation)
}

// 初始旋转角度
const currentRotation = computed(() => ({
  rotate: playerState.isPlaying
    ? calculateRotation(playerState.currentTime, playerState.isPlaying)
    : accumulatedRotation.value
}))
</script>

<template>
  <div class="fixed bottom-4 left-4 bg-white/10 p-4 rounded-lg">
    <audio ref="audioRef" hidden controls></audio>
    <div class="flex flex-col items-center gap-4 w-64">
      <motion.div class="relative w-32 h-32 mb-4 cursor-pointer" :animate="currentRotation" :transition="{
        duration: 0.1,
        ease: 'linear',
        repeat: playerState.isPlaying ? Infinity : 0
      }" @click="togglePlay">
        <img :src="playerState.coverUrl"
          class="w-full h-full rounded-full object-cover shadow-lg border-4 border-white/20">
        <div class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-opacity">
          <span class="text-2xl text-white transform transition-transform"
            :class="{ 'scale-110': playerState.isPlaying }">
            {{ playerState.isPlaying ? '⏸' : '▶' }}
          </span>
        </div>
      </motion.div>
      <div class="flex items-center gap-4 w-full">

        <div class="flex-1">
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>{{ formatTime(playerState.currentTime) }}</span>
            <span>{{ formatTime(playerState.duration) }}</span>
          </div>
          <input type="range" min="0" max="100" v-model="progress" @input="handleSeek"
            class="w-full h-2 bg-gray-600 rounded-full appearance-none">
        </div>
      </div>

      <div class="w-full">
        <span class="text-xs text-gray-400">音量</span>
        <input type="range" min="0" max="100" v-model="playerState.volume" @input="setVolume(playerState.volume)"
          class="w-full h-2 bg-gray-600 rounded-full appearance-none">
      </div>
    </div>
  </div>
</template>
