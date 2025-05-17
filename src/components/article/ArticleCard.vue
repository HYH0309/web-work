<script setup lang="ts">
import type { ArticleSummary } from '@/types/article';
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
    class="block no-underline theme-transition hover:-translate-y-1 active:scale-95">
    <article class="card-base border border-border hover:-translate-y-0.5">
      <div class="aspect-video bg-muted relative w-full h-40 rounded-md overflow-hidden">
        <!-- 封面图 -->
        <img :src="article.coverUrl || '/default-cover.webp'"
          class="h-full w-full object-cover transition-opacity duration-300 opacity-0" :class="{
            'opacity-100': article.coverUrl,
            'hover:brightness-[98%]': article.coverUrl
          }" loading="lazy" alt="文章封面" @error="(e) => (e.target as HTMLImageElement).src = '/default-cover.webp'">

        <div v-if="!article.coverUrl" class="absolute inset-0 animate-pulse bg-muted"></div>
      </div>

      <div class=" p-4 flex flex-col gap-4">
        <div class="space-y-3">
          <h3 class="article-title text-text">
            {{ article.title }}
          </h3>

          <div class="flex items-center gap-1 text-sm  text-text">
            <CalendarIcon class="w-4 h-4" />
            <time :datetime="article.createdAt.toString()">
              {{ formatDate(article.createdAt.toString()) }}
            </time>
          </div>
        </div>

        <div v-if="article.tags?.length" class="flex flex-wrap items-center gap-1">
          <span v-for="(tag, i) in article.tags" :key="i"
            class="tag-item text-success bg-success/10 hover:bg-success/20">
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
