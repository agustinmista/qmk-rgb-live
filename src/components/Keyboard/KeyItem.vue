<script setup lang="ts">
const props = defineProps<{
  index: Array<number>,
  x: number,
  y: number,
  w: number
  h: number,
  selected: boolean
  color: string | null
}>()

defineEmits([
  'key-toggle'
])

function keyClasses() {
  return 'key' + (props.selected ? ' selected' : '')
}

function keyStyle() {
  return {
    left: props.x+'%',
    marginTop: props.y+'%',
    width: props.w+'%',
    paddingBottom: props.h+'%',
    backgroundColor: props.color ? props.color : 'var(--secondary)'
  }
}

function keyTitle() {
  return `(${props.index})`
}

</script>

<template>
  <div
    :class="keyClasses()"
    :style="keyStyle()"
    :title="keyTitle()"
    @click="$emit('key-toggle')"
  >
  </div>
</template>

<style scoped>
.key {
  position: absolute;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 10%;
  cursor: pointer;
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