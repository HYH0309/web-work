<script setup lang="ts">
import DPControlPanel from '@/components/dp/DPControlPanel.vue'
import DPCanvas from '@/components/dp/DPCanvas.vue'
import DPStatus from '@/components/dp/DPStatus.vue'
import Modal from '@/components/composable/BaseModal.vue'
import { useDPStore } from '@/stores/dpStore'
const store = useDPStore()
</script>

<template>
  <div class="view-container">
    <DPControlPanel class="algo-card" />
    <DPStatus class="algo-card" />
    <div class="visual-area">
      <DPCanvas class="h-full" />
    </div>
  </div>
  <Modal :show="store.state.show" @close-show="store.closeShow">
    <component :is="store.state.selectedAlgorithm.doc" />
  </Modal>
</template>
