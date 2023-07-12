<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { router } from '@/router'
import * as WebHID from '@/util/webhid'
import CardContainer from '@/components/Container/CardContainer.vue'
import ConfigIcon from '@/components/Icon/ConfigIcon.vue'
import ConnectIcon from '@/components/Icon/ConnectIcon.vue'
import TrashIcon from '@/components/Icon/TrashIcon.vue'

const props = defineProps<{
  name: string
  devices: Array<HIDDevice>
  keyboard: Keyboard | null
}>()

const emit = defineEmits([
  'keyboard-selector-item-connect',
  'keyboard-selector-item-forget'
])

type ArrayIndex = number

function isNull(i: any | null) { return i === null }

// The selected device interface
let selectedDevice: Ref<ArrayIndex | null> = ref(null);

// The selected variant
var selectedVariant: Ref<VariantId | null> = ref(null);

// Helpers

function canConnect() {
  return isDeviceSupported() && !isNull(selectedDevice.value) && !isNull(selectedVariant.value)
}

function renderDeviceOption(index: number) {
  const device = props.devices[index]
  const { vendorId, productId, usage, usagePage } = WebHID.deviceUSBParams(device)
  return `#${index} (vendorId: ${vendorId},productId: ${productId}, usage: ${usage}, usagePage: ${usagePage})`
}

function renderVariantOption(index: number) {
  const variant = Object.keys(props.keyboard!.variants)[index]
  return `${variant}`
}

function isDeviceSupported() {
  return props.keyboard !== null
}

// Select the device indices that match all the USB parameters defined by this keyboard
function pickMatchingDevices(filter: HIDDeviceFilter) {
  const checkParam = (filterParam: number | undefined, deviceParam: number | undefined) => {
    if (!filterParam) { // Keyboard doesn't define param
      return true
    } else if (!deviceParam) { // Keybord defines param but device doesn't
      return false
    } else { // Both device and keyboard define the param
      return filterParam === deviceParam
    }
  }
  let matching: Array<ArrayIndex> = []
  props.devices.forEach((device: HIDDevice, index) => {
    if (
      checkParam(filter.vendorId, device.vendorId) &&
      checkParam(filter.productId, device.productId) &&
      checkParam(filter.usage, WebHID.deviceUsage(device)) &&
      checkParam(filter.usagePage, WebHID.deviceUsagePage(device))
    ) {
      matching.push(index)
    }
  })
  return matching
}

// Set the default configuration of interface and variant whenever possible
// We do this by selected, in order of priority:
// 2. Picking the first option when there's only one available
// 1. Retrieving a saved value from the local storage if one exists
// 3. For devices only, picking the one that matches all the usb parameters (if there's only one such device)
function computeDefaultOptions() {

  // Unsupported devices don't have a keyboard attached
  if (!props.keyboard) { return }

  // Load any saved config from the local storage
  const savedConfig = loadConfigFromLocalStorage()
  const savedDevice = savedConfig ? pickMatchingDevices(savedConfig.device) : []

  // Default device
  if (props.devices.length === 1) { // Only one option
    console.log('Default device: only one')
    selectedDevice.value = 0
  } else if (savedConfig && savedDevice.length === 1) { // There was an existing config and it matches an paired device
    console.log('Default device: read from local storage')
    selectedDevice.value = savedDevice[0]
  } else {
    const matchingDevices = pickMatchingDevices(props.keyboard.usb)
    if (matchingDevices.length === 1) { // There is exactly one device matching the usb parameters of the keyboard
      console.log('Default device: using keyboard-defined one')
      selectedDevice.value = matchingDevices[0]
    }
  }

  // Default variant
  if (props.keyboard && Object.keys(props.keyboard.variants).length === 1) { // Only one option
    console.log('Default variant: only one option')
    selectedVariant.value = Object.keys(props.keyboard!.variants)[0]
  } else if (savedConfig) { // There was an existing config
    console.log('Default variant: read from local storage')
    selectedVariant.value = savedConfig.variant
  }
}

