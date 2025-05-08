import { reactive, computed, onBeforeUnmount } from 'vue'
import { algorithms } from './useSortingAlgorithms'
import type { Algorithm } from '../types/sorting'

const generateRandomArray = (length = 6, max = 50) =>
  Array.from({ length }, () => Math.floor(Math.random() * max) + 1)

export default () => {
  const state = reactive({
    order: generateRandomArray(),
    isSorting: false,
    description: '',
    stats: {
      comparisons: 0,
      swaps: 0,
      comparingIndices: [] as number[],
      swappingIndices: [] as number[],
      pivotIndex: -1,
      recursionDepth: 0,
      currentGap: 0,
    } as SortingStats,
    activeIndices: [] as number[],
    speed: 1000,
    selectedAlgorithm: algorithms[0] as Algorithm,
  })

  let animationFrameId: number | null = null
  let sortGenerator: Generator<SortingStep, void, SortingStep>

  const startSorting = () => {
    if (state.isSorting) return
    state.isSorting = true
    state.stats = { comparisons: 0, swaps: 0, recursionDepth: 0, currentGap: 0 }
    sortGenerator = state.selectedAlgorithm.generator([...state.order], state.stats)

    const animate = () => {
      const result = sortGenerator.next()
      if (result.done) {
        state.isSorting = false
        state.activeIndices = []
        return
      }

      state.order = result.value.arr
      state.activeIndices = result.value.activeIndices
      if (result.value.description) {
        state.description = result.value.description
      }
      animationFrameId = setTimeout(() => requestAnimationFrame(animate), state.speed)
    }
    animationFrameId = requestAnimationFrame(animate)
  }

  const resetArray = () => {
    if (animationFrameId) {
      if (typeof animationFrameId === 'number') {
        cancelAnimationFrame(animationFrameId)
      } else {
        clearTimeout(animationFrameId)
      }
    }
    state.isSorting = false
    state.activeIndices = []
    state.order = generateRandomArray()
    state.description = ''
    state.stats = { comparisons: 0, swaps: 0, recursionDepth: 0, currentGap: 0 } as SortingStats
  }

  onBeforeUnmount(() => {
    if (animationFrameId) {
      if (typeof animationFrameId === 'number') {
        cancelAnimationFrame(animationFrameId)
      } else {
        clearTimeout(animationFrameId)
      }
    }
  })

  return {
    state,
    algorithms,
    startSorting,
    resetArray,
    statsDisplay: computed(() => ({
      comparisons: state.stats.comparisons,
      swaps: state.stats.swaps,
      recursionDepth: state.stats.recursionDepth,
      currentGap: state.stats.currentGap,
    })),
  }
}
