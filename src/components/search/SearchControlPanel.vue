<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useSearchStore } from '@/stores/searchStore'
import { algorithms } from '@/composables/useSearch'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import BaseControlPanel from '@/components/composable/BaseControlPanel.vue'

const store = useSearchStore()

const generateMaze = () => {
  // 迷宫生成逻辑保持不变
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
    <!-- 算法选择菜单 -->
    <Menu as="div" class="relative">
      <MenuButton class="menu-trigger" :disabled="store.state.isSearching">
        {{ store.state.selectedAlgorithm?.name || '选择算法' }}
        <ChevronDownIcon class="menu-icon" />
      </MenuButton>
      <MenuItems class="dropdown-panel">
        <MenuItem v-for="algo in algorithms" :key="algo.name" v-slot="{ active }">
        <button :class="['dropdown-item', active && 'dropdown-item-active']"
          @click="store.state.selectedAlgorithm = algo">
          {{ algo.name }}
        </button>
        </MenuItem>
      </MenuItems>
    </Menu>

    <!-- 速度控制 -->
    <div class="speed-control">
      <span class="speed-label">Steps</span>
      <input type="range" v-model="store.state.speed" :min="10" :max="200" :step="10" class="speed-slider">
      <span class="speed-value">
        {{ (store.state.speed / 1000).toFixed(2) }}s
      </span>
    </div>

    <!-- 操作按钮组 -->
    <template #actions>
      <button class="control-btn primary" @click="store.startSearching" :disabled="store.state.isSearching">
        {{ store.state.isSearching ? '搜索中...' : '开始搜索' }}
      </button>
      <button class="control-btn success" @click="generateRandomWalls" :disabled="store.state.isSearching">
        随机障碍
      </button>
      <button class="control-btn info" @click="generateMaze" :disabled="store.state.isSearching">
        迷宫模板
      </button>
      <button class="control-btn mode-toggle" @click="store.state.isManualMode = !store.state.isManualMode"
        :class="{ manual: store.state.isManualMode }" :disabled="store.state.isSearching">
        {{ store.state.isManualMode ? '手动模式' : '自动模式' }}
      </button>
      <button class="control-btn primary" @click="store.nextStep()"
        :disabled="!store.state.isSearching || !store.state.isManualMode">
        下一步
      </button>
      <button class="control-btn danger" @click="store.resetGrid">
        重置
      </button>
      <button class="control-btn primary" @click="store.openShow">
        算法介绍
      </button>
    </template>
  </BaseControlPanel>
</template>

<style scoped>
/* 菜单触发按钮 */
.menu-trigger {
  @apply px-4 py-2 bg-primary text-on-primary rounded-md theme-transition hover:bg-primary-hover flex items-center gap-2;
}

.menu-icon {
  @apply w-5 h-5 text-on-primary/80;
}

/* 下拉菜单 */
.dropdown-panel {
  @apply absolute z-dropdown mt-1 w-56 bg-card shadow-dropdown rounded-md border-border border theme-transition;
}

.dropdown-item {
  @apply block w-full px-4 py-2 text-left text-sm text-text theme-transition;
}

.dropdown-item-active {
  @apply bg-primary/10 text-primary;
}

/* 速度控制 */
.speed-control {
  @apply flex items-center gap-3 px-3 py-2 bg-panel rounded-lg border-border border theme-transition;
}

.speed-label {
  @apply text-sm font-mono text-text-muted px-2 py-1 bg-background-muted rounded-md border-border border;
}

.speed-slider {
  @apply w-full h-2 bg-background-muted rounded-full accent-primary;
}

.speed-value {
  @apply text-sm font-mono text-text-muted px-2 py-1 bg-background-muted rounded-md border-border border;
}

/* 控制按钮 */
.control-btn {
  @apply px-4 py-2 rounded-md theme-transition font-medium;
}

.control-btn.primary {
  @apply bg-primary text-on-primary hover:bg-primary-hover;
}

.control-btn.success {
  @apply bg-success text-on-success hover:bg-success-hover;
}

.control-btn.info {
  @apply bg-info text-on-info hover:bg-info-hover;
}

.control-btn.danger {
  @apply bg-danger text-on-danger hover:bg-danger-hover;
}

.control-btn.mode-toggle {
  @apply bg-warning text-on-warning hover:bg-warning-hover;
}

.control-btn.mode-toggle.manual {
  @apply bg-purple text-on-purple;
}

button:disabled {
  @apply bg-disabled text-text-disabled cursor-not-allowed;
}
</style>
