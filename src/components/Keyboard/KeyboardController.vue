<script setup lang="ts">
import { reactive } from 'vue';
import KeyArea from '@/components/Keyboard/KeyArea.vue'

const props = defineProps<{
  keyboard: Keyboard
}>()

// Handle selected keys
const selected: Set<Index> = reactive(new Set ())

function toggle(index: Index) {
  if (!selected.delete(index)) {
    selected.add(index)
  }
}

function selectAll() {
  props.keyboard.layout.forEach(key => {
    selected.add(key.index)
  });
}

function invertAll() {
  props.keyboard.layout.forEach(key => {
    toggle(key.index)
  });
}

function clearAll() {
  selected.clear()
}
</script>

<template>
  <!--
  <h5>{{ keyboard.name }}</h5>
  <span>Manufacturer: {{ keyboard.manufacturer }}</span><br />
  <span>Website: <a :href="keyboard.url">{{ keyboard.url }}</a></span><br />
  <span v-if="keyboard.variant">Variant: {{ keyboard.variant }}</span><br />
  -->
  <br />
  <KeyArea
    :keys="keyboard.layout"
    :selected="selected"
    @key-area-toggle="toggle"
    @key-controls-select-all="selectAll"
    @key-controls-invert-all="invertAll"
    @key-controls-clear-all="clearAll"
  />
</template>
