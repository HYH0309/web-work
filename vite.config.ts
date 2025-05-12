import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'unplugin-vue-markdown/vite'
import Components from 'unplugin-vue-components/vite'
import MotionResolver from 'motion-v/resolver'
import prism from 'markdown-it-prism'
import { katex } from '@mdit/plugin-katex'
import table from 'markdown-it-multimd-table'
import { tab } from '@mdit/plugin-tab'
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
      script: {
        defineModel: true,
      },
    }),
    UnoCSS(),
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
      },
      markdownItSetup(md) {
        md.use(prism).use(katex).use(table).use(tab, {
          name: 'tabs',
        })
      },
      wrapperClasses: 'markdown-body prose max-w-none',
    }),
    vueDevTools(),
  ],
  build: {
    assetsInlineLimit: 10240, // 10KB
    rollupOptions: {
      output: {
        manualChunks: {
          monaco: ['monaco-editor'],
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
