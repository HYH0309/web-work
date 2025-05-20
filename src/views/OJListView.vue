<script setup lang="ts">
import { ref, computed } from 'vue'
import OJFilterPanel from '@/components/oj/OJFilterPanel.vue'
import OJProblemCard from '@/components/oj/OJProblemCard.vue'

const isLoading = ref(false)
const searchQuery = ref('')

interface Problem {
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const problems: Problem[] = [
  { title: '两数之和', difficulty: 'easy' },
  { title: '无重复字符的最长子串', difficulty: 'medium' },
  { title: '寻找两个正序数组的中位数', difficulty: 'hard' },
  { title: '最长回文子串', difficulty: 'medium' },
  { title: '盛最多水的容器', difficulty: 'medium' }
]

const filteredProblems = computed(() => {
  return problems.filter(p =>
    p.title.includes(searchQuery.value) ||
    p.difficulty.includes(searchQuery.value as 'easy' | 'medium' | 'hard')
  )
})
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <OJFilterPanel v-model="searchQuery" />

    <div v-if="isLoading" class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="card-base animate-pulse">
        <div class="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="mt-4 flex justify-between">
          <div class="h-3 bg-gray-200 rounded w-1/3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <OJProblemCard v-for="problem in filteredProblems" :key="problem.title" :title="problem.title"
        :difficulty="problem.difficulty" :id="1" class="transition-all duration-300 hover:z-10 hover:shadow-xl" />
    </div>
  </div>
</template>