// Handle auomatic connection by URL query params
function handleConnectQueryParams() {
  let params = router.currentRoute.value.query
  if ('connect' in params) {
    router.replace({'query': undefined})
    if(
      !isNull(props.keyboard) &&
      !isNull(selectedDevice.value) &&
      !isNull(selectedVariant.value) &&
      props.keyboard!.id === params.connect
      ) {
      console.log('Connecting automatically', props.keyboard!.id)
      connect(selectedDevice.value!, selectedVariant.value!)
    }
  }
}

onMounted(() => {
  computeDefaultOptions()
  handleConnectQueryParams()
})

// Event handlers

function connect(device: ArrayIndex, variant: VariantId) {
  if (!isNull(device) && !isNull(variant)) {
    emit(
      'keyboard-selector-item-connect',
      props.devices[device!],
      props.keyboard,
      variant
    )
    saveConfigToLocalStorage()
  }
}

function forget(device: ArrayIndex) {
  if (!isNull(device)) {
    emit(
      'keyboard-selector-item-forget',
      props.devices[device!]
    )
  }
}

// Config pane
let configOpen: Ref<boolean> = ref(false)

function toggleConfig() {
  configOpen.value = !configOpen.value
}

// Local storage

interface ItemConfig {
  device: HIDDeviceFilter,
  variant: VariantId
}

function saveConfigToLocalStorage() {
  const device = props.devices[selectedDevice.value!]
  const variant = selectedVariant.value!
  const key = `config_${props.keyboard!.id}`
  const config: ItemConfig = {
    device: {
      vendorId: device.vendorId,
      productId: device.productId,
      usage: WebHID.deviceUsage(device),
      usagePage: WebHID.deviceUsagePage(device)
    },
    variant: variant
  }
  console.log('Saving config data', { key, config })
  const value = JSON.stringify(config)
  localStorage.setItem(key, value)
}

function loadConfigFromLocalStorage() {
  const key = `config_${props.keyboard!.id}`
  const value = localStorage.getItem(key)
  const config = value ? JSON.parse(value) as ItemConfig : null
  console.log('Read config data', { key, config })
  return config
}
</script>

<template>
  <CardContainer>

    <!-- Header -->
    <div class="button-grid">
      <div class="button-grid-header">
        <h4>
          <span>{{ name ? name : 'Unknown device' }}</span>
          <i>{{ isDeviceSupported() ? '' : ' (not supported)' }}</i>
        </h4>
        <i>{{ keyboard ? keyboard.manufacturer : 'Unknown manufacturer' }}</i>
      </div>
      <div class="button-grid-b1">
        <button class="green" @click="connect(selectedDevice!, selectedVariant!)" :disabled="!canConnect()">
          <ConnectIcon />
        </button>
      </div>
      <div class="button-grid-b2">
        <button :class="'secondary' + (configOpen ? ' outline' : '')" @click="toggleConfig" :disabled="!isDeviceSupported()">
          <ConfigIcon />
        </button>
      </div>
      <div class="button-grid-b3">
        <button class="red" @click="forget(0)">
          <TrashIcon />
        </button>
      </div>
    </div>

    <!-- Config pane -->
    <div v-if="isDeviceSupported() && configOpen">
      <div class="grid">
        <!-- Keyboard -->
        <div>
          <label for="variant-selector">
            <strong>Keyboard variant</strong>
          </label>
          <select id="variant-selector" v-model="selectedVariant">
            <option disabled selected value="null">Select an option</option>
            <template v-for="(variant, index) in Object.keys(keyboard!.variants)" :key="variant">
              <option :value="variant">{{ renderVariantOption(index) }}</option>
            </template>
          </select>
        </div>
        <!-- Device -->
        <div>
          <label for="device-selector">
            <strong>Device interface</strong>
          </label>
          <select id="device-selector" v-model="selectedDevice">
            <option disabled selected value="null">Select an option</option>
            <template v-for="(device, index) of devices" :key="WebHID.deviceUSBParams(device)">
              <option :value="index">{{ renderDeviceOption(index) }}</option>
            </template>
          </select>
        </div>
      </div>
    </div>

  </CardContainer>
</template>