
# 冒泡排序

## 🌟 核心特征

- **冒泡排序**是一种简单直观的比较排序算法，通过重复遍历要排序的数列，依次比较相邻两个元素，如果顺序错误则交换位置，每一趟遍历都能将未排序部分的最大元素放置到正确位置。其核心创新点在于：**通过相邻元素的比较和交换，逐步将最大元素“冒泡”到序列末尾**。
- 典型应用场景为数据量较小且对稳定性有一定要求的排序场景。
- 数学复杂度标识：$$ \mathcal{O}(n^2) $$

## 🧮 形式化描述

### 时间复杂度

$$
T(n) = \begin{cases}
    \Theta(n) & \text{最佳情况（已有序）} \\
    \Theta(n^2) & \text{最坏情况（逆序）和其他情况}
\end{cases}
$$

### 空间复杂度

$$ S(n) = \Theta(1) $$

## 🛠 实现步骤

1. **预处理阶段**：无需特殊预处理，直接对输入数组进行操作。
2. **核心逻辑**：

    ```python
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    ```

3. **终止条件**：完成 n-1 趟遍历后排序结束，或者在某趟遍历中未发生任何交换则提前终止。

## 📊 性能对比

| 指标类型 | 最优情况 | 典型情况 | 最差情况 |
| -------- | -------- | -------- | -------- |
| 时间效率 | O(n)     | O(n²)    | O(n²)    |
| 内存消耗 | O(1)     | O(1)     | O(1)     |

## 💻 代码实现

### Python 示例

```python
def bubble_sort(arr: list[int]) -> list[int]:
    """冒泡排序算法实现"""
    if not arr:
        raise ValueError("输入数组不能为空")
    n = len(arr)
    for i in range(n):
        # 提前退出标记
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # 如果没有发生交换，提前退出
        if not swapped:
            break
    return arr
```

### Java 示例

```java
public class BubbleSort {
    public static int[] sort(int[] arr) {
        if (arr == null) {
            throw new IllegalArgumentException("输入数组不能为空");
        }
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // 交换元素
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            // 提前退出
            if (!swapped) {
                break;
            }
        }
        return arr;
    }
}
```

## 🌍 应用场景

- 小规模数据排序（如学生课堂测验成绩排序）
- 教学演示排序算法原理
- 对稳定性要求较高的简单排序场景（冒泡排序是稳定排序）
