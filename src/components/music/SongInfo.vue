<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore'

const playerStore = usePlayerStore()
</script>

<template>
  <div class="song-info" v-if="playerStore.currentSong">
    <img :src="playerStore.currentSong.cover" class="song-cover">
    <div>
      <div class="song-title">{{ playerStore.currentSong.title }}</div>
      <div class="song-artist">{{ playerStore.currentSong.artist }}</div>
    </div>
  </div>
</template>

<style scoped>
.song-info {
  @apply flex items-center gap-3;
}

.song-cover {
  @apply w-10 h-10 rounded-md object-cover;
}

.song-title {
  @apply text-sm font-medium truncate max-w-[120px];
}

.song-artist {
  @apply text-xs text-muted-foreground;
}
</style>
