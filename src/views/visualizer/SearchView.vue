<script setup lang="ts">
import SearchCanvas from '@/components/search/SearchCanvas.vue'
import ControlPanel from '@/components/search/SearchControlPanel.vue'
import SearchStatus from '@/components/search/SearchStatus.vue'
import Modal from '@/components/composable/BaseModal.vue'
import { useSearchStore } from '@/stores/searchStore'
//
const store = useSearchStore()
</script>

<template>
  <div class="view-container">
    <ControlPanel class="algo-card" />
    <SearchStatus class="algo-card" />
    <div class="visual-area">
      <SearchCanvas />
    </div>
  </div>
  <Modal :show="store.state.show" @close-show="store.closeShow">
    <component :is="store.state.selectedAlgorithm.doc" />
  </Modal>
</template>
