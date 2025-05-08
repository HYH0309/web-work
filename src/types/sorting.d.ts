declare global {
  interface SortingStep {
    arr: number[]
    activeIndices: number[]
    description?: string
  }
  interface SortingStats {
    comparisons: number
    swaps: number
    pivotIndex?: number
    recursionDepth?: number
    currentGap?: number
  }
  interface Algorithm {
    name: string
    timeComplexity: {
      best: string
      average: string
      worst: string
    }
    isRecursive?: boolean
    generator: (arr: number[], stats: SortingStats) => Generator<SortingStep>
  }
}
export type { Algorithm, SortingStep }
