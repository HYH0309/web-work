import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
// 基础按钮原子化拆分
const btnBase = [
  // 基础样式保持不变
  'relative font-medium whitespace-nowrap',
  'rounded-lg border',
  'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
  'focus-visible:(outline-none ring-2 ring-primary/50 ring-offset-2)',
  'hover:brightness-[98%] active:scale-[0.98]',
  'disabled:(opacity-50 cursor-not-allowed grayscale)',
  'overflow-hidden isolate',

  // 新增交互反馈
  'hover:transform-gpu hover:translate-y-[-1px]', // 悬停微抬升
  'active:translate-y-[1px]', // 按下下沉感
  'motion-safe:hover:shadow-md', // 悬停投影
]

const btnAfter = [
  // 优化伪元素动画
  'after:(absolute inset-0 bg-white/10 opacity-0 transition-all duration-300)',
  'hover:after:opacity-100 hover:after:scale-105', // 悬停波纹扩散
  'active:after:scale-150 active:after:opacity-0', // 点击涟漪效果
  'active:after:transition-[transform,opacity] active:after:duration-500', // 分离过渡属性

  // 新增状态指示器
  'before:(absolute left-0 top-0 h-0.5 w-full bg-current opacity-0 transition-opacity)',
  'disabled:before:opacity-30', // 禁用状态顶部线条
  'focus:before:opacity-50', // 焦点状态指示
]

const cardBase = [
  'p-6 rounded-lg border border-border/50',
  'bg-background shadow-md hover:shadow-lg',
  'transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]',
  'dark:border-dark-500 dark:hover:bg-dark-700', // 暗色模式适配
]
// 合并重复的布局类
const layoutBase = ['transition-all duration-200 ease-in-out']
const proseBase = [
  'prose-headings:text-text',
  'prose-p:text-text/90',
  'prose-code:(bg-muted px-1 rounded)',
]

//导出的设置
export default defineConfig({
  presets: [presetWind3(), presetAttributify(), presetTypography()],

  transformers: [transformerVariantGroup(), transformerDirectives()],

  shortcuts: {
    // 布局
    'flex-center': 'flex items-center justify-center',
    'grid-center': 'grid place-items-center',
    'absolute-center': 'absolute inset-0 m-auto',

    // ======== 基础架构 ========
    btn: [...btnBase, ...btnAfter].join(' '),
    // ======== 填充类型 ========
    // 变体按钮
    'btn-primary': [
      ...btnBase,
      'bg-primary text-white shadow-md',
      'hover:(bg-primary-hover shadow-lg)',
      'active:(bg-primary-active shadow-inner)',
    ].join(' '),

    'btn-ghost': [
      ...btnBase,
      'border-border/80 bg-transparent',
      'hover:(bg-muted-hover/40 border-hover)',
      'active:bg-muted/60',
      ...btnAfter.map((s) => s.replace('bg-white/10', 'bg-foreground/10')), // 动态修改伪元素颜色
    ].join(' '),

    // ======== 尺寸系统 ========
    'btn-sm': 'px-3 py-1.5 text-sm',
    'btn-md': 'px-4 py-2 text-base',
    'btn-lg': 'px-6 py-3 text-lg',
    'btn-icon': 'p-2 aspect-square !rounded-full',
    //
    // 标签按钮升级
    'tag-btn': [
      'btn', // 继承基础按钮特性
      'px-3 py-1.5 rounded-full text-sm',
      'flex items-center gap-1.5',
      'border bg-background/70', // 半透明背景

      'text-text',
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
    'card-base': [...cardBase].join(' '),
    'card-disabled': [
      ...cardBase,
      'bg-muted cursor-not-allowed',
      'text-muted-foreground shadow-inner',
    ].join(' '),

    // 过渡效果
    'theme-transition': layoutBase.join(' '),

    // 布局系统
    'flex-layout': [
      'flex gap-4',
      'data-[direction=horizontal]:md:flex-row',
      'data-[direction=vertical]:flex-col',
    ].join(' '),
    'content-layout': 'p-4 flex flex-col gap-4',
    // 文章标题
    'article-title': 'text-2xl font-bold mb-4 text-text',

    // 文章网格布局
    'article-grid': 'grid grid-cols-[auto_1fr] gap-8 min-h-[calc(100vh-200px)]',

    // Markdown标题
    'markdown-heading': ['text-xl font-semibold mt-8 mb-4 pb-2', 'border-b border-border'].join(
      ' ',
    ),

    'markdown-content': ['max-w-3xl mx-auto w-full px-4 prose', ...proseBase].join(' '),

    'markdown-code': [
      'rounded-lg shadow-background overflow-hidden my-4',
      'bg-background font-mono text-sm',
    ].join(' '),
    'panel-base': ['bg-muted/50 border-border/50', 'rounded-lg p-3', 'theme-transition'].join(' '),
  },

  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    colors: Object.assign(
      {
        text: 'hsl(var(--text))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        'muted-hover': 'hsl(var(--muted-hover))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        'border-hover': 'hsl(var(--border-hover))',
      },
      // 自动生成带状态的颜色变量
      ['primary', 'success', 'warning', 'danger', 'text'].reduce(
        (acc, color) => ({
          ...acc,
          [color]: `hsl(var(--${color}))`,
          ...['hover', 'active', 'disabled'].reduce(
            (stateAcc, state) => ({
              ...stateAcc,
              [`${color}-${state}`]: `hsl(var(--${color}-${state}))`,
            }),
            {},
          ),
        }),
        {},
      ),
    ),
    borderRadius: ['DEFAULT', 'sm', 'md', 'lg', 'xl'].reduce(
      (acc, size) => ({
        ...acc,
        [size]: `var(--radius${size === 'DEFAULT' ? '' : `-${size}`})`,
      }),
      {},
    ),
    boxShadow: {
      // 基础阴影
      ...['md', 'lg'].reduce(
        (acc, size) => ({
          ...acc,
          [size]: `var(--shadow-${size})`,
          [`${size}-dark`]: `var(--shadow-${size}-dark)`,
        }),
        {},
      ),
    },
  },
})
