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
  shortcuts: [],
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
  presets: [presetWind3(), presetAttributify(), presetIcons(), presetTypography()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
