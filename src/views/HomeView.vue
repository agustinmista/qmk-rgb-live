<script setup lang="ts">
import { type Ref, ref } from 'vue'
import * as WebHID from '@/util/webhid'
import CardContainer from '@/components/Container/CardContainer.vue'
import KeyboardSelector from '@/components/Keyboard/KeyboardSelector.vue'
import KeyboardController from '@/components/Keyboard/KeyboardController.vue'

// Is this a supported browser?
let supported = WebHID.isSupported()

// Is the device currently connected?
let connected = ref(false)

// The currently connected device
let selectedDevice: Ref<HIDDevice | null> = ref(null)

// The currently connected keyboard
let selectedKeyboard: Ref<Keyboard | null> = ref(null)

// The currently connected variant
let selectedVariant: Ref<VariantId | null> = ref(null)

// Connect/disconnect device
async function connect(device: HIDDevice, keyboard: Keyboard, variant: VariantId) {
  selectedDevice.value = device
  selectedKeyboard.value = keyboard
  selectedVariant.value = variant
  connected.value = await WebHID.connectDevice(selectedDevice.value)
  if (connected.value) {
    await WebHID.remoteRGBSendStart(selectedDevice.value!)
  }
}

async function disconnect() {
  if (selectedDevice.value) {
    await WebHID.remoteRGBSendStop(selectedDevice.value!)
    connected.value = await WebHID.disconnectDevice(selectedDevice.value)
  }
}
</script>

<template>
  <div class="configurator-view">
    <Transition mode="out-in">
      <CardContainer v-if="!supported">
        <span>Your browser does not support WebHID!</span>
      </CardContainer>
      <KeyboardSelector v-else-if="!connected"
        @keyboard-selector-connect="connect"
      />
      <KeyboardController v-else
        :device="selectedDevice!"
        :keyboard="selectedKeyboard!"
        :variant="selectedVariant!"
        @keyboard-controller-disconnect="disconnect"
      />
    </Transition>
  </div>
</template>