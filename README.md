# 🚀 Web-Work 综合学习平台 - 全栈展示

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5.16-4FC08D?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite)
![UnoCSS](https://img.shields.io/badge/UnoCSS-66.2.0-333333?style=for-the-badge&logo=unocss)
![Go](https://img.shields.io/badge/Go-1.20+-00ADD8?style=for-the-badge&logo=go)
![Gin](https://img.shields.io/badge/Gin-GORM-blue?style=for-the-badge)
![Result](https://img.shields.io/badge/Response-薛定谔的数据结构-yellow?style=for-the-badge)

**现代化全栈学习平台 - 集成文章展示、算法可视化、在线判题的综合学习环境**  
**前端：Vue3 + TypeScript + Vite · 后端：Gin + GORM + 分层强迫症 · 持续迭代中**

</div>

[🎯 平台功能](#-平台功能) • [🚀 快速开始](#-快速开始) • [📖 技术架构](#-技术架构) • [🗺️ 发展规划](#-发展规划) • [📚 文档](#-文档)

---

## 🎯 平台功能

### 📚 学习模块

- **📖 技术文章** - Markdown渲染、代码高亮、数学公式、图表支持
- **💻 在线编程(OJ)** - 多语言支持、实时编译、测试用例验证
- **🔍 算法可视化** - 动态演示排序、搜索、动态规划算法
- **🎵 音乐播放器** - 学习间隙的放松功能（开发者的小心思 😊）

### 🛠️ 管理功能

- **📝 内容管理** - 文章发布、编辑、分类管理
- **🏷️ 标签系统** - 层级标签、批量操作、使用统计
- **📊 数据统计** - 实时统计面板、可视化图表
- **⚙️ 系统配置** - 主题切换、个性化设置

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

## 🗺️ 发展规划

### 🎯 当前阶段 (v1.0 - 前端核心)

- ✅ **文章展示系统** - Markdown渲染、代码高亮、数学公式支持
- ✅ **OJ练习平台** - 多语言代码编辑、在线运行、测试验证
- ✅ **算法可视化** - 排序、搜索、动态规划算法动态演示
- ✅ **管理后台** - 内容管理、数据统计、系统配置
- ✅ **响应式设计** - 移动端适配、主题切换

### 🚧 开发中 (v1.5 - 后端整合)

- 🔄 **Gin+GORM后端** - RESTful API设计与实现
- 🔄 **数据库设计** - MySQL/PostgreSQL数据存储方案
- 🔄 **用户认证** - JWT令牌、权限管理系统
- 🔄 **接口联调** - 前后端数据交互与状态同步

### 📅 计划中 (v2.0 - 功能扩展)

- 🎯 **SQL可视化练习** - 交互式SQL学习环境
- 🎨 **CSS样式练习** - 前端样式技能训练模块
- 👥 **用户系统完善** - 个人中心、学习进度跟踪
- 🏆 **学习激励机制** - 积分系统、成就徽章

### 🔮 未来展望 (v3.0+ - 智能化)

- 🤖 **AI助手集成** - 智能代码建议、错误诊断、学习推荐
- 🌐 **多语言支持** - 国际化适配、多地区部署
- 📱 **移动应用** - 跨平台学习体验、离线模式
- 🎮 **游戏化学习** - 编程挑战、技能树系统、排行榜

---

## 🚀 快速开始

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

## 📖 技术架构

### 🏗️ 前端核心技术栈

- **[Vue 3.5.16](https://vuejs.org/)** - 组合式API、响应式系统
- **[TypeScript 5.8.3](https://www.typescriptlang.org/)** - 类型安全、智能提示
- **[Vite 6.3.5](https://vitejs.dev/)** - 现代构建工具、热模块替换

### 🎨 样式与UI框架

- **[UnoCSS 66.2.0](https://unocss.dev/)** - 原子化CSS引擎、按需生成
- **[Headless UI](https://headlessui.com/)** - 无障碍组件库
- **[Heroicons](https://heroicons.com/)** - 精美SVG图标集

### 📝 内容与编辑器

- **[Markdown-it 14.1.0](https://github.com/markdown-it/markdown-it)** - Markdown解析引擎
- **[CodeMirror 6](https://codemirror.net/)** - 代码编辑器、语法高亮
- **[Mermaid 11.6.0](https://mermaid.js.org/)** - 图表与流程图渲染
- **[KaTeX](https://katex.org/)** - 数学公式渲染器

### ⚡ 交互与动画

- **[Motion-v 1.2.1](https://motion-v.netlify.app/)** - Vue动画库
- **[VueUse](https://vueuse.org/)** - Vue组合式工具函数
- **[Pinia 3.0.3](https://pinia.vuejs.org/)** - 状态管理、响应式存储

### 🔧 后端技术栈 (开发中)

- **[Gin](https://gin-gonic.com/)** - Go语言高性能Web框架
- **[GORM](https://gorm.io/)** - Go ORM库、数据库操作
- **[MySQL/PostgreSQL](https://www.mysql.com/)** - 关系型数据库
- **[Redis](https://redis.io/)** - 缓存数据库、会话存储
- **[JWT](https://jwt.io/)** - 用户认证、权限管理

### 🧪 开发与测试工具

- **[Playwright](https://playwright.dev/)** - E2E自动化测试
- **[ESLint 9.28.0](https://eslint.org/)** - 代码质量检查
- **[Prettier 3.5.3](https://prettier.io/)** - 代码格式化工具

---

## 🎭 项目哲学 (开发者的自白)

> "如果你永远不知道接口会返回什么，那它就是防爬虫的最佳设计"  
> —— 某不愿透露姓名的后端架构师

### 📌 后端"特色"设计（自黑环节）

#### 🎯 "精妙绝伦"的Result设计

```go
type Result struct {
    Status  bool   `json:"status"`  // 与HTTP状态码完美冲突
    Message string `json:"msg"`     // 自由创作的诗意空间
    Data    any    `json:"data"`    // 类型安全的终结者
}
```

**经典使用场景**：

- HTTP 200返回`{"status": false, "msg": "系统错误"}`（精分现场）
- 前端需要写三套错误处理逻辑（HTTP状态码、Status、Message）
- `Data`字段可能是字符串/对象/数组/null（开盲盒体验）

#### 🏗️ 分层架构的极致艺术

```text
一次请求的奇幻旅程：
HTTP → 路由 → 中间件 → 控制器 → DTO → 服务层 → 仓库层 → 数据库

                                    ↓
ORM → 实体 → 仓库层 → 服务层 → DTO → 控制器 → HTTP
```

**实际业务逻辑占比**：<5%（其余都是类型转换和错误处理）

#### 🎲 接口规范的自由发挥

- GET请求修改数据？没问题！
- 404错误返回200状态码？安排！

- 同一个接口返回不同结构？惊喜功能！

### 💡 "最佳"实践示范

#### 如何返回一个用户数据

```go
func GetUser() dto.Result {
    user, err := repo.GetUser()
    if err != nil {
        return dto.Result{
            Status:  false, 
            Message: "用户找不到了捏~",
            Data:    gin.H{"error": err.Error()},
        } // HTTP状态码：200 👍
    }
    return dto.Result{
        Status:  true,
        Message: "success",

        Data:    user,
    }
}
```

#### 前端处理示例

```javascript
try {
  const res = await api.getUser();
  if (res.status === false) {
    toast.error(res.msg || '未知错误'); 
  } else {
    const user = res.data; // 可能是对象/undefined/字符串
  }
} catch (err) {

  // 永远不会执行到这里，因为所有错误都是200 🙂
}
```

### 🛠️ 改进方案（如果你实在受不了）

#### 方案A：打补丁式改进

```go
type Result[T any] struct {

    HTTPCode int    `json:"-"`         // 实际HTTP状态码
    Success  bool   `json:"success"`   // 兼容旧版前端
    Code     string `json:"code"`      // 标准化错误码
    Data     T      `json:"data"`      // 泛型拯救世界
}
```

#### 方案B：推倒重来

```go
// 直接使用HTTP标准语义
ctx.JSON(200, gin.H{"data": realData}) // 成功
ctx.JSON(400, gin.H{"error": "invalid_parameter"}) // 失败

// 或者学Rust

type Result[T any] struct {
    Ok  *T
    Err *Error
}
```

### 🎁 特别福利

所有贡献者将获得：

- 免费的心理咨询券（处理类型断言导致的焦虑）
- 防御性编程大师课程
- 如何向同事解释"这真的是一个特性不是bug"的培训

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

### 📁 前端架构

```text
📁 src/
├── 📁 views/              # 页面组件
│   ├── 📄 ArticleView.vue      # 文章详情页
│   ├── 📄 ArticleListView.vue  # 文章列表页  
│   ├── 📄 OJView.vue           # 在线编程页
│   ├── 📄 OJListView.vue       # 编程题目列表
│   ├── 📄 VisualizerView.vue   # 算法可视化主页
│   ├── 📄 AdminView.vue        # 管理后台
│   └── 📁 visualizer/          # 可视化子页面
│       ├── 📄 SortView.vue     # 排序算法可视化
│       ├── 📄 SearchView.vue   # 搜索算法可视化
│       └── 📄 DPView.vue       # 动态规划可视化
├── 📁 components/         # 组件库
│   ├── 📁 article/        # 文章系统组件
│   ├── 📁 oj/            # OJ系统组件
│   ├── 📁 admin/         # 管理功能组件
│   ├── 📁 sort/          # 排序算法组件
│   ├── 📁 search/        # 搜索算法组件
│   ├── 📁 dp/            # 动态规划组件
│   ├── 📁 music/         # 音乐播放器组件
│   └── 📁 common/        # 通用基础组件
├── 📁 composables/       # 组合式函数
│   ├── 📄 useMarked.ts        # Markdown处理
│   ├── 📄 useAudioPlayer.ts   # 音频播放控制
│   ├── 📄 useSort.ts          # 排序算法逻辑
│   ├── 📄 useSearch.ts        # 搜索算法逻辑
│   ├── 📄 useDP.ts            # 动态规划逻辑
│   └── � useAdminCrud.ts     # 管理CRUD操作
├── �📁 stores/            # 状态管理
│   ├── � themeStore.ts       # 主题状态
│   ├── 📄 playerStore.ts      # 音乐播放器状态
│   ├── � sortStore.ts        # 排序算法状态
│   └── 📄 searchStore.ts      # 搜索算法状态
├── �📁 types/             # TypeScript类型定义
├── 📁 utils/             # 工具函数库
└── 📁 router/            # 路由配置

📁 docs/                  # 项目文档
├── 📄 Vue依赖清理最终完成报告.md
├── 📄 无障碍性优化报告.md
└── 📄 项目最终总结报告.md

📁 scripts/              # 开发脚本
├── 📄 analyze-deps.js   # 依赖分析工具
└── 📄 deps-cleanup.js   # 依赖清理工具
```

### 🔧 后端架构规划

```text
📁 backend/ (开发中)     # Go后端服务
├── 📁 api/              # RESTful API路由
│   ├── 📄 article.go         # 文章管理API
│   ├── 📄 oj.go              # OJ系统API
│   ├── 📄 user.go            # 用户系统API
│   ├── 📄 admin.go           # 管理功能API
│   └── 📄 auth.go            # 认证授权API
├── 📁 models/           # 数据模型定义
│   ├── 📄 article.go         # 文章模型
│   ├── 📄 problem.go         # 题目模型
│   ├── 📄 user.go            # 用户模型
│   └── 📄 submission.go      # 提交记录模型
├── 📁 services/         # 业务逻辑层
├── 📁 middleware/       # 中间件
├── 📁 config/           # 配置管理
├── 📁 database/         # 数据库迁移
└── 📁 docs/             # API文档
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

1. **Fork项目** - 创建自己的项目副本
2. **创建分支** - 基于特性创建开发分支  
3. **编写代码** - 遵循代码规范和类型检查
4. **测试验证** - 运行测试确保功能正确（如果测试存在的话）
5. **提交PR** - 详细描述变更内容和目的

### 🎯 代码规范

#### 前端规范

- **TypeScript优先** - 100%类型覆盖，完整智能提示
- **组合式API** - 使用 `<script setup>` 语法
- **代码风格** - 遵循 ESLint + Prettier 配置
- **提交规范** - 遵循 Conventional Commits 标准

#### 后端规范（自求多福版）

- **分层架构** - 严格按照Controller→Service→Repository层级
- **Result统一** - 所有接口必须返回薛定谔的Result结构
- **错误处理** - HTTP 200 + `status: false` 是我们的传统艺能
- **命名风格** - 函数名要么极其简洁要么超级冗长，没有中间状态

### 🧩 参与方式

- **🐛 Bug反馈** - 提交详细的问题报告（包含复现步骤和心理阴影面积）
- **💡 功能建议** - 提出新功能想法和改进建议
- **📝 文档完善** - 改进文档内容和示例（特别是后端API文档）
- **🔧 代码贡献** - 修复Bug、添加功能、性能优化
- **🎭 吐槽大会** - 欢迎对Result设计和分层架构进行文明友善的建设性批评

### 🚨 特别注意

- 提交前请确保前端TypeScript编译通过
- 后端代码请保持"传统"的Result返回格式（为了兼容性，忍一忍）
- 如果你对分层架构有异议，请先深呼吸三次
- 音乐播放器相关的Bug可能需要额外的心理建设

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议，欢迎自由使用和修改。

---

## 🙏 致谢

- **Vue.js 团队** - 提供优秀的前端框架和完善的生态系统
- **Go 社区** - Gin、GORM等后端技术支持（以及分层架构的"灵感"）
- **开源社区** - 各种优秀的开源组件和工具
- **前端贡献者们** - 所有参与Vue项目开发和测试的伙伴
- **后端架构师** - 感谢他们创造性的Result设计和分层艺术
- **测试人员** - 那些勇敢尝试音乐播放器和薛定谔响应的勇士们 🎖️
- **用户们** - 感谢你们的耐心和对各种"特性"的包容

### 🎭 特别感谢

> 感谢所有在代码审查中保持冷静、在分层架构中迷失但依然坚持、在Result结构中找到人生真谛的开发者们。  
> 你们的坚韧不拔精神是这个项目最宝贵的财富。

---

⭐ **如果这个学习平台对你有帮助，请给个 Star 支持一下！** ⭐

Made with ❤️ and lots of ☕ by Vue Community

🚀 **现代化学习平台 · 持续更新中** 🚀

---

## 📜 开源协议

本项目采用 [MIT License](LICENSE) 开源协议（又名 "随你怎么改反正不是我的锅" 协议）

s*使用本项目即表示您理解并接受Result结构的"独特性"和分层架构的"深度"*

---

## 📝 项目说明

### 🎯 仓库架构

本项目为 **Web-Work 综合学习平台** 的全栈展示，包含完整的前后端实现。

### 🏗️ 技术架构

- **前端 (Vue3)**: 用户界面展示和交互逻辑
  - Vue3 + TypeScript + Vite 现代化技术栈
  - UnoCSS 原子化样式 + 响应式设计
  - 文章展示、OJ练习、算法可视化
  
- **后端 (Gin)**: RESTful API和数据服务  
  - Gin + GORM + 极致分层架构
  - MySQL/PostgreSQL + Redis 数据存储
  - 在线判题系统 + 用户认证

  - 特色Result结构（薛定谔的响应体）

### 🔗 相关仓库

- 🎨 **前端展示**: 本仓库 `/src` 目录
- 🛠️ **后端服务**: 本仓库 `/backend` 目录（Web-Work-Gin）
- 📱 **移动端 (规划中)**: 跨平台移动应用
- 📖 **API文档**: 基于OpenAPI规范（如果运气好的话）

### 💡 快速启动指南

#### 前端启动

```bash
# 安装前端依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

