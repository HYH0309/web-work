<script setup lang="ts">
import MusicPlayer from '@/components/MusicPlayer.vue'
import NavBar from '@/components/NavBar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
  <ThemeToggle class="z-100" />
  <NavBar class="z-100" />
  <MusicPlayer class="z-100" />
  <RouterView class="z-0" />
</template>
