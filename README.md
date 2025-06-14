# Vue 现代化管理系统 🚀

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5.16-4FC08D?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite)
![UnoCSS](https://img.shields.io/badge/UnoCSS-66.2.0-333333?style=for-the-badge&logo=unocss)

**高性能、现代化、响应式的Vue.js管理系统**  
**采用最新技术栈 · 精简依赖架构 · 极致开发体验**

[toc]

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

## 🎵 音乐播放器：技术债交响曲

### 🎛️ 控制面板：功能缺失大赏

1. **单曲循环之王**  
   - 代码里硬编码了`/music/song1.mp3`，堪称"一辈子只听一首歌"的极致用户体验
   - 想换歌？请直接修改源码并重新部署 - 这很DevOps！

2. **内存泄漏协奏曲**  
   - 虽然写了`onUnmounted`清理定时器...  
   - 但`timeupdate`事件监听器？让它永远在内存中歌唱吧！🎤

3. **错误处理？不存在的**  
   - 网络断了？文件404？解码失败？  
   - 我们的应对策略：沉默是金 🤫

### 🔊 音量控制：用户体验的灾难现场

- 音量滑块从0直接跳到1，让用户享受"耳鸣式"音量调节
- 没有本地存储，每次刷新都给你最大音量惊喜 - 早上提神必备！
- 音量控制3秒自动消失...除非你手速够快！

### ⏳ 进度控制：玄学操作指南

- 圆形拖动很酷，但实际使用像是在解魔方
- 拖动时CPU使用率比挖矿还高
- 进度跳转精准度：±15秒（我们称之为"DJ风格"）

### 🧠 性能"优化"亮点

1. **内存占用**  
   - 播个MP3而已，内存占用轻松突破200MB  
   - 比Chrome开10个标签页还猛

2. **CPU使用率**  
   - 旋转动画+进度计算 = 笔记本风扇交响乐
   - 冬天可替代暖气使用

3. **电池杀手模式**  
   - 锁屏后继续播放？想得美！  
   - 但我们保证电量消耗速度让你来不及锁屏

### 💾 数据管理黑科技

- 播放进度存储：内存中（刷新即重置）
- 播放历史：全靠用户记忆
- 播放列表：`const playlist = ['song1.mp3']` 👑

### 🚑 抢救建议（黑色幽默版）

1. **代码安乐死方案**

   ```bash
   # 终极解决方案
   rm -rf src/components/MusicPlayer*
   ```

2. **用户关怀计划**
   - 赠送降噪耳机（应对音量突变）
   - 附赠充电宝（应对电量消耗）
   - 提供DJ培训（应对进度控制）

3. **技术债务继承计划**

   ```markdown
   ## 新开发者入职礼包
   - 祖传播放器代码 1 份
   - 未解之谜清单："为什么音量控制会消失？"
   - 前任开发者的留言："祝你好运！"
   ```

> 这个音乐播放器堪称 **前端界的死亡金属** - 又吵又耗资源，但莫名让人上头！🤘

[![受害者计数器](https://img.shields.io/badge/已崩溃用户-2048人-red)](https://github.com/your-username/vue-music-disaster)  
**警告：长时间使用可能导致电脑爆炸！**

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
git clone <your-repo-url>
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

[Rest of original README content...]
