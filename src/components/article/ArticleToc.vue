<script setup lang="ts">
import { Menu, MenuItems, MenuItem } from '@headlessui/vue'

defineProps<{
  items: Array<{ id: string; title: string }>
}>()

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <Menu as="nav" class="toc-container ">
    <MenuItems static class="space-y-1">
      <MenuItem v-for="item in items" :key="item.id" v-slot="{ active }">
      <a :href="`#${item.id}`" :class="[
        'toc-link-base',
        active ? 'toc-link-active' : 'toc-link'
      ]" @click="scrollTo(item.id)">
        {{ item.title }}
      </a>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>

<style scoped>
.toc-container {
  @apply sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden p-5 m-5 w-60 bg-background;
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--un-scrollbar-thumb)) transparent;
  border-right: 1px solid rgb(var(--un-border-base));
}

.toc-container::-webkit-scrollbar-thumb {
  @apply rounded-full;
}

.toc-link-base {
  @apply block px-4 py-2.5 rounded-lg no-underline w-40 card-base hover:text-success;
}

.toc-link {
  @apply text-primary hover:text-success theme-transition;
}

.toc-link-active {
  @apply shadow-lg transform-translate-x-5 transition-delay-10;
}
</style>
