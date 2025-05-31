<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { api } from '@/api'

// 导入类型定义
import type { ColorType } from '@/types/admin'
import type { StatConfig } from '@/types/admin'

// 导入配置数据
import { ADMIN_TABS, COLOR_STYLES, BASE_CLASSES } from '@/config/admin'

// 状态管理
const currentTab = ref(0)
const isLoading = ref(false)
const statsData = ref<StatConfig[]>([
  { label: '总文章数', value: 0, icon: ADMIN_TABS[0].icon, color: 'blue' },
  { label: '总标签数', value: 0, icon: ADMIN_TABS[1].icon, color: 'green' },
  { label: 'OJ题目数', value: 0, icon: ADMIN_TABS[2].icon, color: 'purple' },
])

// 计算属性
const currentTabData = computed(() => ADMIN_TABS[currentTab.value])

// 简化的样式工具函数
const getStyle = (color: ColorType, type: 'bg' | 'text' | 'border' | 'active' | 'indicator' | 'ring') => {
  return COLOR_STYLES[color][type]
}

// 获取统计数据
const fetchStats = async () => {
  isLoading.value = true
  try {
    // 获取文章数据
    const articlesResponse = await api.getArticles()
    if (articlesResponse.status && articlesResponse.data) {
      statsData.value[0].value = articlesResponse.data.length
    }

    // 获取标签数据
    const tagsResponse = await api.getTags()
    if (tagsResponse.status && tagsResponse.data) {
      statsData.value[1].value = tagsResponse.data.length
    }

    // 获取OJ题目数据
    const ojProblemsResponse = await api.getOJProblems()
    if (ojProblemsResponse.status && ojProblemsResponse.data) {
      statsData.value[2].value = ojProblemsResponse.data.length
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  fetchStats()
})

const handleStatClick = (statLabel: string) => {
  // 根据统计卡片类型切换到相应的标签页
  if (statLabel === '总文章数') {
    currentTab.value = 0 // 切换到文章管理
  } else if (statLabel === '总标签数') {
    currentTab.value = 1 // 切换到标签管理
  } else if (statLabel === 'OJ题目数') {
    currentTab.value = 2 // 切换到OJ管理
  }
  // 切换标签页后重新获取统计数据
  fetchStats()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 页面头部 -->
    <header :class="[BASE_CLASSES.card, 'shadow-sm mb-0']">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 :class="['text-3xl font-bold', BASE_CLASSES.heading]">管理后台</h1>
            <p :class="['mt-1 text-sm', BASE_CLASSES.subtext]">管理网站内容和数据</p>
          </div>
        </div>
      </div>
    </header>

    <!-- 统计概览 -->
    <section class="max-w-7xl mx-auto px-6 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div v-for="(stat, index) in statsData" :key="stat.label" :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }" :transition="{ delay: index * 0.1, duration: 0.5 }"
          @click="handleStatClick(stat.label)" :class="[
            BASE_CLASSES.card,
            'hover:shadow-md p-6 cursor-pointer',
            BASE_CLASSES.button,
            currentTab === index ? getStyle(stat.color, 'border') + ' ring-2 ring-offset-2 ' + getStyle(stat.color, 'ring') : '',
            getStyle(stat.color, 'border')
          ]">
          <div class="flex items-center">
            <div :class="['p-3 rounded-lg', getStyle(stat.color, 'bg')]">
              <component :is="stat.icon" :class="['w-6 h-6', getStyle(stat.color, 'text')]" />
            </div>
            <div class="ml-4">
              <p :class="['text-sm font-medium', BASE_CLASSES.subtext]">{{ stat.label }}</p>
              <div :class="['text-2xl font-semibold', BASE_CLASSES.heading]">
                <span v-if="isLoading"
                  class="inline-block w-8 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></span>
                <span v-else>{{ stat.value }}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <!-- 主内容区 -->
    <main class="max-w-7xl mx-auto px-6 pb-12">
      <!-- 当前页面信息 -->
      <div :class="[BASE_CLASSES.card, 'mb-6 p-4']">
        <div class="flex items-center gap-3">
          <div :class="['p-2 rounded-lg', getStyle(currentTabData.color, 'bg')]">
            <component :is="currentTabData.activeIcon" :class="['w-5 h-5', getStyle(currentTabData.color, 'text')]" />
          </div>
          <div>
            <h2 :class="['text-lg font-semibold', BASE_CLASSES.heading]">{{ currentTabData.name }}</h2>
            <p :class="['text-sm', BASE_CLASSES.subtext]">{{ currentTabData.description }}</p>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div :class="[BASE_CLASSES.card, 'overflow-hidden']">
        <AnimatePresence mode="wait">
          <motion.div :key="currentTab" :initial="{ opacity: 0, x: 20 }" :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: -20 }" :transition="{ duration: 0.3, ease: 'easeInOut' }" class="p-6">
            <component :is="currentTabData.component" />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  </div>
</template>
