/// <reference types="vite/client" />

declare module 'markdown-it-katex'
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
declare module '*.md' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}
declare module 'markdown-it-code-copy'
