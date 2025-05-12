<script setup lang="ts">
import ControlPanel from '@/components/sort/SortControlPanel.vue'
import StatusMetrics from '@/components/sort/SortStatus.vue'
import VisualizationCanvas from '@/components/sort/SortCanvas.vue'
import Modal from '@/components/composable/BaseModal.vue'
import { useSortingStore } from '@/stores/sortStore'
const store = useSortingStore()
</script>

<template>
  <div class="view-container">
    <ControlPanel class="algo-card" />
    <StatusMetrics class="algo-card" />
    <div class="visual-area ">
      <VisualizationCanvas />
    </div>
  </div>
  <Modal :show="store.state.show" @close-show="store.closeShow">
    <component :is="store.state.selectedAlgorithm.doc"></component>
  </Modal>
</template>
