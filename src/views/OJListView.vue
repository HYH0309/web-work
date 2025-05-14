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

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else class="space-y-3">
      <OJProblemCard v-for="problem in filteredProblems" :key="problem.title" :title="problem.title"
        :difficulty="problem.difficulty" :id="1" />
    </div>
  </div>
</template>
