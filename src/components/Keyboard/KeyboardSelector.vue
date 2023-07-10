<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { loadKeyboards } from '@/util/keyboardLoader'
import { groupBy } from '@/util/groupBy'
import * as WebHID from '@/util/webhid'
import KeyboardSelectorItem from '@/components/Keyboard/KeyboardSelectorItem.vue'
import CardContainer from '@/components/Container/CardContainer.vue'
import PlusIcon from '@/components/Icon/PlusIcon.vue'
import PlusIconSmall from '@/components/Icon/PlusIconSmall.vue'

const emit = defineEmits([
  'keyboard-selector-connect'
])

// Devices

// Retrieve the paired HID devices
let devices: Ref<Array<HIDDevice>> = ref([])

async function updateDevices() {
  devices.value = await WebHID.getDevices()
}

onMounted(updateDevices)

// Keyboards

// Load the supported keyboard definitions
const keyboards: Record<KeyboardId, Keyboard> = loadKeyboards()

// Compute matching combinations of devices and keyboard (by name)
function matchDevicesAndKeyboards() {
  let groups: Array<{ name: string, devices: Array<HIDDevice>, keyboard: Keyboard | null }> = []
  let productName = (device: HIDDevice) => device.productName
  groupBy(devices.value, productName).forEach((devices, deviceName) => {
    let keyboard = Object.values(keyboards).find(keyboard => keyboard.name === deviceName)
    groups.push({
      name: deviceName,
      devices: devices,
      keyboard: keyboard ? keyboard : null
    })
  })
  return groups
}

// Event handlers

function connect(device: HIDDevice, keyboard: Keyboard, variant: VariantId) {
  emit('keyboard-selector-connect', device, keyboard, variant)
}

async function pair() {
  await WebHID.pairDevice()
  await updateDevices()
}

async function forget(device: HIDDevice) {
  await WebHID.forgetDevice(device)
  await updateDevices()
}
</script>

<template>
  <div class="keyboard-selector">

    <!-- Header -->
    <div class="button-grid">
      <div class="button-grid-header">
        <h3>Paired devices</h3>
      </div>
      <div class="button-grid-b3">
        <button class="green" @click="pair"><PlusIcon /></button>
      </div>
    </div>

    <!-- No paired devices -->
    <template v-if="devices.length === 0">
      <CardContainer>
        <span>It's lonely in here! Try pressing the <PlusIconSmall /> button.</span>
      </CardContainer>
    </template>

    <!-- Some paired devices -->
    <template v-if="devices.length !== 0">
      <template v-for="deviceGroup of matchDevicesAndKeyboards()" :key="deviceGroup.deviceName">
        <KeyboardSelectorItem
          :name="deviceGroup.name"
          :devices="deviceGroup.devices"
          :keyboard="deviceGroup.keyboard"
          @keyboard-selector-item-forget="forget"
          @keyboard-selector-item-connect="connect"
        />
      </template>
    </template>
  </div>
</template>

<style scoped>
span {
  padding-left: 1em
}
</style>