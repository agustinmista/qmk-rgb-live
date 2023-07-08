<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="container">
    <RouterView v-slot="{ Component }">
      <Transition mode="out-in">
        <Component :is="Component" />
      </transition>
    </RouterView>
  </main>
</template>

<style scoped>
main {
  padding-top: calc(var(--block-spacing-vertical) + 3.5rem);
}
</style>
