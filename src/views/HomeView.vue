<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { md } from '@/composables/useMarked'

// 定义一个更清晰的 mermaid 流程图示例
const mark = `
\`\`\`mermaid
flowchart TD
    A[Hard] -->| Text | B(Round)
    B --> C{Decision}
    C -->| One | D[Result 1]
    C -->| Two | E[Result 2]
\`\`\`
`

const MarkRender = ref('')

onMounted(() => {
  MarkRender.value = md.render(mark)
  console.log(MarkRender.value)
})
</script>

<template>
  <div v-html="MarkRender"></div>
</template>
