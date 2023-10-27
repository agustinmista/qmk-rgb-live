<script setup lang="ts">
import { type Ref, ref, onMounted, onUnmounted } from 'vue'
import { groupProjectBy } from '@/util/groupBy'
import * as WebHID from '@/util/webhid'
import CardContainer from '@/components/Container/CardContainer.vue'
import KeyArea from '@/components/Keyboard/KeyArea.vue'
import ColorPicker from '@/components/Keyboard/ColorPicker.vue'
import PresetSelector from '@/components/Keyboard/PresetSelector.vue'
import DisconnectIcon from '../Icon/DisconnectIcon.vue'

const props = defineProps<{
  device: HIDDevice
  keyboard: Keyboard
  variant: VariantId
}>()

const emit = defineEmits([
  'keyboard-controller-disconnect'
])

// Disconnect

function disconnect() {
  emit('keyboard-controller-disconnect')
}

// Selected keys

const selectedKeys: Ref<Set<KeyIndex>> = ref(new Set<KeyIndex>())

function toggle(index: KeyIndex) {
  if (!selectedKeys.value.delete(index)) {
    selectedKeys.value.add(index)
  }
}

function selectAll() {
  const layout = props.keyboard.variants[props.variant]
  layout.forEach(key => {
    selectedKeys.value.add(key.index)
  });
}

function invertAll() {
  const layout = props.keyboard.variants[props.variant]
  layout.forEach(key => {
    toggle(key.index)
  });
}

function clearAll() {
  selectedKeys.value.clear()
}

// Selected colors

const colorMap: Ref<ColorMap> = ref(new Map())

function colorChosen(color: HexColor) {
  // Update UI
  selectedKeys.value.forEach(index => {
    const keyIndex = JSON.stringify(index)
    colorMap.value.set(keyIndex, color)
  })
  // Update keyboard
  const keys = Array.from(selectedKeys.value)
  WebHID.remoteRGBSendSetColor(props.device, color, keys)
}

function presetChosen(preset: ColorMap) {
  // Update UI
  colorMap.value.clear()
  const layout = props.keyboard.variants[props.variant]
  layout.forEach(key => {
    let keyIndex = JSON.stringify(key.index)
    let color = preset.get(keyIndex)
    colorMap.value.set(keyIndex, color ? color : '#000000')
  });
  // Update keyboard
  const colors = groupProjectBy(Array.from(preset), tup => tup[1], tup => JSON.parse(tup[0]))
  colors.forEach((keys, color) => {
    WebHID.remoteRGBSendSetColor(props.device, color, keys)
  })
}

// Handle global key presses
function onKeyPress(event: KeyboardEvent) {
  // We don't preventDefault so the save modal doesn't break :)
  switch (event.key) {
    case 'a':
      selectAll()
      break
    case 'i':
      invertAll()
      break
    case 'Escape':
      clearAll()
      break
  }
}

onMounted(() => window.addEventListener('keydown', onKeyPress))
onUnmounted(() => window.removeEventListener('keydown', onKeyPress))
</script>

<template>
  <div class="keyboard-controller">

    <!-- Header -->
    <div class="button-grid">
      <div class="button-grid-header">
        <h3>Connected to: </h3>
        <h5><i>{{ device.productName }}</i></h5>
      </div>
      <div class="button-grid-b3">
        <button class="red" @click="disconnect"><DisconnectIcon /></button>
      </div>
    </div>

    <!-- The good stuff -->
    <CardContainer>

      <!-- Key area -->
      <KeyArea
        :layout="keyboard.variants[variant]"
        :selected="selectedKeys"
        :colors="colorMap"
        @key-area-toggle="toggle"
        @key-area-select-all="selectAll"
        @key-area-invert-all="invertAll"
        @key-area-clear-all="clearAll"
      />

      <!-- Color picker -->
      <ColorPicker
        @color-picker-chosen="colorChosen"
      />

      <!-- Preset selector -->
      <PresetSelector
        :keyboard="keyboard"
        :colors="colorMap"
        @preset-selector-load="presetChosen"
      />

    </CardContainer>
  </div>
</template>

<style scoped>
h4 span{
  display: inline-block;
}
</style>