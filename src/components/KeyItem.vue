<script setup lang="ts">
defineProps<{
  matrix: Array<number>,
  x: number,
  y: number,
  w: number
  h: number,
  selected: boolean
}>()

defineEmits(['key-select', 'key-unselect'])
</script>

<template>
  <div
    :class="'key' + (selected ? ' selected' : '')"
    :style="{ left: x+'%', marginTop: y+'%', width: w+'%', paddingBottom: h+'%' }"
    @click="$emit('key-' + (selected ? 'unselect' : 'select'), matrix)"
  >
  </div>
</template>

<style scoped>
.key {
  position: absolute;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 10%;
  background-color: var(--secondary);
}

.key:hover {
  background-color: var(--secondary-hover);
}

.key.selected {
  border-style: solid;
  border-width: 2px;
  border-color: red;
}
</style>