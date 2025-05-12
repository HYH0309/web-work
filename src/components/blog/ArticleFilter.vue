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
  <div class="filter-container">
    <input v-model="searchTitle" class="search-input" placeholder="搜索文章标题..." />
    <div class="filter-tags">
      <PercentBadgeIcon class="tag-icon" />
      <span class="filter-label">筛选标签：</span>
      <button v-for="tag in availableTags" :key="tag" @click="toggleTag(tag)"
        :class="['tag-btn', { 'tag-btn-active': selectedTags.includes(tag) }]">
        {{ tag }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  @apply mb-8 backdrop-blur-sm bg-white/50 rounded-xl p-6 shadow-sm border border-gray-100;
}

.search-input {
  @apply w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-300 placeholder-gray-400;
}

.filter-tags {
  @apply mt-4 flex flex-wrap gap-2 items-center;
}

.tag-icon {
  @apply w-5 h-5;
}

.filter-label {
  @apply text-sm font-medium text-slate-500;
}

.tag-btn {
  @apply px-3.5 py-1 rounded-full transition-all duration-200;
}

.tag-btn-active {
  @apply bg-indigo-100/80 text-indigo-600 border border-indigo-300/50 hover:bg-indigo-200/60;
}

.tag-btn:not(.tag-btn-active) {
  @apply bg-slate-50 text-slate-500 hover:bg-white hover:shadow-xs hover:border-indigo-100 hover:text-indigo-600;
}
</style>
