<script setup lang="ts">
import { motion, useScroll, useSpring } from 'motion-v'
import GalleryItem from '@/components/GalleryItem.vue'
import Modal from '@/components/composable/BaseModal.vue';
import { ref } from 'vue';

const titleMap: Record<number, string> = {
  1: '信息革命初期',
  2: '个人计算机时代',
  3: ' 互联网时代',
  4: '移动互联网时代 ',
  5: ' AI觉醒时代'
}

const imageMap: Record<number, string> = {
  1: '/gallery/1.png',
  2: '/gallery/2.png',
  3: '/gallery/3.png',
  4: '/gallery/4.png',
  5: '/gallery/5.png'
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
  <div class="gallery-container">
    <div class=" w-full">
      <GalleryItem v-for="image in [1, 2, 3, 4, 5]" :key="image" :id="image" :title="titleMap[image]"
        :imageUrl="imageMap[image]" @submit="show = true; currentComponent = $event" />
    </div>
    <motion.div class="fixed left-0 right-0 h-1 bg-[#10b981] bottom-1 scale-x-0" :style="{ scaleX: progress }" />
    <Modal :show="show" @close-show="show = false">
      <component :is="currentComponent"></component>
    </Modal>
  </div>
</template>

<style scoped>
.gallery-container {

  @apply min-h-screen w-full bg-gradient-to-br from-teal-100 via-sky-50 to-white dark: from-gray-900 dark:via-sky-950 dark:to-gray-800 transition-colors duration-500 flex items-center justify-center
}
</style>
