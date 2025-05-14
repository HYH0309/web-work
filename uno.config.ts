import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [presetWind3(), presetAttributify(), presetTypography()],

  transformers: [transformerVariantGroup(), transformerDirectives()],

  shortcuts: {
    // 布局
    'flex-center': 'flex items-center justify-center',
    'grid-center': 'grid place-items-center',
    'absolute-center': 'absolute inset-0 m-auto',

    // ======== 基础架构 ========
    btn: [
      // 基础样式
      'relative', // 为伪元素定位做准备
      'font-medium whitespace-nowrap', // 防止文字换行
      'rounded-lg border', // 添加默认边框

      // 过渡效果
      'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]', // 更平滑的缓动函数

      // 交互状态
      'focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2', // 添加光环效果
      'hover:brightness-[98%]', // 微调亮度提升感知
      'active:scale-[0.98]', // 更自然的按压效果
      'disabled:opacity-50 disabled:cursor-not-allowed',

      // 高级效果
      'overflow-hidden', // 为伪元素动画准备
      'isolate', // 创建新的堆叠上下文
      'after:absolute after:inset-0 after:bg-white/10', // 点击涟漪效果基础
      'after:opacity-0 hover:after:opacity-100', // 悬停微光
      'active:after:scale-150 active:after:opacity-0 active:after:transition active:after:duration-500', // 点击扩散动画
    ].join(' '),
    // ======== 填充类型 ========
    'btn-primary': [
      'btn',
      'bg-primary text-white shadow-md',
      'hover:bg-primary-hover hover:shadow-lg',
      'active:bg-primary-active active:shadow-inner ',
    ].join(' '),

    // ======== 线框类型 ========
    'btn-ghost': [
      'btn',
      'border border-border/80 bg-transparent',
      'hover:bg-muted-hover/40 hover:border-hover',
      'active:bg-muted-active/60',
      'dark:border-dark-400 dark:hover:bg-dark-700/30',
    ].join(' '),

    // ======== 特殊类型 ========
    'btn-float': [
      'btn',
      'shadow-lg hover:shadow-xl',
      'transform-gpu',
      'hover:-translate-y-0.5',
    ].join(' '),

    'btn-gradient': [
      'btn',
      'bg-gradient-to-br from-primary to-primary-600',
      'hover:from-primary-hover hover:to-primary-700',
      'active:shadow-inner',
    ].join(' '),

    // ======== 状态扩展 ========
    'btn-loading':
      'btn relative text-transparent after:absolute after:inset-0 after:m-auto after:h-5 after:w-5 after:animate-spin after:rounded-full after:border-2 after:border-current after:border-t-transparent',

    // ======== 尺寸系统 ========
    'btn-sm': 'px-3 py-1.5 text-sm',
    'btn-md': 'px-4 py-2 text-base',
    'btn-lg': 'px-6 py-3 text-lg',
    'btn-icon': 'p-2 aspect-square !rounded-full',
    // 标签按钮升级
    'tag-btn': [
      'btn', // 继承基础按钮特性
      'px-3 py-1.5 rounded-full text-sm',
      'flex items-center gap-1.5',
      'border bg-background/70', // 半透明背景
      'hover:bg-muted-hover/30 hover:scale-105', // 悬停放大

      'text-text',
      'dark:border-dark-500 dark:hover:bg-dark-700', // 暗色模式适配
    ].join(' '),

    // 激活状态强化
    'tag-active': [
      'border-success/80 text-success',
      'bg-success/10 hover:bg-success/20', // 悬停加深
      'dark:border-success/50 dark:bg-success/20', // 暗色适配
      'relative after:absolute after:-inset-[2px] after:rounded-full after:border after:border-success/20', // 外发光效果
    ].join(' '),
    // 新增快捷类
    // 基础卡片样式
    'card-base': [
      'p-6 rounded-lg border border-border/50', // 结构样式
      'bg-background shadow-md hover:shadow-lg', // 亮色模式交互
      'dark:shadow-md-dark dark:hover:shadow-lg-dark', // 暗色模式交互
      'transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]', // 高级缓动曲线
    ].join(' '),

    // 禁用状态
    'card-disabled': ['bg-muted cursor-not-allowed', 'text-muted-foreground shadow-inner'].join(
      ' ',
    ),

    // 过渡效果
    'transition-opacity': 'transition-opacity duration-300 ease-out',
    'transition-transform-opacity': 'transition-[opacity,transform] duration-300 ease-out',

    // 布局系统
    'flex-layout': [
      'flex gap-4',
      'data-[direction=horizontal]:md:flex-row',
      'data-[direction=vertical]:flex-col',
    ].join(' '),
    'theme-transition': 'transition-all duration-200 ease-in-out',
    'content-layout': 'p-4 flex flex-col gap-4',
    // 文章标题
    'article-title': 'text-2xl font-bold mb-4 text-text',

    // 文章网格布局
    'article-grid': 'grid grid-cols-[auto_1fr] gap-8 min-h-[calc(100vh-200px)]',

    // Markdown标题
    'markdown-heading': ['text-xl font-semibold mt-8 mb-4 pb-2', 'border-b border-border'].join(
      ' ',
    ),

    // Markdown代码块
    'markdown-code': [
      'rounded-lg shadow-background overflow-hidden my-4',
      'bg-card font-mono text-sm',
    ].join(' '),

    // 优化现有markdown-content
    'markdown-content': [
      'max-w-3xl mx-auto w-full px-4 prose',
      'prose-headings:text-text prose-p:text-text/90',
      'prose-code:bg-muted prose-code:px-1 prose-code:rounded',
    ].join(' '),
  },

  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    colors: {
      text: 'hsl(var(--text))',
      'text-muted': 'hsl(var(--text-muted))',
      'text-hover': 'hsl(var(--text-hover))',
      'text-active': 'hsl(var(--text-active))',
      primary: 'hsl(var(--primary))',
      'primary-hover': 'hsl(var(--primary-hover))',
      'primary-active': 'hsl(var(--primary-active))',
      'primary-disabled': 'hsl(var(--primary-disabled))',
      success: 'hsl(var(--success))',
      'success-hover': 'hsl(var(--success-hover))',
      'success-active': 'hsl(var(--success-active))',
      'success-disabled': 'hsl(var(--success-disabled))',
      warning: 'hsl(var(--warning))',
      'warning-hover': 'hsl(var(--warning-hover))',
      'warning-active': 'hsl(var(--warning-active))',
      'warning-disabled': 'hsl(var(--warning-disabled))',
      danger: 'hsl(var(--danger))',
      'danger-hover': 'hsl(var(--danger-hover))',
      'danger-active': 'hsl(var(--danger-active))',
      'danger-disabled': 'hsl(var(--danger-disabled))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      muted: 'hsl(var(--muted))',
      'muted-hover': 'hsl(var(--muted-hover))',
      'muted-foreground': 'hsl(var(--muted-foreground))',
      border: 'hsl(var(--border))',
      'border-hover': 'hsl(var(--border-hover))',
    },
    borderRadius: {
      DEFAULT: 'var(--radius)',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
    },
    boxShadow: {
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      'md-dark': 'var(--shadow-md-dark)',
      'lg-dark': 'var(--shadow-lg-dark)',
    },
  },
})
