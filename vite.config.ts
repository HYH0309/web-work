import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'unplugin-vue-markdown/vite'
import Components from 'unplugin-vue-components/vite'
import MotionResolver from 'motion-v/resolver'
import { katex } from '@mdit/plugin-katex'
import table from 'markdown-it-multimd-table'
import mermaidItMarkdown from 'mermaid-it-markdown' // Mermaid 图表支持
import hljsMarkdown from 'markdown-it-highlightjs'

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
      script: {
        defineModel: true,
      },
    }),
    UnoCSS({
      mode: 'dist-chunk', // 按模块分块CSS
    }),
    Components({
      dts: true,
      resolvers: [MotionResolver()],
      dirs: ['src/components', 'src/docs'],
    }),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
        langPrefix: 'language-', // 代码块的语言类前缀
      },
      markdownItSetup(md) {
        md.use(hljsMarkdown).use(katex).use(table).use(mermaidItMarkdown)
      },
      wrapperClasses: 'markdown-body',
    }),
    vueDevTools(),
  ],
  build: {
    assetsInlineLimit: 10240, // 10KB
    rollupOptions: {
      output: {
        manualChunks: {
          katex: ['katex'],
          mermaid: ['mermaid'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      docs: fileURLToPath(new URL('./src/docs', import.meta.url)),
    },
  },
})
