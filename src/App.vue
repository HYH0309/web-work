<script setup lang="ts">
import MusicPlayer from '@/components/MusicPlayer.vue'
import NavBar from '@/components/NavBar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
  <ThemeToggle />
  <NavBar />
  <MusicPlayer />
  <RouterView />
</template>
