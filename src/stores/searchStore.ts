import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { algorithms } from '../composables/useSearch'
import type { SearchAlgorithm, SearchStats, SearchStep } from '../types/search'
import type { CellType } from '../types/search'
function initializeGrid(rows: number, cols: number): CellType[][] {
  const grid = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill('empty') as CellType[])
  grid[0][0] = 'start'
  grid[rows - 1][cols - 1] = 'end'
  return grid
}
export const useSearchStore = defineStore('search', () => {
  const state = reactive({
    grid: initializeGrid(12, 15),
    isSearching: false,
    isManualMode: false,
    show: false,
    currentStep: 0,
    description: 'description',
    stats: {
      visitedNodes: 0,
      pathLength: 0,
      maxNode: 0,
    } as SearchStats,
    speed: 100,
    selectedAlgorithm: algorithms[0] as SearchAlgorithm,
  })

  let animationFrameId: number | null = null
  let searchGenerator: Generator<SearchStep, void, SearchStep>

  const startSearching = () => {
    //启动前判断
    if (state.isSearching || !state.selectedAlgorithm) return
    state.isSearching = true
    state.stats = { visitedNodes: 0, pathLength: 0, maxNode: 0 }
    searchGenerator = state.selectedAlgorithm.generator(state.grid, state.stats)
    //
    if (!state.isManualMode) {
      const animate = () => {
        const result = searchGenerator.next()
        if (result.done) {
          state.isSearching = false
          return
        }

        state.grid = result.value.grid
        if (result.value.description) {
          state.description = result.value.description
        }
        animationFrameId = setTimeout(() => requestAnimationFrame(animate), state.speed)
      }
      animationFrameId = requestAnimationFrame(animate)
    }
  }
  const nextStep = () => {
    if (!state.isSearching || !state.isManualMode) return

    const result = searchGenerator.next()
    if (result.done) {
      state.isSearching = false
      return
    }
    state.grid = result.value.grid
    state.currentStep++
    if (result.value.description) {
      state.description = result.value.description
    }
  }
  const resetGrid = () => {
    if (animationFrameId) {
      clearTimeout(animationFrameId)
    }
    state.isSearching = false
    state.grid = initializeGrid(12, 15)
    state.description = 'description'
    state.stats = { visitedNodes: 0, pathLength: 0, maxNode: 0 }
  }
  const openShow = () => {
    state.show = true
  }
  const closeShow = () => {
    state.show = false
  }
  return {
    state,
    startSearching,
    nextStep,
    resetGrid,
    closeShow,
    openShow,
  }
})
