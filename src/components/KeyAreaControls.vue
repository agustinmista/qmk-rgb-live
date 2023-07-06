<script setup lang="ts">
defineEmits([
  'key-controls-select-all',
  'key-controls-invert-all',
  'key-controls-clear-all'
])
</script>

<template>
  <!-- Key area controls -->
  <div class="grid">
    <div class="grid">
      <button @click="$emit('key-controls-select-all')">Select all</button>
      <button @click="$emit('key-controls-invert-all')">Invert all</button>
      <button @click="$emit('key-controls-clear-all')">Clear all</button>
    </div>
  </div>
</template>