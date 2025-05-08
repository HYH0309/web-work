import type { Algorithm } from '../types/sorting'

export const algorithms: Algorithm[] = [
  {
    name: '冒泡排序',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    generator: function* (arr: number[], stats: SortingStats) {
      const array = [...arr] // 工作副本
      stats.recursionDepth = 0
      let swapped = true

      // 添加提前终止检测
      for (let i = 0; i < array.length && swapped; i++) {
        swapped = false
        for (let j = 0; j < array.length - i - 1; j++) {
          stats.comparisons++
          yield { arr: [...array], activeIndices: [j, j + 1] }

          if (array[j] > array[j + 1]) {
            stats.swaps++
            ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
            swapped = true
            yield { arr: [...array], activeIndices: [j, j + 1] }
          }
        }
      }
      return { arr: array, activeIndices: [] }
    },
  },
  {
    name: '快速排序',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    isRecursive: true,
    generator: function* (arr: number[], stats: SortingStats) {
      const array = [...arr] // 工作副本

      // 三数取中法选择pivot
      function medianOfThree(a: number, b: number, c: number) {
        return [a, b, c].sort((x, y) => x - y)[1]
      }

      function* quickSort(low: number, high: number): Generator<SortingStep, void, void> {
        stats.recursionDepth = (stats.recursionDepth || 0) + 1
        if (high - low > 16) {
          // 对小数组使用插入排序
          const mid = Math.floor((low + high) / 2)
          const pivotValue = medianOfThree(array[low], array[mid], array[high])
          const pivotIndex = array.indexOf(pivotValue)

          // 将pivot移到末尾
          if (pivotIndex !== high) {
            ;[array[pivotIndex], array[high]] = [array[high], array[pivotIndex]]
            yield { arr: [...array], activeIndices: [pivotIndex, high] }
          }

          const partitionIndex = yield* partition(low, high)
          stats.pivotIndex = partitionIndex
          yield* quickSort(low, partitionIndex - 1)
          yield* quickSort(partitionIndex + 1, high)
        } else {
          yield* insertionSort(low, high)
        }
      }

      function* partition(low: number, high: number) {
        const pivot = array[high]
        let i = low - 1
        let j = high

        while (true) {
          while (array[++i] < pivot) {
            stats.comparisons++
            yield { arr: [...array], activeIndices: [i, high] }
          }
          while (j > low && array[--j] > pivot) {
            stats.comparisons++
            yield { arr: [...array], activeIndices: [j, high] }
          }
          if (i >= j) break

          stats.swaps++
          ;[array[i], array[j]] = [array[j], array[i]]
          yield { arr: [...array], activeIndices: [i, j, high] }
        }

        if (i !== high) {
          stats.swaps++
          ;[array[i], array[high]] = [array[high], array[i]]
          yield { arr: [...array], activeIndices: [i, high] }
        }
        return i
      }

      function* insertionSort(low: number, high: number) {
        for (let i = low + 1; i <= high; i++) {
          const current = array[i]
          let j = i - 1

          while (j >= low && array[j] > current) {
            stats.comparisons++
            stats.swaps++
            array[j + 1] = array[j]
            yield { arr: [...array], activeIndices: [j, j + 1] }
            j--
          }
          array[j + 1] = current
          yield { arr: [...array], activeIndices: [j + 1] }
        }
      }

      yield* quickSort(0, arr.length - 1)
      return { arr, activeIndices: [] }
    },
  },
  {
    name: '希尔排序',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log² n)',
      worst: 'O(n²)',
    },
    generator: function* (arr: number[], stats: SortingStats) {
      const array = [...arr]
      // 使用更高效的gap序列（Hibbard序列）
      let gap = 1
      while (gap < array.length / 3) gap = gap * 3 + 1

      while (gap > 0) {
        stats.currentGap = gap
        for (let i = gap; i < array.length; i++) {
          const temp = array[i]
          let j = i

          // 合并相邻操作减少yield次数
          while (j >= gap && array[j - gap] > temp) {
            stats.comparisons++
            stats.swaps++
            array[j] = array[j - gap]
            yield { arr: [...array], activeIndices: [j, j - gap] }
            j -= gap
          }

          if (j !== i) {
            array[j] = temp
            yield { arr: [...array], activeIndices: [j, i] }
          }
        }
        gap = Math.floor(gap / 3) // 对应Hibbard序列
      }
      return { arr: array, activeIndices: [] }
    },
  },
  {
    name: '插入排序',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    generator: function* (arr: number[], stats: SortingStats) {
      const array = [...arr] // 单一工作副本

      for (let i = 1; i < array.length; i++) {
        const current = array[i]
        let j = i

        // 步骤1：高亮当前元素
        yield {
          arr: [...array],
          activeIndices: [i],
          description: `正在处理元素 ${current}`,
        }

        // 步骤2：元素比较和移动
        while (j > 0 && array[j - 1] > current) {
          stats.comparisons++

          // 显示比较过程
          yield {
            arr: [...array],
            activeIndices: [j, j - 1],
            description: `比较 ${array[j - 1]} 和 ${current}`,
          }

          // 移动元素
          stats.swaps++
          array[j] = array[j - 1]
          yield {
            arr: [...array],
            activeIndices: [j - 1],
            description: `移动 ${array[j - 1]} 到右侧`,
          }

          j--
        }

        // 步骤3：插入元素并高亮最终位置
        if (j !== i) {
          array[j] = current
          yield {
            arr: [...array],
            activeIndices: [j],
            description: `${current} 插入到位置 ${j + 1}`,
          }
        }
      }

      return { arr: array, activeIndices: [] }
    },
  },
]
