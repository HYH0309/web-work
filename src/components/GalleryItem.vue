<script setup lang="ts">
import { motion, useScroll, useTransform } from 'motion-v'
import { defineAsyncComponent, markRaw, ref } from 'vue'
const components = [
  { id: 1, component: markRaw(defineAsyncComponent(() => import('docs/era-ai.md'))) },
  { id: 2, component: markRaw(defineAsyncComponent(() => import('docs/era-information.md'))) },
  { id: 3, component: markRaw(defineAsyncComponent(() => import('docs/era-internet.md'))) },
  { id: 4, component: markRaw(defineAsyncComponent(() => import('docs/era-mobile.md'))) },
  { id: 5, component: markRaw(defineAsyncComponent(() => import('docs/era-pc.md'))) },
]
const props = defineProps<{
  id: number
  title: string
  imageUrl: string
}>()
const emit = defineEmits(['submit'])
const targetRef = ref<HTMLElement | null>(null)
const { scrollYProgress } = useScroll({ target: targetRef })
const y = useTransform(scrollYProgress, [0, 1], [-300, 300])
const handleClick = () => {
  // 点击事件处理逻辑
  const component = components.find(c => c.id === props.id)?.component
  emit('submit', component)
}
</script>

<template>
  <section class="h-screen snap-center flex justify-center items-center relative">
    <div ref="targetRef"
      class="w-80 h-100 m-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
      @click="handleClick">
      <img :src="props.imageUrl" :alt="props.title" class="w-full h-full object-cover">
    </div>
    <motion.h2 :initial="{ visibility: 'hidden' }" :animate="{ visibility: 'visible' }" :style="{ y }"
      class="text-[#4ff0b7] m-0 font-mono text-[50px] font-bold tracking-[-3px] leading-[1.2] absolute inline-block top-[calc(50%-25px)] left-[calc(50%+120px)]">
      {{ props.title }}
    </motion.h2>
  </section>
</template>
