<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore'

const playerStore = usePlayerStore()

const setVolume = (e: Event) => {
  const target = e.target as HTMLInputElement
  playerStore.setVolume(Number(target.value))
}
</script>

<template>
  <div class="volume-control">
    <span class="volume-label">音量</span>
    <input type="range" min="0" max="100" :value="playerStore.volume" @input="setVolume" class="volume-slider" />
  </div>
</template>

<style scoped>
.volume-control {
  @apply flex items-center gap-2 mt-2;
}

.volume-label {
  @apply text-xs w-8;
}

.volume-slider {
  @apply w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer;
}

.volume-slider::-webkit-slider-thumb {
  @apply appearance-none h-3 w-3 rounded-full bg-primary;
}
</style>
