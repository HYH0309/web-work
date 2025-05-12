import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { algorithms } from '@/composables/useSort'
import type { SortingAlgorithm, SortingStats, SortingStep } from '../types/sort'

const generateRandomArray = (length = 6, max = 40, min = 10) =>
  Array.from({ length }, () => Math.floor(Math.random() * max) + 1 + min)

export const useSortingStore = defineStore('sorting', () => {
  const state = reactive({
    order: generateRandomArray(),
    isSorting: false,
    isManualMode: false,
    currentStep: 0,
    description: 'description',
    show: false,
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
    speed: 500,
    selectedAlgorithm: algorithms[0] as SortingAlgorithm,
  })

  let animationFrameId: number | null = null
  let sortGenerator: Generator<SortingStep, void, SortingStep>

  const startSorting = () => {
    if (state.isSorting) return
    state.isSorting = true
    state.currentStep = 0
    state.stats = { comparisons: 0, swaps: 0, recursionDepth: 0, currentGap: 0 }
    sortGenerator = state.selectedAlgorithm.generator([...state.order], state.stats)

    if (!state.isManualMode) {
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
  }

  const nextStep = () => {
    if (!state.isSorting || !state.isManualMode) return

    const result = sortGenerator.next()
    if (result.done) {
      state.isSorting = false
      state.activeIndices = []
      return
    }

    state.order = result.value.arr
    state.activeIndices = result.value.activeIndices
    state.currentStep++
    if (result.value.description) {
      state.description = result.value.description
    }
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
    state.description = 'description'
    state.stats = { comparisons: 0, swaps: 0, recursionDepth: 0, currentGap: 0 } as SortingStats
  }
  const openShow = () => {
    state.show = true
  }
  const closeShow = () => {
    state.show = false
  }
  return {
    state,
    algorithms,
    startSorting,
    resetArray,
    nextStep,
    openShow,
    closeShow,
  }
})
