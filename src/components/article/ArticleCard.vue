<script setup lang="ts">
import type { ArticleSummary } from '@/types/api';
import { CalendarIcon } from '@heroicons/vue/24/outline'

defineProps<{
  article: ArticleSummary
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <RouterLink :to="`/article/${article.id}`"
    class="block no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95 focus:ring-2 focus:ring-sky-200 rounded-xl">
    <article class="border border-border rounded-xl bg-white dark:bg-sky-950 shadow-sm overflow-hidden">
      <div class="aspect-video relative w-full h-40 overflow-hidden">
        <img :src="article.coverUrl || '/default-cover.webp'"
          class="h-full w-full object-cover transition-all duration-300 opacity-0" :class="{
            'opacity-100': article.coverUrl,
            'hover:scale-105 hover:brightness-95': article.coverUrl
          }" loading="lazy" alt="文章封面" @error="(e) => (e.target as HTMLImageElement).src = '/default-cover.webp'">
        <div v-if="!article.coverUrl"
          class="absolute inset-0 animate-pulse bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-900 dark:to-emerald-950">
        </div>
      </div>
      <div class="p-5 flex flex-col gap-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold line-clamp-2 text-sky-800 dark:text-sky-100">{{ article.title }}</h3>
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <CalendarIcon class="w-4 h-4" />
            <time :datetime="article.createdAt.toString()">
              {{ formatDate(article.createdAt.toString()) }}
            </time>
          </div>
        </div>
        <div v-if="article.tags?.length" class="flex flex-wrap items-center gap-2">
          <span v-for="(tag, i) in article.tags" :key="i"
            class="px-2 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors">
            {{ tag }}
          </span>
        </div>
      </div>
    </article>
  </RouterLink>
</template>

<style scoped>
.article-title {
  @apply text-base font-medium line-clamp-2 text-text;
}

.tag-item {
  @apply px-2 py-1 text-xs font-medium rounded-md transition-colors;
}
</style>
