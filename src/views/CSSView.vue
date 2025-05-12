<template>
  <div class="grid grid-cols-2 h-[calc(100vh-60px)] gap-4 p-4">
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <BaseMonacoEditor language="css" :options="editorOptions" @change="handleEditorChange" />
    </div>
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <SandboxFrame :css="cssCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseMonacoEditor from '@/components/composable/BaseMonacoEditor.vue'
import SandboxFrame from '@/components/composable/SandboxFrame.vue'

const cssCode = ref(`/* 从这里开始编写你的CSS */
.header {
  /* 页头样式 */
}

.nav {
  /* 导航栏样式 */
}

.main-content {
  /* 主内容区布局 */
}

.article {
  /* 文章内容样式 */
}

.sidebar {
  /* 侧边栏样式 */
}

.grid-layout {
  /* 网格布局样式 */
}

.flex-container {
  /* 弹性盒子样式 */
}

.footer {
  /* 页脚样式 */
}`)

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  automaticLayout: true,
  scrollBeyondLastLine: false,
  theme: 'vs-dark',
  formatOnPaste: true,
  quickSuggestions: {
    other: true,
    comments: false,
    strings: true
  },
  suggestOnTriggerCharacters: true
}

const handleEditorChange = (newValue: string) => {
  cssCode.value = newValue
}
</script>
