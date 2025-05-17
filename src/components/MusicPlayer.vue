<script setup lang="ts">
import { motion } from 'motion-v'
import { usePlayerStore } from '@/stores/playerStore'
import useAudioPlayer from '@/composables/useAudioPlayer'
import useRotationAnimation from '@/composables/useRotationAnimation'

const { state: playerState, togglePlay, setVolume } = usePlayerStore()
const { audioRef, progress, formatTime, handleSeek } = useAudioPlayer()
const { currentRotation } = useRotationAnimation()
</script>

<template>
  <div class="fixed bottom-4 left-4 group">
    <audio ref="audioRef" hidden controls></audio>
    <div class="relative w-36 h-36 transition-all duration-300 group-hover:w-48">
      <!-- 唱片部分 -->
      <motion.div class="relative w-full h-full cursor-pointer" :animate="currentRotation" @click="togglePlay">
        <img :src="playerState.coverUrl"
          class="w-full h-full rounded-full object-cover shadow-lg border-4 border-white/20">
        <div class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
          <span class="text-2xl text-white transition-transform duration-200"
            :class="{ 'scale-110': playerState.isPlaying }">
            {{ playerState.isPlaying ? '⏸' : '▶' }}
          </span>
        </div>
      </motion.div>

      <!-- 控制面板 (悬停显示) -->
      <div class="absolute bottom-0 left-0 right-0 p-2 bg-black/80 rounded-b-lg
                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <!-- 进度条 -->
        <div class="mb-2">
          <input type="range" min="0" max="100" v-model="progress" @input="handleSeek"
            class="w-full h-1 bg-gray-600 rounded-full appearance-none hover:h-2 transition-all">
          <div class="flex justify-between text-xs text-gray-300 mt-1">
            <span>{{ formatTime(playerState.currentTime) }}</span>
            <span>{{ formatTime(playerState.duration) }}</span>
          </div>
        </div>

        <!-- 音量控制 -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-300">🔊</span>
          <input type="range" min="0" max="100" v-model="playerState.volume" @input="setVolume(playerState.volume)"
            class="flex-1 h-1 bg-gray-600 rounded-full appearance-none hover:h-2 transition-all">
        </div>
      </div>
    </div>
  </div>
</template>
