<script setup lang="ts">
import Editor from '@/components/composable/BaseEditor.vue'
import Modal from '@/components/composable/BaseModal.vue';
import { ref } from 'vue';
const isModalOpen = ref(false)

const problem = {
  title: '两数之和',
  difficulty: 'medium',
  description: `给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。

示例:
给定 nums = [2, 7, 11, 15], target = 9
因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]`,
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]'
    }
  ]
}

</script>

<template>
  <div class="container mx-auto p-4 max-w-6xl">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 题目详情 -->
      <div class="space-y-4">
        <h1 class="text-2xl font-bold">{{ problem.title }}</h1>

        <div class="flex items-center gap-2">
          <span class="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 font-medium">
            {{ problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难' }}
          </span>
        </div>

        <div class="prose max-w-none">
          <pre class="whitespace-pre-wrap">{{ problem.description }}</pre>

          <div v-for="(example, index) in problem.examples" :key="index" class="space-y-2">
            <h3 class="font-medium">示例 {{ index + 1 }}</h3>
            <div class="bg-gray-50 p-3 rounded">
              <p>输入: {{ example.input }}</p>
              <p>输出: {{ example.output }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 代码编辑和提交 -->
      <div class="space-y-4">
        <button @click="isModalOpen = true"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          打开代码编辑器
        </button>
        <div class="h-96">
          <Modal :show="isModalOpen" @close-show="isModalOpen = false">
            <Editor />
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>
