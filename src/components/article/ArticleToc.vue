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
  <Menu as="nav" class="toc-container theme-transition">
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
  @apply sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pr-6 pl-2 w-64;
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--un-scrollbar-thumb)) transparent;
  border-right: 1px solid rgb(var(--un-border-base));
}

.toc-container::-webkit-scrollbar {
  @apply w-1.5;
}

.toc-container::-webkit-scrollbar-thumb {
  @apply bg-scrollbar-thumb rounded-full hover:bg-scrollbar-thumb-hover;
}

.toc-link-base {
  @apply block px-4 py-2.5 rounded-lg theme-transition no-underline;
  margin-left: -0.5rem;
  box-shadow: var(--un-shadow-inset);
}

.toc-link {
  @apply text-muted-foreground hover:bg-muted-hover;
}

.toc-link-active {
  @apply bg-primary text-on-primary shadow-lg;
  transform: translateX(4px);
}
</style>
