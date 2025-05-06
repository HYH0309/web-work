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
  presets: [presetWind3(), presetAttributify(), presetIcons(), presetTypography()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: {
    'card-base':
      'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300',
    'cover-container':
      'relative h-28 overflow-hidden rounded-t-lg shadow-[0_2px_6px_rgba(0,0,0,0.1)]',
    'cover-image': 'w-full h-full object-cover transition-transform duration-300 hover:scale-105',
    'tag-base':
      'px-3 py-1.5 text-sm font-semibold rounded-full  text-gary shadow-sm hover:bg-gray-200 transition-colors',
  },
  theme: {
    colors: {
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
    },
  },
})
