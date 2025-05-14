<script setup lang="ts">
import { Dialog, TransitionRoot, TransitionChild, DialogPanel } from '@headlessui/vue'

defineOptions({
  name: 'BaseModal'
})

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['CloseShow'])

const closeModal = () => {
  if (props.show) {
    emit('CloseShow')
  }
}
</script>

<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-modal">
      <TransitionChild as="template" enter="theme-transition-opacity" leave="theme-transition-opacity">
        <div class="fixed inset-0 bg-overlay/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild as="template" enter="theme-transition-transform-opacity"
          leave="theme-transition-transform-opacity">
          <DialogPanel class="modal-panel">
            <div class="text-text">
              <slot></slot>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.modal-panel {
  @apply card-base w-full max-w-3xl max-h-[80vh] overflow-y-auto;
}

/* 在全局样式中定义过渡类 */
.theme-transition-opacity {
  @apply transition-opacity duration-300 ease-out;

  &.enter-from {
    @apply opacity-0;
  }

  &.enter-to {
    @apply opacity-100;
  }

  &.leave-from {
    @apply opacity-100;
  }

  &.leave-to {
    @apply opacity-0;
  }
}

.theme-transition-transform-opacity {
  @apply transition-[opacity, transform] duration-300 ease-out;

  &.enter-from {
    @apply opacity-0 scale-95;
  }

  &.enter-to {
    @apply opacity-100 scale-100;
  }

  &.leave-from {
    @apply opacity-100 scale-100;
  }

  &.leave-to {
    @apply opacity-0 scale-95;
  }
}
</style>
