/// <reference types="vite/client" />

declare module '@monaco-editor/vue3' {
  import type { DefineComponent } from 'vue'
  export const loader: {
    config: (options: { monaco: unknown; paths: { vs: string } }) => void
  }
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

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
