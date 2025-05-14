<script setup lang="ts">
import { ref, watch } from 'vue'
import { PercentBadgeIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  availableTags: string[]
  initialSearchTitle?: string
  initialSelectedTags?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:searchTitle', value: string): void
  (e: 'update:selectedTags', value: string[]): void
}>()

const searchTitle = ref(props.initialSearchTitle || '')
const selectedTags = ref<string[]>(props.initialSelectedTags || [])

const toggleTag = (tag: string) => {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter(t => t !== tag)
    : [...selectedTags.value, tag]
  emit('update:selectedTags', selectedTags.value)
}

watch(searchTitle, (val) => {
  emit('update:searchTitle', val)
})
</script>

<template>
  <div class="filter-container ">
    <div class="relative max-w-lg mx-auto mb-4">
      <input v-model="searchTitle" class="search-input" placeholder="搜索文章标题...">
    </div>

    <div class="filter-tags">
      <PercentBadgeIcon class="w-5 h-5 " />
      <span class="">筛选标签：</span>
      <div class="flex flex-wrap gap-2">
        <button v-for="tag in availableTags" :key="tag" @click="toggleTag(tag)"
          :class="['tag-btn', { 'tag-active': selectedTags.includes(tag) }]">
          {{ tag }}
          <span v-if="selectedTags.includes(tag)" class="ml-1 w-1.5 h-1.5 rounded-full bg-success"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  @apply backdrop-blur-lg rounded-1 p-4 border transition-all theme-transition;
}

.search-input {
  @apply w-full px-4 py-2.5 rounded-full text-sm theme-transition bg-background text-text;
}

.filter-tags {
  @apply flex flex-wrap items-center gap-3 px-1;
}
</style>
