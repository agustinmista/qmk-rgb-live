<script setup lang="ts">
import { type Ref, ref } from 'vue'
import KeyboardSelector from '@/components/Keyboard/KeyboardSelector.vue'
import KeyboardController from '@/components/Keyboard/KeyboardController.vue'

// The currently connected device
var selectedDevice: Ref<HIDDevice | null> = ref(null)

// The currently selected keyboard
var selectedKeyboard: Ref<Keyboard | null> = ref(null)

// Is the device currently connected?
var connected = ref(false)

// Connect/disconnect device
async function connectDevice(device: HIDDevice, keyboard: Keyboard) {
  console.log(`Connecting device ...`)
  selectedDevice.value = device
  selectedKeyboard.value = keyboard
  await device.open()
  connected.value = selectedDevice.value.opened
}

async function disconnectDevice() {
  if (selectedDevice.value && selectedDevice.value.opened) {
    console.log(`Disconnecting device ...`)
    await selectedDevice.value.close()
    connected.value = selectedDevice.value.opened
  }
}
</script>

<template>
  <KeyboardSelector v-if="!connected"
    :device="selectedDevice"
    :keyboard="selectedKeyboard"
    :connected="connected"
    @keyboard-selector-connect="connectDevice"
    />
    <KeyboardController v-if="selectedDevice && selectedKeyboard && connected"
    :device="selectedDevice"
    :keyboard="selectedKeyboard"
    @keyboard-controller-disconnect="disconnectDevice"
  />
</template>