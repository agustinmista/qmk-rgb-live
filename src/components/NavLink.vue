<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{
  to: string,
}>()
</script>

<template>
  <li>
    <RouterLink :to="to">
      <slot></slot>
    </RouterLink>
  </li>
</template>

<style scoped></style>