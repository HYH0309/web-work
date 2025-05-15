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
  <TransitionRoot appear :show="show" as="template" enter="transform transition duration-[400ms]"
    enter-from="opacity-0 rotate-[-120deg] scale-50" enter-to="opacity-100 rotate-0 scale-100"
    leave="transform duration-200 transition ease-in-out" leave-from="opacity-100 rotate-0 scale-100 "
    leave-to="opacity-0 scale-95 ">
    <TransitionChild enter="transition-opacity duration-300 ease-out" leave="transition-opacity duration-300 ease-out">
      <div class="fixed inset-0 backdrop-blur-sm bg-black/30"></div>
    </TransitionChild>
    <TransitionChild as=" template" enter="transition-opacity duration-300 ease-out"
      leave="transition-opacity duration-300 ease-out">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <DialogPanel class="modal-panel">
          <slot></slot>
        </DialogPanel>
      </Dialog>
    </TransitionChild>
  </TransitionRoot>
</template>

<style scoped>
.modal-panel {
  @apply card-base w-full max-w-3xl max-h-80vh overflow-y-auto fixed inset-0 flex items-center justify-center p-4;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.modal-panel::-webkit-scrollbar {
  display: none;
}
</style>

<style></style>
