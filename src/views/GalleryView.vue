<script setup lang="ts">
import { motion, useScroll, useSpring } from 'motion-v'
import GalleryItem from '@/components/GalleryItem.vue'
import Modal from '@/components/composable/BaseModal.vue';
import { ref } from 'vue';

const progress = useSpring(useScroll().scrollYProgress, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001
})
const show = ref<boolean>(false)
const currentComponent = ref(null)
</script>

<template>
  <div>
    <GalleryItem v-for="image in [1, 2, 3, 4, 5]" :key="image" :id="image"
      @submit="show = true; currentComponent = $event" class="snap-start" />
    <motion.div class="fixed left-0 right-0 h-1 bg-[#4ff0b7] bottom-1  scale-x-0" :style="{ scaleX: progress }" />
  </div>
  <Modal :show="show" @close-show="show = false">
    <component :is="currentComponent"></component>
  </Modal>
</template>

<style></style>
