<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore'

const playerStore = usePlayerStore()
</script>

<template>
  <div class="player-controls">
    <button @click="playerStore.prevSong()" class="control-button">
      ⏮
    </button>
    <button @click="playerStore.togglePlay()" class="play-button">
      <span v-if="playerStore.isPlaying">❚❚</span>
      <span v-else>▶</span>
    </button>
    <button @click="playerStore.nextSong()" class="control-button">
      ⏭
    </button>
    <button @click="playerStore.togglePlayMode()" class="control-button">
      <span v-if="playerStore.playMode === 'sequential'">→</span>
      <span v-if="playerStore.playMode === 'loop'">↻</span>
      <span v-if="playerStore.playMode === 'random'">⇄</span>
    </button>
  </div>
</template>

<style scoped>
.player-controls {
  @apply flex items-center justify-center gap-2.5;
}

.control-button {
  @apply w-8 h-8 flex items-center justify-center bg-transparent border-none text-foreground cursor-pointer hover:bg-muted/50 rounded-full transition-colors;
}

.play-button {
  @apply w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors;
}
</style>
