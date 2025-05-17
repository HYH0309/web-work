<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submit', comment: string): void
}>()

const comment = ref('')
const isSubmitting = ref(false)

const handleSubmit = () => {
  if (!comment.value.trim()) return
  
  isSubmitting.value = true
  emit('submit', comment.value)
  comment.value = ''
  isSubmitting.value = false
}
</script>

<template>
  <div class="mt-8 border-t border-border/50 pt-6">
    <div class="flex gap-2">
      <input
        v-model="comment"
        type="text"
        placeholder="输入评论..."
        class="flex-1 px-4 py-2 rounded-lg border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-8 text-gray-9 dark:text-gray-1"
        @keyup.enter="handleSubmit"
      >
      <button
        :disabled="isSubmitting || !comment.trim()"
        class="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 dark:hover:bg-primary/80 transition-colors"
        @click="handleSubmit"
      >
        {{ isSubmitting ? '提交中...' : '提交' }}
      </button>
    </div>
  </div>
</template>
