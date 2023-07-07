<script setup lang="ts">
import { watch } from 'vue';
import KeyItem from '@/components/Keyboard/KeyItem.vue';

const props = defineProps<{
  keys: Array<Key>,
  selected: Set<Index>
}>()

defineEmits([
  'key-area-toggle',
  'key-area-select-all',
  'key-area-invert-all',
  'key-area-clear-all'
])

// Layout properties
const extra: number = 0.1  // Some key separation
let width: number = 0      // The layout width
let height: number = 0     // The layout height
let scale: number = 1      // The scaling factor

// Compute the layout properties based on `keys`
function computeLayoutDimensions(keys: Array<Key>) {
  width  = Math.max(...keys.map(key => key.x + key.w + extra))
  height = Math.max(...keys.map(key => key.y + key.h + extra))
  scale = 100 / width
}

// Recompute layout whenever we select a new keyboard
watch(() => props.keys, computeLayoutDimensions, { immediate: true })

// Some shorthands to simplify template
function layoutStyle() { return { width: '100%', paddingBottom: (scale * height) +'%' } }
function keyX(key: Key) { return scale * (key.x + extra) }
function keyY(key: Key) { return scale * (key.y + extra) }
function keyW(key: Key) { return scale * (key.w - extra) }
function keyH(key: Key) { return scale * (key.h - extra) }
</script>

<template>
  <!-- Keys area -->
  <div class="keyarea" :style="layoutStyle()">
    <template v-for="key in keys" :key="key.matrix">
      <KeyItem
        :matrix="key.index"
        :x="keyX(key)"
        :y="keyY(key)"
        :w="keyW(key)"
        :h="keyH(key)"
        :selected="selected.has(key.index)"
        @key-toggle="$emit('key-area-toggle', key.index)"
      />
    </template>
  </div>
  <!-- Selection area -->
  <div class="grid">
    <div class="grid">
      <button @click="$emit('key-area-select-all')">Select all</button>
      <button @click="$emit('key-area-invert-all')">Invert all</button>
      <button @click="$emit('key-area-clear-all')">Clear all</button>
    </div>
  </div>
</template>

<style scoped>
.keyarea {
  position: relative;
  margin-bottom: calc(var(--block-spacing-vertical));
  border-style: solid;
  border-width: 2px;
  border-color: var(--secondary);
  border-radius: 10px;
}
</style>