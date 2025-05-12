<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useSearchStore } from '@/stores/searchStore'
import { algorithms } from '@/composables/useSearch'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import BaseControlPanel from '@/components/composable/BaseControlPanel.vue'

const store = useSearchStore()

const generateMaze = () => {
  // 简单迷宫生成逻辑
  const grid = store.state.grid.map(row => [...row])
  for (let i = 1; i < grid.length; i += 2) {
    for (let j = 1; j < grid[0].length; j += 2) {
      grid[i][j] = 'wall'
    }
  }
  store.state.grid = grid
}

const generateRandomWalls = () => {
  const grid = store.state.grid.map(row => [...row])
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] !== 'start' && grid[i][j] !== 'end' && Math.random() < 0.2) {
        grid[i][j] = 'wall'
      }
    }
  }
  store.state.grid = grid
}
</script>

<template>
  <BaseControlPanel direction="horizontal">
    <Menu as="div" class="relative">
      <MenuButton class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        :disabled="store.state.isSearching">
        {{ store.state.selectedAlgorithm?.name || '选择算法' }}
        <ChevronDownIcon class="w-5 h-5 align-bottom" />
      </MenuButton>
      <MenuItems class="absolute z-10 mt-1 w-56 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
        <MenuItem v-for="algo in algorithms" :key="algo.name" v-slot="{ active }">
        <button :class="[
          active ? 'bg-primary-100 text-primary-900' : 'text-gray-900',
          'block w-full px-4 py-2 text-left text-sm'
        ]" @click="store.state.selectedAlgorithm = algo">
          {{ algo.name }}
        </button>
        </MenuItem>
      </MenuItems>
    </Menu>

    <div class="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
      <span class="text-sm font-mono text-gray-700 px-2 py-1 bg-gray-50 rounded-md border">
        Steps
      </span>
      <input type="range" v-model="store.state.speed" :min="10" :max="200" :step="10"
        class="w-full h-2 bg-gray-100 rounded-full accent-primary-500">
      <span class="text-sm font-mono text-gray-700 px-2 py-1 bg-gray-50 rounded-md border">
        {{ (store.state.speed / 1000).toFixed(2) }}s
      </span>
    </div>

    <template #actions>
      <button class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        @click="store.startSearching" :disabled="store.state.isSearching">
        {{ store.state.isSearching ? '搜索中...' : '开始搜索' }}
      </button>
      <button class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        @click="generateRandomWalls" :disabled="store.state.isSearching">
        随机障碍
      </button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        @click="generateMaze" :disabled="store.state.isSearching">
        迷宫模板
      </button>
      <button class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        @click="store.state.isManualMode = !store.state.isManualMode"
        :class="{ 'bg-purple-500 text-grey': store.state.isManualMode }" :disabled="store.state.isSearching">
        {{ store.state.isManualMode ? '手动模式' : '自动模式' }}
      </button>
      <button class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600/90 transition-colors"
        @click="store.nextStep()" :disabled="!store.state.isSearching || !store.state.isManualMode">
        下一步
      </button>
      <button class="px-4 py-2 bg-danger-500 text-white rounded-md hover:bg-danger-600 transition-colors"
        @click="store.resetGrid">
        重置
      </button>
      <button class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600/90 transition-colors"
        @click="store.openShow">
        算法介绍
      </button>
    </template>
  </BaseControlPanel>
</template>

<style scoped>
button:disabled {
  @apply bg-gray-300 text-gray-500 cursor-not-allowed;
}
</style>
