<script setup lang="ts">
import SortingVisualizer from '../components/SortingVisualizer.vue'
import { computed } from 'vue'

const { algorithm } = defineProps<{
  algorithm: 'bubble' | 'quick' | 'merge'
}>()

const algorithmInfo = computed(() => {
  const infoMap = {
    bubble: {
      title: '冒泡排序',
      complexity: 'O(n²)',
      steps: [
        '比较相邻元素，如果第一个比第二个大就交换',
        '对每一对相邻元素重复以上操作',
        '针对所有元素重复上述步骤，直到排序完成'
      ]
    },
    quick: {
      title: '快速排序',
      complexity: 'O(n log n)',
      steps: [
        '从数列中挑出一个基准元素',
        '重新排列数列，所有比基准小的放在前面',
        '递归地对两个子序列进行排序'
      ]
    },
    merge: {
      title: '归并排序',
      complexity: 'O(n log n)',
      steps: [
        '将数组分成两个子数组',
        '递归地对子数组进行排序',
        '合并两个已排序的子数组'
      ]
    }
  }
  return infoMap[algorithm]
})
</script>

<template>
  <div class="algorithm-view">
    <div class="layout-container">
      <div class="info-panel">
        <h1>{{ algorithmInfo.title }} 算法介绍</h1>
        <div class="complexity">
          <h3>时间复杂度：</h3>
          <p>{{ algorithmInfo.complexity }}</p>
        </div>
        <div class="steps">
          <h3>算法步骤：</h3>
          <ol>
            <li v-for="(step, index) in algorithmInfo.steps" :key="index">{{ step }}</li>
          </ol>
        </div>
      </div>

      <div class="visual-panel">
        <SortingVisualizer :algorithm="algorithm" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.algorithm-view {
  padding: 20px;
  height: 100vh;
}

.layout-container {
  display: flex;
  gap: 30px;
  height: 100%;
}

.info-panel {
  flex: 0 0 300px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.visual-panel {
  flex: 1;
  min-width: 0;
}

h1 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

h3 {
  color: #34495e;
  margin: 1rem 0 0.5rem;
  font-size: 1.1rem;
}

ol {
  padding-left: 1.5rem;
  line-height: 1.6;
}

li {
  margin-bottom: 0.5rem;
}

.complexity p {
  font-weight: bold;
  color: #e74c3c;
}
</style>
