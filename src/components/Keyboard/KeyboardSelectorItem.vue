<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import CardContainer from '@/components/Container/CardContainer.vue'
import ConfigIcon from '@/components/Icon/ConfigIcon.vue'
import ConnectIcon from '@/components/Icon/ConnectIcon.vue'
import TrashIcon from '@/components/Icon/TrashIcon.vue'

const props = defineProps<{
  deviceName: string
  deviceInterfaces: Array<HIDDevice>
  keyboardVariants: Array<Keyboard>
}>()

const emit = defineEmits([
  'keyboard-selector-item-connect',
  'keyboard-selector-item-forget'
])

type ArrayIndex = number | null

function isNull(i: ArrayIndex) { return i === null }

// The selected device interface
let selectedInterface: Ref<ArrayIndex> = ref(null);

// The selected keyboard
var selectedVariant: Ref<ArrayIndex> = ref(null);

// Helpers

function canConnect() {
  return isDeviceSupported() && !isNull(selectedInterface.value) && !isNull(selectedVariant.value)
}

function renderDeviceOption(index: number) {
  const device = props.deviceInterfaces[index]
  const [vendorId, productId, usage, usagePage] = deviceUSBParams(device)
  return `#${index} (vendorId: ${vendorId},productId: ${productId}, usage: ${usage}, usagePage: ${usagePage})`
}

function renderVariantOption(index: number) {
  const variant = props.keyboardVariants[index]
  return (variant.variant ? `${variant.variant}` : ' default')
}

function isDeviceSupported() {
  return props.keyboardVariants.length > 0
}

function deviceUsage(device: HIDDevice) {
  return device.collections[0].usage!
}

function deviceUsagePage(device: HIDDevice) {
  return device.collections[0].usagePage!
}

function deviceUSBParams(device: HIDDevice) {
  return [
    device.vendorId,
    device.productId,
    deviceUsage(device),
    deviceUsagePage(device)
  ]
}

// Devices and variants computed by default
// We select the first combination of device interface and keyboard variant such
// that the interface matches all the USB parameter defined in the variant.
function computeDefaultOptions() {
  props.deviceInterfaces.forEach((deviceInterface, interfaceIndex) => {
    props.keyboardVariants.forEach((keyboardVariant, variantIndex) => {
      let ok = true
      const checkParam = (variantParam: string | undefined, interfaceParam: number) => {
        if (variantParam && parseInt(variantParam, 16) !== interfaceParam) { ok = false }
      }
      checkParam(keyboardVariant.usb.vendorId, deviceInterface.vendorId)
      checkParam(keyboardVariant.usb.productId, deviceInterface.productId)
      checkParam(keyboardVariant.usb.usage, deviceUsage(deviceInterface))
      checkParam(keyboardVariant.usb.usagePage, deviceUsagePage(deviceInterface))
      if (ok) {
        selectedInterface.value = interfaceIndex
        selectedVariant.value = variantIndex
      }
    })
  })
}

onMounted(computeDefaultOptions)

// Event handlers

function connect(interfaceIndex: ArrayIndex, variantIndex: ArrayIndex) {
  if (!isNull(interfaceIndex) && !isNull(variantIndex)) {
    emit(
      'keyboard-selector-item-connect',
      props.deviceInterfaces[interfaceIndex!],
      props.keyboardVariants[variantIndex!]
    )
  }
}

function forget(interfaceIndex: ArrayIndex) {
  if (!isNull(interfaceIndex)) {
    emit(
      'keyboard-selector-item-forget',
      props.deviceInterfaces[interfaceIndex!]
    )
  }
}

// Config pane
let configOpen: Ref<boolean> = ref(false)

function toggleConfig() {
  configOpen.value = !configOpen.value
}
</script>

<template>
  <CardContainer>

    <!-- Header -->
    <div class="button-grid">
      <div class="button-grid-header">
        <h4>
          <span>{{ deviceName ? deviceName : 'Unknown device' }}</span>
          <i>{{ isDeviceSupported() ? '' : ' (not supported)' }}</i>
        </h4>
        <i>{{ keyboardVariants.length > 0 ? keyboardVariants[0].manufacturer : 'Unknown manufacturer' }}</i>
      </div>
      <div class="button-grid-b1">
        <button class="green" @click="connect(selectedInterface, selectedVariant)" :disabled="!canConnect()">
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

    <!-- Supported device -->
    <div v-if="isDeviceSupported() && configOpen">
      <div class="grid">
        <!-- Keyboard -->
        <div>
          <label for="variant-selector">
            <strong>Keyboard variant</strong>
          </label>
          <select id="variant-selector" v-model="selectedVariant">
            <option disabled selected value>Select an option</option>
            <template v-for="(keyboardVariant, index) in keyboardVariants" :key="keyboardVariant.id">
              <option :value="index">{{ renderVariantOption(index) }}</option>
            </template>
          </select>
        </div>
        <!-- Interface -->
        <div>
          <label for="interface-selector">
            <strong>Device interface</strong>
          </label>
          <select id="interface-selector" v-model="selectedInterface">
            <option disabled selected value>Select an option</option>
            <template v-for="(deviceInterface, index) of deviceInterfaces" :key="deviceUSBParams(deviceInterface)">
              <option :value="index">{{ renderDeviceOption(index) }}</option>
            </template>
          </select>
        </div>
      </div>
    </div>

  </CardContainer>
</template>