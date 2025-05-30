<script setup lang="ts">
import { motion, useScroll, useSpring } from 'motion-v'
import GalleryItem from '@/components/GalleryItem.vue'
import Modal from '@/components/composable/BaseModal.vue';
import { ref } from 'vue';

const titleMap: Record<number, string> = {
  1: '人工智能革命',
  2: '信息时代',
  3: '互联网时代',
  4: '移动革命',
  5: '个人计算机革命'
}

const imageMap: Record<number, string> = {
  1: '/gallery/era-ai.jpg',
  2: '/gallery/era-information.jpg',
  3: '/gallery/era-internet.jpg',
  4: '/gallery/era-mobile.jpg',
  5: '/gallery/era-pc.jpg'
}

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
    <GalleryItem v-for="image in [1, 2, 3, 4, 5]" :key="image" :id="image" :title="titleMap[image]"
      :imageUrl="imageMap[image]" @submit="show = true; currentComponent = $event" class="snap-start" />
    <motion.div class="fixed left-0 right-0 h-1 bg-[#4ff0b7] bottom-1  scale-x-0" :style="{ scaleX: progress }" />
  </div>
  <Modal :show="show" @close-show="show = false">
    <component :is="currentComponent"></component>
  </Modal>
</template>

<style></style>
