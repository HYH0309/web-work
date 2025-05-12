import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup,
  presetWind3,
} from 'unocss'
export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      scale: 1.5,
      extraProperties: {
        display: 'inline-block',
      },
    }),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: {
    'card-base':
      'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300',
    'description-box':
      'card-base text-center p-3 rounded-xl text-blue-800/90 dark:text-blue-200 bg-blue-50/80 dark:bg-blue-900/80',
    'metrics-grid': 'grid grid-cols-3 gap-3',
    'cover-container':
      'relative h-28 overflow-hidden rounded-t-lg shadow-[0_2px_6px_rgba(0,0,0,0.1)]',
    'cover-image': 'w-full h-full object-cover transition-transform duration-300 hover:scale-105',
    'tag-base':
      'px-3 py-1.5 text-sm font-semibold rounded-full  text-gary shadow-sm hover:bg-gray-200 transition-colors',
    'view-container': 'flex flex-col gap-4 p-4 max-w-7xl mx-auto',
    'algo-card': 'bg-white rounded-lg shadow-md p-4 transition-shadow hover:shadow-lg',
    'visual-area':
      'min-h-[500px] bg-white rounded-xl border border-gray-100 p-1 flex justify-center',
  },
  theme: {
    colors: {
      algo: {
        primary: '#2d8cf0',
        secondary: '#19be6b',
        bg: '#f8f8f9',
      },
      // 扩展颜色系统
      gray: {
        100: '#f3f4f6',
        700: '#374151',
        800: '#1f2937',
      },
      green: {
        100: '#dcfce7',
        800: '#166534',
      },
      blue: {
        100: '#dbeafe',
        800: '#1e40af',
      },
      primary: {
        500: '#6366f1',
        600: '#4f46e5',
      },
      danger: {
        500: '#ef4444',
        600: '#dc2626',
      },
      success: {
        500: '#10b981',
        600: '#059669',
      },
      active: {
        500: '#3b82f6',
        600: '#2563eb',
      },
    },
  },
})
