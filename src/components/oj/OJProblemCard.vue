<script setup lang="ts">
defineProps<{
  id: number,
  title: string
}>()
</script>

<template>
  <RouterLink :to="{ name: 'OJDetail', params: { id } }" class="no-underline" custom v-slot="{ navigate }">
    <div @click="navigate"
      class="card-base cursor-pointer p-6 transform transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:z-10">
      <div class="grid grid-cols-[1fr_auto] items-center gap-4">
        <h3 class="text-lg font-medium text-foreground truncate">{{ title }}</h3>
      </div>
      <div class="mt-2 text-sm text-muted-foreground">题目ID: #{{ id }}</div>
    </div>
  </RouterLink>
</template>
