<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { loadKeyboards } from '@/util/keyboardLoader'
import { groupBy } from '@/util/groupBy'
import KeyboardSelectorItem from '@/components/Keyboard/KeyboardSelectorItem.vue'
import CardContainer from '@/components/Container/CardContainer.vue'

defineProps<{
  connected: boolean
}>()

const emit = defineEmits([
  'keyboard-selector-connect'
])

// Devices

// Retrieve the WebHID API
const hid = navigator.hid

// Retrieve the paired HID devices
var devices: Ref<Array<HIDDevice>> = ref([])

async function updateDevices() {
  devices.value = await hid.getDevices()
}

onMounted(updateDevices)

// Keyboards

// Load the supported keyboard definitions
const keyboards: Record<KeyboardId, Keyboard> = loadKeyboards()

function connectDevice(device: HIDDevice, keyboard: Keyboard) {
  console.log('connecting to', device, keyboard)
  emit('keyboard-selector-connect', device, keyboard)
}

/*
 * WebHID stuff
 */

async function pairDevice() {
  console.log(`Pairing new device ...`)
  await hid.requestDevice({ filters: [] })
  await updateDevices()
}

async function forgetDevice(device: HIDDevice) {
  if (device) {
    console.log(`Forgeting device ...`)
    await device.forget()
    await updateDevices()
  }
}
</script>

<template>
  <h3>Paired devices</h3>

  <!-- No paired devices -->
  <template v-if="!connected && devices.length === 0">
    <CardContainer>
      <span>It is lonely here! Try pressing the button below</span>
    </CardContainer>
  </template>

  <!-- Some paired devices -->
  <template v-if="devices.length !== 0">
    <template v-for="[name, devicesGroup] of groupBy(devices, dev => dev.productName)" :key="name">
      <KeyboardSelectorItem
        :name="name"
        :devices="devicesGroup"
        :keyboards="keyboards"
        @keyboard-selector-item-forget="forgetDevice"
        @keyboard-selector-item-connect="connectDevice"
      />
    </template>
  </template>

  <!-- Pair button -->
  <template v-if="!connected">
    <button @click="pairDevice">Pair new</button>
  </template>
</template>