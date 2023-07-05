<script setup lang="ts">
import { RouterView } from 'vue-router'
import FooterMenu from './FooterMenu.vue';
</script>

<template>
  <main class="container">
    <!-- View content -->
    <RouterView />

    <!-- Footer -->
    <FooterMenu />
  </main>
</template>

<style scoped>
main {
  padding-top: calc(var(--block-spacing-vertical) + 3.5rem);
}
</style>
