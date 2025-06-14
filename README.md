# Vue 现代化管理系统 🚀

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5.16-4FC08D?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite)
![UnoCSS](https://img.shields.io/badge/UnoCSS-66.2.0-333333?style=for-the-badge&logo=unocss)

**高性能、现代化、响应式的Vue.js管理系统**  
**采用最新技术栈 · 精简依赖架构 · 极致开发体验**

[🎯 核心特性](#-核心特性) • [🚀 快速开始](#-快速开始) • [📖 技术栈](#-技术栈) • [📈 性能优化](#-性能优化) • [📚 文档](#-文档)

</div>

---

## 🎯 核心特性

### 📊 管理功能

- **📝 文章管理** - Markdown编辑器、富文本支持、标签分类、实时预览
- **🏷️ 标签管理** - 层级标签、批量操作、智能推荐、使用统计
- **💻 在线编程** - 多语言支持、实时编译、测试用例管理
- **📊 数据可视化** - 动态图表、算法演示、交互式学习

### 🎨 用户体验

- **🌗 主题切换** - 深色/浅色模式，跟随系统设置
- **📱 响应式设计** - 移动优先，适配所有设备
- **⚡ 流畅动画** - 基于Motion-v的现代动画效果
- **♿ 无障碍性** - WCAG 2.1 AA标准，完整键盘导航

### 🛠️ 开发体验

- **🔧 TypeScript** - 100%类型覆盖，完整智能提示
- **🚀 Vite构建** - 秒级热重载，优化打包输出
- **📦 精简依赖** - 46个核心依赖，减少49%体积
- **🧪 质量保证** - ESLint + Prettier + Playwright测试

---

## � 快速开始

### 📋 环境要求

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### 🔧 安装运行

```bash
# 克隆项目
git clone https://github.com/HYH0309/web-work.git
cd web-work

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本  
npm run build

# 预览构建结果
npm run preview
```

### 🧪 开发命令

```bash
# 类型检查
npm run type-check

# 代码检查和格式化
npm run lint
npm run format

# E2E测试
npm run test:e2e

# 依赖分析
node scripts/analyze-deps.js
```

---

## 📖 技术栈

### 🏗️ 核心框架

- **[Vue 3.5.16](https://vuejs.org/)** - 组合式API、响应式系统
- **[TypeScript 5.8.3](https://www.typescriptlang.org/)** - 类型安全、智能提示
- **[Vite 6.3.5](https://vitejs.dev/)** - 现代构建工具、HMR

### 🎨 样式方案

- **[UnoCSS 66.2.0](https://unocss.dev/)** - 原子化CSS引擎
- **[Headless UI](https://headlessui.com/)** - 无障碍组件库
- **[Heroicons](https://heroicons.com/)** - 精美SVG图标

### 📝 内容处理

- **[Markdown-it 14.1.0](https://github.com/markdown-it/markdown-it)** - Markdown解析器
- **[CodeMirror 6](https://codemirror.net/)** - 代码编辑器
- **[Mermaid 11.6.0](https://mermaid.js.org/)** - 图表渲染

### ⚡ 增强功能

- **[Motion-v 1.2.1](https://motion-v.netlify.app/)** - 动画库
- **[VueUse](https://vueuse.org/)** - Vue组合式函数
- **[Pinia 3.0.3](https://pinia.vuejs.org/)** - 状态管理

### 🧪 开发工具

- **[Playwright](https://playwright.dev/)** - E2E测试
- **[ESLint 9.28.0](https://eslint.org/)** - 代码检查
- **[Prettier 3.5.3](https://prettier.io/)** - 代码格式化

---

## 📈 性能优化

### 🎯 依赖优化成果

```bash
📦 包数量优化: 91 → 46 个 (-49%)
📊 依赖体积减少: ~48.8%
⚡ 构建时间: 19.89s
✅ 零未使用依赖
```

### 🗑️ 已清理的依赖

- ❌ 过时类型包: `@types/highlight.js`, `@types/dompurify`等
- ❌ 未使用UI库: `@iconify/vue`, `lucide-vue-next`, `gsap`
- ❌ 粒子系统: `@tsparticles/*`, `tsparticles-engine`
- ❌ Monaco编辑器: `monaco-editor`, `vite-plugin-monaco-editor`
- ❌ 冗余工具: `anchor`, `prismjs`等

### 📊 构建输出分析

```bash
dist/assets/index-xPT-Vvl_.js     283.04 kB │ gzip: 101.79 kB
dist/assets/katex-ChWnQ-fc.js     265.45 kB │ gzip:  77.50 kB
dist/assets/mermaid-aWJvBafc.js   130.38 kB │ gzip:  43.73 kB
dist/assets/admin-XoZ4JiOz.js     104.71 kB │ gzip:  29.69 kB
```

### 🚀 性能特性

- **代码分割** - 按需加载，减少初始包体积
- **懒加载** - 路由级别的组件懒加载
- **资源优化** - 图片压缩、字体子集化
- **缓存策略** - 长期缓存，版本控制

---

## 🏗️ 项目结构

```txt
📁 src/
├── 📁 components/          # 组件库
│   ├── � admin/          # 管理功能组件  
│   ├── 📁 article/        # 文章相关组件
│   ├── 📁 common/         # 通用组件
│   ├── 📁 composable/     # 可复用基础组件
│   └── 📁 [feature]/      # 其他功能组件
├── 📁 composables/        # 组合式函数
├── 📁 stores/             # 状态管理
├── 📁 views/              # 页面组件
├── 📁 types/              # TypeScript类型
├── 📁 utils/              # 工具函数
└── 📁 router/             # 路由配置

📁 docs/                   # 项目文档
├── 📄 Vue依赖清理最终完成报告.md
├── 📄 依赖优化完成报告.md
├── 📄 无障碍性优化报告.md
└── 📄 项目最终总结报告.md

📁 scripts/               # 自动化脚本
├── 📄 analyze-deps.js    # 依赖分析工具
└── 📄 deps-cleanup.js    # 依赖清理工具
```

---

## ⌨️ 快捷键支持

| 快捷键 | 功能描述 |
|--------|----------|
| `Ctrl + /` | 显示/隐藏帮助面板 |
| `Ctrl + 1-3` | 切换管理模块 |
| `Ctrl + E` | 导出数据 |
| `Ctrl + R` | 刷新数据 |
| `Ctrl + M` | 切换监控模式 |
| `Tab/Shift+Tab` | 键盘导航 |
| `Enter/Space` | 激活选中项 |

---

## 🔧 开发工具

### 📊 依赖分析

```bash
# 分析项目依赖使用情况
node scripts/analyze-deps.js

# 检测未使用依赖
npx depcheck

# 清理过时类型包
node scripts/deps-cleanup.js
```

### 🧪 代码质量

```bash
# 代码检查
npm run lint

# 格式化代码
npm run format

# 类型检查
npm run type-check
```

### 🎯 性能监控

```bash
# 构建分析
npm run build

# 包大小分析
npx vite-bundle-analyzer
```

---

## 🌐 浏览器兼容性

| 浏览器 | 最低版本 | 状态 |
|--------|----------|------|
| Chrome | >= 90 | ✅ 完全支持 |
| Firefox | >= 88 | ✅ 完全支持 |
| Safari | >= 14 | ✅ 完全支持 |
| Edge | >= 90 | ✅ 完全支持 |

---

## � 文档

### 📖 核心文档

- **[依赖优化报告](./docs/Vue依赖清理最终完成报告.md)** - 详细的依赖清理过程和成果
- **[无障碍性优化](./docs/无障碍性优化报告.md)** - WCAG 2.1 AA合规性实现
- **[项目总结报告](./docs/项目最终总结报告.md)** - 完整的技术架构和实现细节

### 🛠️ 开发指南

- **组件开发** - 遵循组合式API和TypeScript最佳实践
- **状态管理** - 使用Pinia进行响应式状态管理
- **样式规范** - UnoCSS原子化类名规范
- **测试策略** - E2E测试覆盖关键用户流程

---

## � 音乐播放器

> **开发者的小声嘀咕**: 这个播放器可能不是最完美的，但它是用❤️制作的（以及大量的咖啡因）

### 🎛️ 特性

- **单曲循环** - 因为有时候一首好歌值得重复听
- **音量控制** - 从图书馆到音乐节的完整体验
- **进度控制** - 圆形拖动，因为我们喜欢不走寻常路
- **动画效果** - 让你的CPU也能感受到音乐的节拍

### 🔧 技术实现

- **HTML5 Audio API** - 现代浏览器的原生支持
- **Vue组合式函数** - 响应式音频控制
- **CSS动画** - 流畅的视觉反馈
- **TypeScript** - 类型安全的音频处理

#### 注: 如遇到播放问题，请检查音频文件路径或联系开发者（准备好降压药）

---

## 🤝 贡献指南

### 📋 开发流程

1. Fork项目并创建特性分支
2. 遵循代码规范和类型检查
3. 编写测试用例确保功能正确
4. 提交PR并通过CI检查

### 🎯 代码规范

- 使用TypeScript进行类型安全开发
- 遵循ESLint和Prettier配置
- 组件采用组合式API和`<script setup>`语法
- 提交信息遵循Conventional Commits规范

---

## � 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

- Vue.js团队提供的优秀框架
- 社区贡献的开源组件和工具
- 所有参与项目开发和测试的贡献者
- 还有那些耐心测试音乐播放器的勇士们 🎖️

---

<div align="center">

### ⭐ 如果这个项目对你有帮助，请给个Star！ ⭐

Made with ❤️ and lots of ☕ by Vue Community

