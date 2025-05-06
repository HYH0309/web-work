<script setup lang="ts">
import SortingVisualizer from './components/SortingVisualizer.vue';
const algorithm = "bubble"
</script>

<template>
  <SortingVisualizer :algorithm='algorithm' />
</template>
<style scoped></style>
