<script setup lang="ts">
defineProps<{
  matrix: Array<number>,
  x: number,
  y: number,
  w: number
  h: number,
  selected: boolean
}>()

defineEmits([
  'key-toggle'
])
</script>

<template>
  <div
    :class="'key' + (selected ? ' selected' : '')"
    :style="{ left: x+'%', marginTop: y+'%', width: w+'%', paddingBottom: h+'%' }"
    @click="$emit('key-toggle')"
  >
  </div>
</template>

<style scoped>
.key {
  position: absolute;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 15%;
  background-color: var(--secondary);
}

.key:hover {
  background-color: var(--secondary-hover);
}

.key.selected {
  outline-style: solid;
  outline-offset: -4px;
  outline-width: 2px;
  outline-color: red;
}
</style>