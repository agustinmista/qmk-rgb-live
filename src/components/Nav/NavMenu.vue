<script setup lang="ts">
defineProps<{
  name: string,
  logo: string,
}>()
</script>

<template>
  <nav class="container-fluid">
    <!-- To the left -->
    <ul>
      <li>
        <img id="logo" :src="logo" width="48" height="48" />
      </li>
      <li>
        <strong>{{ name }}</strong>
      </li>
    </ul>
    <!-- To the right -->
    <ul>
      <slot></slot>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--nav-background-color);
  box-shadow: 0 1px 0 var(--nav-border-color);
}

#logo {
  padding: 0
}
</style>