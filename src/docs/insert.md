
# 插入排序

## 🌟 核心特征

- **插入排序**是一种简单直观的比较排序算法，通过构建有序序列，对于未排序部分的元素，从后往前扫描有序部分，找到相应位置后插入。其核心创新点在于：**每次迭代将一个待排序元素插入到已排序序列的合适位置，逐步扩展有序区域**。
- 典型应用场景为小规模数据排序或基本有序的数据排序。
- 数学复杂度标识：
  $$ \mathcal{O}(n^2) $$

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
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

```
3. **终止条件**：完成所有元素的插入操作后排序结束。

## 📊 性能对比
| 指标类型   | 最优情况 | 典型情况 | 最差情况 |
|------------|----------|----------|----------|
| 时间效率   | O(n)     | O(n²)    | O(n²)    |
| 内存消耗   | O(1)     | O(1)     | O(1)     |

## 💻 代码实现
### Python 示例
```python
def insertion_sort(arr: list[int]) -> list[int]:
    """插入排序算法实现"""
    if not arr:
        raise ValueError("输入数组不能为空")
    n = len(arr)
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        # 将大于 key 的元素依次右移
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        # 插入到正确位置
        arr[j + 1] = key
    return arr
```

### Java 示例

```java
public class InsertionSort {
    public static int[] sort(int[] arr) {
        if (arr == null) {
            throw new IllegalArgumentException("输入数组不能为空");
        }
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            // 将大于 key 的元素依次右移
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            // 插入到正确位置
            arr[j + 1] = key;
        }
        return arr;
    }
}
```

## 🌍 应用场景

- 小规模数据排序（如实时数据流中的小批量排序）
- 基本有序数据的排序优化场景
- 作为复杂排序算法的子过程（如希尔排序）
