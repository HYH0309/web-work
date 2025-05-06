<script setup lang="ts">
import { CalendarIcon } from '@heroicons/vue/24/outline'
defineProps<{
  article: Article
}>()
</script>

<template>
  <article
    class="card-base h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md bg-white rounded-xl">
    <!-- 封面图 -->
    <div class="w-full h-32 relative">
      <img :src="article.coverUrl || '/default-cover.webp'"
        class="h-full w-full object-cover transition-opacity duration-300 hover:opacity-90" loading="lazy" alt="文章封面">
    </div>

    <!-- 内容区域 -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div class="space-y-2.5">
        <!-- 标题 -->
        <h3 class="text-lg font-semibold text-gray-800 truncate">
          {{ article.title }}
        </h3>

        <!-- 元信息 -->
        <div class="flex items-center gap-2 text-sm text-gray-600 truncate">
          <CalendarIcon class="w-4 h-4 flex-shrink-0" />
          <time :datetime="article.createdAt">
            {{ new Date(article.createdAt).toLocaleDateString('zh-CN', {
              year: 'numeric', month: 'long', day: 'numeric'
            }) }}
          </time>
        </div>
      </div>
      <!-- 标签 -->
      <div v-if="article.tags?.length" class="flex flex-wrap items-center gap-2 mt-2">
        <span v-for="(tag, i) in article.tags" :key="i"
          class="px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors">
          {{ tag }}
        </span>
      </div>
    </div>
  </article>
</template>
