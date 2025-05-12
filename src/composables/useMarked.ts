import MarkdownIt from 'markdown-it'

// ========================
// 核心插件：直接影响 Markdown 解析流程
// ========================
import { tocPlugin } from '@mdit-vue/plugin-toc' // 自动生成目录
import anchor from 'markdown-it-anchor' // 标题锚点生成

// ========================
// 功能扩展插件：增强 Markdown 功能
// ========================
import mermaidItMarkdown from 'mermaid-it-markdown' // Mermaid 图表支持
import { full as emojiPlugin } from 'markdown-it-emoji' // Emoji 短码转换
import prism from 'markdown-it-prism' // 代码块语法高亮
import { plantuml } from '@mdit/plugin-plantuml' // PlantUML 支持
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'

// ========================
// 数学公式支持
// ========================
import { katex } from '@mdit/plugin-katex' // LaTeX 公式渲染

// ========================
// 配置常量（按功能模块分类）
// ========================
const MARKDOWN_IT_CONFIG = {
  /** 核心解析器配置 */
  core: {
    html: true, // 允许 HTML 标签
    linkify: true, // 自动转换 URL 为链接
    typographer: true, // 启用印刷字体替换（如引号转换）
    async: false,
    replacements: [
      // 特殊字符保护（针对数学公式场景）
      { from: '\\$', to: '$' }, // 保护美元符号不被转换
      { from: '\\\\', to: '\\' }, // 保护反斜杠不被转义
    ],
    quotes: '“”‘’', // 智能引号替换规则
    breaks: true, // 转换换行符为 <br>
  },

  /** 目录生成配置 */
  toc: {
    containerClass: 'toc',
    markerPattern: /\[\[toc\]\]/i, // 新增匹配模式
    // 增强回调函数处理
  },

  /** 标题锚点配置 */
  anchor: {
    permalink: true, // 显示永久链接图标
    permalinkBefore: true, // 图标显示在标题前
    permalinkSymbol: '📍', // 自定义链接图标
    // 标题 slug 生成规则（URL 友好格式）
    slugify: (s: string) =>
      String(s)
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // 移除非法字符
        .replace(/[\s_-]+/g, '-'), // 空格/下划线转连字符
  },

  /** KaTeX 数学公式配置 */
  katex: {
    throwOnError: false, // 不抛出解析错误
    mathFence: true, // 默认围栏语法
  },

  /** 语法高亮配置 */
  prism: {
    highlightInlineCode: true, // 高亮行内代码
    init: () => {
      Prism.plugins.autoloader.enable = false
    },
  },
}

/**
 * 创建并配置 MarkdownIt 解析器实例
 * @returns 完全配置的 MarkdownIt 实例
 */
const createMarkdownParser = () => {
  // 初始化核心解析器
  const md = new MarkdownIt(MARKDOWN_IT_CONFIG.core)

  // ========================
  // 插件分类初始化（按加载顺序）
  // ========================
  const pluginModules = [
    // 可视化组件类（优先处理特殊代码块）
    { name: 'mermaid', plugin: mermaidItMarkdown },
    { name: 'plantuml', plugin: plantuml },

    // 核心结构类插件
    { name: 'anchor', plugin: anchor, config: MARKDOWN_IT_CONFIG.anchor },
    { name: 'toc', plugin: tocPlugin, config: MARKDOWN_IT_CONFIG.toc },

    // 代码高亮类（后处理常规代码块）
    { name: 'prism', plugin: prism },

    // 其他文本处理插件
    { name: 'emoji', plugin: emojiPlugin },

    // 数学公式类（最后加载）
    { name: 'katex', plugin: katex, config: MARKDOWN_IT_CONFIG.katex },
  ]

  // ========================
  // 安全加载插件（带错误处理）
  // ========================
  pluginModules.forEach(({ name, plugin, config }) => {
    try {
      if (config) {
        md.use(plugin, config)
      } else {
        md.use(plugin)
      }
      console.log(`✅ ${name} 插件加载成功`)
    } catch (error) {
      console.error(`[Markdown 初始化错误] ${name} 插件加载失败:`, error)
      throw new Error(`核心插件加载失败，请检查 ${name} 插件配置`)
    }
  })

  return md
}

// ========================
// 导出预配置实例
// ========================
export const md = createMarkdownParser()
