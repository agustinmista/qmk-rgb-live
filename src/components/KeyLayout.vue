<script setup lang="ts">
import KeyItem from '@/components/KeyItem.vue';

type MatrixIndex = Array<number>

interface Key {
  matrix: MatrixIndex
  x: number
  y: number
  w?: number
  h?: number
}

const props = defineProps<{
  layout: Array<Key>,
}>()

// Selected keys
const selected: Set<Key> = new Set()

// Compute layout scale
const width = Math.max(...props.layout.map(key => key.x + (key.w || 1)))
const height = Math.max(...props.layout.map(key => key.y + (key.h || 1)))
const scale = 100 / width
const extra = 0.1  // Add some key separation

// Some shorthands
function layoutW() { return 100 }
function layoutH() { return scale * height }
function keyX (key: Key) { return scale * (key.x + extra) }
function keyY (key: Key) { return scale * (key.y + extra) }
function keyW (key: Key) { return scale * ((key.w || 1) - extra) }
function keyH (key: Key) { return scale * ((key.h || 1) - extra) }
</script>

<template>
  <div class="layout" :style="{ width: layoutW()+'%', paddingBottom: layoutH()+'%' }">
    <template v-for="key in layout" :key="key.matrix">
      <KeyItem
        :matrix="key.matrix"
        :x="keyX(key)"
        :y="keyY(key)"
        :w="keyW(key)"
        :h="keyH(key)"
        :selected="selected.has(key)"
        @key-select="selected.add(key)"
        @key-unselect="selected.delete(key)"
      />
    </template>
  </div>
</template>

<style scoped>
.layout {
  position: relative;
}
</style>