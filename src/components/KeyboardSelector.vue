<script setup lang="ts">
defineProps<{
  keyboards: Record<KeyboardId, Keyboard>,
}>()

defineEmits([
  'keyboard-select'
])

// The selected value
var value: KeyboardId

function renderOption(kbd: Keyboard) {
  return kbd.name + (kbd.variant ? ` (variant ${kbd.variant})` : '')
}
</script>

<template>
  <!-- Keyboard selector -->
  <div>
    <label for="selector">
      <strong>Select your keyboard model:</strong>
    </label>
    <select id="selector" v-model="value" @change="$emit('keyboard-select', value)">
      <template v-for="kbd in keyboards" :key="kbd.id">
        <option :value="kbd.id">{{ renderOption(kbd) }}</option>
      </template>
    </select>
  </div>
</template>