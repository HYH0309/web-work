<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'
import OJFilterPanel from '@/components/oj/OJFilterPanel.vue'
import OJProblemCard from '@/components/oj/OJProblemCard.vue'
import type { OJProblem } from '@/types/api'

const isLoading = ref(true)
const searchQuery = ref('')
const problems = ref<OJProblem[]>([])

onMounted(async () => {
  try {
    const res = await api.getOJProblems()
    if (res.status && res.data) {
      problems.value = res.data
    }
  } finally {
    isLoading.value = false
  }
})

const filteredProblems = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return problems.value.filter(p =>
    p.title.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <OJFilterPanel v-model="searchQuery" placeholder="搜索题目名称..." />

    <!-- 骨架屏 -->
    <div v-if="isLoading" class="grid gap-8 gap-y-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <div v-for="i in 8" :key="i" class="card-base animate-pulse bg-sky-50 dark:bg-sky-900 rounded-xl shadow-sm">
        <div class="h-8 w-8 bg-gray-200 rounded-full mb-3"></div>
        <div class="h-6 bg-gray-200 rounded mb-2 w-4/5"></div>
        <div class="h-4 bg-gray-200 rounded w-3/5 mb-4"></div>
        <div class="h-3 bg-gray-200 rounded w-full"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3 mt-2"></div>
      </div>
    </div>

    <!-- 题目卡片 -->
    <div v-else-if="filteredProblems.length" class="grid gap-8 gap-y-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <OJProblemCard v-for="problem in filteredProblems" :key="problem.id" :title="problem.title" :id="problem.id"
        class="transition-all duration-300 hover:z-10 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2" />
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12 text-gray-400">
      <div class="i-ph-magnifying-glass-duotone text-4xl mb-4 mx-auto" />
      <p>未找到匹配的题目</p>
    </div>
  </div>
</template>
