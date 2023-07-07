<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import CardContainer from '@/components/Container/CardContainer.vue'
import DeviceSelector from '@/components/Keyboard/DeviceSelector.vue'
import KeyboardSelector from '@/components/Keyboard/KeyboardSelector.vue'
import KeyboardController from '@/components/Keyboard/KeyboardController.vue'

import keyboardLoader from '@/utils/keyboardLoader'

/*
 * Initialization
 */

// Retrieve the WebHID API
const hid = navigator.hid

// Retrieve the paired HID devices
var devices: Array<HIDDevice> = reactive([])

onMounted(async () => {
  Object.assign(devices, await hid.getDevices())
})

// Load the supported keyboard definitions
const keyboards = keyboardLoader()

/*
 * Local state
 */

// The currently connected device
var device: HIDDevice | null = null
var connected = ref(false)

function setSelectedDevice(dev: HIDDevice) {
  device = reactive(dev)
}

async function connectDevice() {
  if (device && !device.opened) {
    console.log(`Connecting device ...`)
    await device.open()
    connected.value = device.opened
  }
}

async function disconnectDevice() {
  if (device && device.opened) {
    console.log(`Disconnecting device ...`)
    await device.close()
    connected.value = device.opened
  }
}

async function pairDevice() {
  console.log(`Pairing new device ...`)
  await hid.requestDevice({ filters: [] })
}

async function forgetDevice() {
  if (device) {
    console.log(`Forgeting device ...`)
    await device.forget()
  }
}

// async function sendMessage(data: Array<number>) {
//   if (device && device.opened) {
//     console.log('Sending data:')
//     console.log(data)
//     await device.sendReport(0x0, new Uint8Array(data))
//   }
// }

// The currently selected keyboard
var selected = ref('')

function setSelectedKeyboard(id: KeyboardId) {
  selected.value = id
}
</script>

<template>
  <CardContainer>
    <DeviceSelector
      :devices="devices"
      :connected="connected"
      @device-select="setSelectedDevice"
      @device-connect="connectDevice"
      @device-disconnect="disconnectDevice"
      @device-pair="pairDevice"
      @device-forget="forgetDevice"
    />
    <KeyboardSelector
      :keyboards="keyboards"
      @keyboard-select="setSelectedKeyboard"
    />
    <KeyboardController v-if="selected && connected"
      :keyboard="keyboards[selected]"
    />
  </CardContainer>
</template>