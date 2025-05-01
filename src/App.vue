<script setup lang="ts">
import ArticleCard from './components/ArticleCard.vue'
const articleFull = {
  id: 123, // 数字ID
  title: "Vue 3 + UnoCSS 最佳实践指南",
  description: "本文将深入探讨如何在Vue 3项目中高效使用UnoCSS，包括动态主题配置、原子化样式组织策略，以及与Headless UI的深度集成方案。通过实际案例演示性能优化技巧...",
  tags: [
    { name: "Vue", color: "green" },
    { name: "前端", color: "blue" },
    { name: "CSS框架", color: "purple" }
  ],
  date: "2023-08-20",
  coverImage: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=800"
}
</script>

<template>
  <ArticleCard :id="articleFull.id" :title="articleFull.title" :description="articleFull.description"
    :tags="articleFull.tags" :date="articleFull.date" :coverImage="articleFull.coverImage" />
</template>
<style scoped></style>
