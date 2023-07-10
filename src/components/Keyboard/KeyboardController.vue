<script setup lang="ts">
import { reactive } from 'vue'
import * as WebHID from '@/util/webhid'
import CardContainer from '@/components/Container/CardContainer.vue'
import KeyArea from '@/components/Keyboard/KeyArea.vue'
import ColorPicker from '@/components/Util/ColorPicker.vue'
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

const selectedKeys: Set<KeyIndex> = reactive(new Set())

function toggle(index: KeyIndex) {
  if (!selectedKeys.delete(index)) {
    selectedKeys.add(index)
  }
}

function selectAll() {
  const layout = props.keyboard.variants[props.variant]
  layout.forEach(key => {
    selectedKeys.add(key.index)
  });
}

function invertAll() {
  const layout = props.keyboard.variants[props.variant]
  layout.forEach(key => {
    toggle(key.index)
  });
}

function clearAll() {
  selectedKeys.clear()
}

// Selected colors

const colorMap: Map<KeyIndex, HexColor> = reactive(new Map())

function colorChosen(color: HexColor) {
  // Update UI
  selectedKeys.forEach(index => {
    colorMap.set(index, color)
  })
  // Update keyboard
  WebHID.remoteRGBSendSetColor(props.device, color, Array.from(selectedKeys))
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
      <!-- HexColor picker -->
      <ColorPicker
        @color-picker-chosen="colorChosen"
      />
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
    </CardContainer>
  </div>
</template>

<style scoped>
h4 span{
  display: inline-block;
}
</style>