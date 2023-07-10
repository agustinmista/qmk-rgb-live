<script setup lang="ts">
import { type Ref, ref } from 'vue'
import KeyboardSelector from '@/components/Keyboard/KeyboardSelector.vue'
import KeyboardController from '@/components/Keyboard/KeyboardController.vue'

// The currently connected device
let selectedDevice: Ref<HIDDevice | null> = ref(null)

// The currently connected keyboard
let selectedKeyboard: Ref<Keyboard | null> = ref(null)

// The currently connected variant
let selectedVariant: Ref<VariantId | null> = ref(null)

  // Is the device currently connected?
let connected = ref(false)

// Connect/disconnect device
async function connectDevice(device: HIDDevice, keyboard: Keyboard, variant: VariantId) {
  console.log('Connecting device ...', { device, keyboard, variant })
  selectedDevice.value = device
  selectedKeyboard.value = keyboard
  selectedVariant.value = variant
  await selectedDevice.value.open()
  connected.value = selectedDevice.value.opened
}

async function disconnectDevice() {
  if (selectedDevice.value && selectedDevice.value.opened) {
    console.log('Disconnecting device ...')
    await selectedDevice.value.close()
    connected.value = selectedDevice.value.opened
  }
}
</script>

<template>
  <div class="configurator-view">
    <Transition mode="out-in">
      <KeyboardSelector v-if="!connected"
        @keyboard-selector-connect="connectDevice"
      />
      <KeyboardController v-else
        :device="selectedDevice!"
        :keyboard="selectedKeyboard!"
        :variant="selectedVariant!"
        @keyboard-controller-disconnect="disconnectDevice"
      />
    </Transition>
  </div>
</template>