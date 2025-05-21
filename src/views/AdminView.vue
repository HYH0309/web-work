<script setup lang="ts">
import { ref } from 'vue'
import ArticleAdminView from '@/views/admin/ArticleAdminView.vue'
import TagAdminView from '@/views/admin/TagAdminView.vue'
import OJAdminView from '@/views/admin/OJAdminView.vue'

const tabs = [
  { name: '文章管理', component: ArticleAdminView },
  { name: '标签管理', component: TagAdminView },
  { name: 'OJ管理', component: OJAdminView }
]
const currentTab = ref(0)
</script>

<template>
  <div class="p-6">
    <div class="flex border-b border-gray-200 mb-6">
      <button v-for="(tab, index) in tabs" :key="index" @click="currentTab = index"
        class="px-4 py-2 text-sm font-medium" :class="{
          'text-blue-600 border-b-2 border-blue-600': currentTab === index,
          'text-gray-500 hover:text-gray-700': currentTab !== index
        }">
        {{ tab.name }}
      </button>
    </div>

    <component :is="tabs[currentTab].component" />
  </div>
</template>
