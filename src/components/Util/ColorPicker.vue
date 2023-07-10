<script setup lang="ts">
defineEmits([
  'color-picker-chosen'
])

const defaultColors: Array<string> = [
  '#ffffff',
  '#ffff00',
  '#ff6500',
  '#dc0000',
  '#ff0097',
  '#360097',
  '#0000ca',
  '#0097ff',
  '#00a800',
  '#006500',
  '#653600',
  '#976536',
  '#b9b9b9',
  '#454545',
  '#000000'
]

function colorOptionStyle(color: string) {
  return {
    backgroundColor: color,
    width: 100 / (defaultColors.length + 1) + '%',
    paddingBottom: 100 / (defaultColors.length + 1) + '%'
  }
}

function colorPickerStyle() {
  return {
    width: 100 / (defaultColors.length + 1) + '%',
  }
}

function colorPickerValue(event: Event) {
  let colorPicker = event.target as HTMLInputElement
  return colorPicker.value
}
</script>


<template>
  <div class="color-palette" width="100%">
    <template v-for="color in defaultColors" :key="color">
      <div class="color-option" :style="colorOptionStyle(color)" @click="$emit('color-picker-chosen', color)"></div>
    </template>
    <div class="color-option" :style="colorPickerStyle()" @change="$emit('color-picker-chosen', colorPickerValue($event))">
      <input type="color">
    </div>
  </div>
</template>

<style scoped>
.color-palette {
  display: flex;
  justify-content: space-evenly;
  padding: 1em;
}

.color-option:hover {
  cursor: pointer;
  transform: scale(1.1);
}

input[type=color] {
  padding: 10%;
  border-radius: 0;
  height: 100%;
}
</style>