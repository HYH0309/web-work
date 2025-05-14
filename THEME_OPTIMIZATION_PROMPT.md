
# Vue组件主题化优化Prompt

## UnoCSS主题变量规范

```typescript
// uno.config.ts 主题配置
theme: {
  colors: {
    // 主色系（使用色阶命名）
    primary: { 
      500: 'rgb(var(--un-color-primary-500))',
      600: 'rgb(var(--un-color-primary-600))'
    },
    
    // 状态色系
    success: 'rgb(var(--un-color-success)',
    warning: 'rgb(var(--un-color-warning)',
    danger: 'rgb(var(--un-color-danger)',

    // 主题模式变量
    light: {
      background: 'rgb(var(--un-bg-base))',
      text: 'rgb(var(--un-color-text-base))',
      card: 'rgb(var(--un-bg-card))'
    },
    dark: {
      background: 'rgb(var(--un-bg-dark))',
      text: 'rgb(var(--un-color-text-dark))',
      card: 'rgb(var(--un-bg-card-dark))'
    }
  }
}
```

### 变量映射规则

| 原变量类型       | 主题变量映射           |
|------------------|------------------------|
| 颜色值           | `--un-color-*`          |
| 背景色           | `--un-bg-*`             |
| 边框/阴影        | `--un-border-*`/`--un-shadow-*` |
| 文字颜色         | `--un-color-text-*`      |

---

## 优化指令

### 1. **变量替换规则**

```css
/* 优先使用主题变量 */
.bg-white → bg-card
.text-gray-700 → text-text
.dark:bg-gray-800 → bg-background-dark
```

### 2. **组件优化策略**

```vue
<!-- 优化前 -->
<div class="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">

<!-- 优化后 -->
<div class="bg-card text-text theme-transition">
```

### 3. **暗黑模式优化**

```ts
// 暗黑模式变量
.dark {
  --un-color-text-base: 243, 244, 246;
  --un-bg-base: 15, 23, 42;
  --un-border-base: 75, 85, 99;
}
```

---

## 优化原则

1. **变量优先**：所有颜色值必须使用主题变量
2. **模式解耦**：禁止在组件中硬编码`dark:`变体
3. **一致性**：保持组件原有布局结构
4. **过渡增强**：关键状态添加`theme-transition`类
5. **可访问性**：确保文字对比度不低于4.5:1

---

## 优化步骤

### 1. **背景颜色优化**

- 替换所有硬编码背景色为 `bg-card`/`bg-background`
- 对卡片类组件使用 `bg-card` 而非 `bg-white`

### 2. **文字颜色优化**

- 使用 `text-text` 替代具体灰度值
- 次要文字使用 `text-text/70`
- 禁用状态使用 `text-text-disabled`

### 3. **状态色优化**

- 主要操作：`bg-primary-500`
- 成功状态：`text-success` + `bg-success/10`
- 警告状态：`border-warning` + `text-warning`
- 错误状态：`hover:text-danger` + `ring-danger/50`

### 4. **交互增强**

```css
/* 添加主题过渡动画 */
.theme-transition {
  @apply transition-colors duration-300;
}
```

---

## 验证要求

1. **模式切换**：验证light/dark模式显示正常
2. **变量依赖**：确保所有颜色使用CSS变量
3. **状态完整性**：检查hover/focus状态是否保留
4. **无障碍测试**：使用axe-core进行对比度检测
5. **性能验证**：确保添加变量后无额外样式计算

---

## 示例替换

| 原始代码                          | 优化后代码                          |
|-----------------------------------|-------------------------------------|
| `bg-gray-100 dark:bg-gray-700`     | `bg-background`                     |
| `text-gray-600 dark:text-gray-400` | `text-text/70`                      |
| `border-gray-300`                 | `border-border`                     |
| `hover:bg-gray-200`               | `hover:bg-background-muted`         |

---

## 扩展建议

```ts
// 主题切换API扩展
const themeAPI = {
  setTheme: (theme: 'light'|'dark'|'system') => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  },
  getTheme: () => localStorage.getItem('theme') || 'system'
}
```

---

### 使用说明

将此prompt用于AI助手时，请附加以下上下文：

1. 组件原始代码片段
2. 当前主题变量定义
3. 项目使用的UnoCSS配置
4. 特定组件样式需求（如品牌色调整）

AI将基于这些信息提供：

- 精确的变量替换建议
- 暗黑模式优化方案
- 可访问性改进措施
- 主题化代码重构路径
