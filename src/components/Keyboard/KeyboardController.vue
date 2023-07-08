<script setup lang="ts">
import { reactive } from 'vue';
import CardContainer from '@/components/Container/CardContainer.vue'
import KeyArea from '@/components/Keyboard/KeyArea.vue'
import ColorPicker from '@/components/Util/ColorPicker.vue'
import DisconnectIcon from '../Icon/DisconnectIcon.vue'

const props = defineProps<{
  device: HIDDevice
  keyboard: Keyboard
}>()

const emit = defineEmits([
  'keyboard-controller-disconnect'
])

// Disconnect

function disconnect() {
  emit('keyboard-controller-disconnect')
}

// Selected keys

const selectedKeys: Set<Index> = reactive(new Set())

function toggle(index: Index) {
  if (!selectedKeys.delete(index)) {
    selectedKeys.add(index)
  }
}

function selectAll() {
  props.keyboard.layout.forEach(key => {
    selectedKeys.add(key.index)
  });
}

function invertAll() {
  props.keyboard.layout.forEach(key => {
    toggle(key.index)
  });
}

function clearAll() {
  selectedKeys.clear()
}

// Selected colors

const colorMap: Map<Index, string> = reactive(new Map())

function colorChosen(color: string) {
  const rgb = hexToRGB(color)
  console.log('Chosen color', rgb)

  selectedKeys.forEach(index => {
    // UI
    colorMap.set(index, color)
    // Keyboard
    let data = new Array(32).fill(0);
    data.splice(0, 5, rgb?.r, rgb?.g, rgb?.b, index[0], index[1])
    sendMessage(data)
  })
}

function hexToRGB(hex: string) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    return null
  } else {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
  }
}

// WebHID stuff

async function sendMessage(data: Array<number>) {
  if (props.device && props.device.opened) {
    console.log('Sending data:')
    console.log(data)
    await props.device.sendReport(0x0, new Uint8Array(data))
  }
}
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
      <!-- Color picker -->
      <ColorPicker
        @color-picker-chosen="colorChosen"
      />
      <!-- Key area -->
      <KeyArea
        :keys="keyboard.layout"
        :selected="selectedKeys"
        :colors="colorMap"
        @key-area-toggle="toggle"
        @key-area-select-all="selectAll"
        @key-area-invert-all="invertAll"
        @key-area-clear-all="clearAll"
      />
    </CardContainer>
  </div>
</template>

<style scoped>
h4 span{
  display: inline-block;
}
</style>