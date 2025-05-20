<template>
  <nav class="fixed right-0 top-1/2 transform -translate-y-1/2 w-10 h-auto
              bg-muted/70 rounded-l-2xl py-5 flex flex-col gap-5
              transition-all duration-300 hover:w-50 z-100 shadow-lg" @mouseenter="expand" @mouseleave="collapse">
    <RouterLink v-for="route in routes" :key="route.path" :to="route.path" class="nav-link"
      active-class="active bg-background/10">
      <component :is="route.icon" class=" w-6 h-6 min-w-6 mr-4" />
      <span class=" opacity-40 transition-opacity duration-200 delay-100 group-hover:opacity-100 hover:opacity-100">
        {{ route.text }}
      </span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  HomeIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  Squares2X2Icon
} from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'

const routes = [
  { path: '/', text: '首页', icon: HomeIcon },
  { path: '/article-list', text: '文章', icon: DocumentTextIcon },
  { path: '/oj-list', text: 'OJ题目', icon: CodeBracketIcon },
  { path: '/visualizer', text: '可视化', icon: Squares2X2Icon }
]

const isExpanded = ref(false)

const expand = () => {
  isExpanded.value = true
}

const collapse = () => {
  isExpanded.value = false
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center no-underline py-2 px-5 whitespace-nowrap overflow-hidden;
}
</style>
