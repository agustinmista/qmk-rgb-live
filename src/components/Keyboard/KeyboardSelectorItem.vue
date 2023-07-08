<script setup lang="ts">
import { type Ref, ref } from 'vue'
import CardContainer from '@/components/Container/CardContainer.vue'

const props = defineProps<{
  deviceName: string
  deviceInterfaces: Array<HIDDevice>
  keyboardVariants: Array<Keyboard>
}>()

const emit = defineEmits([
  'keyboard-selector-item-connect',
  'keyboard-selector-item-forget'
])

// The selected device interface
let selectedInterface: Ref<number | null> = ref(null);

function renderDeviceOption(index: number) {
  const device = props.deviceInterfaces[index]
  const [usage, usagePage] = deviceUSBParams(device)
  return `#${index} (usage: ${usage}, usagePage: ${usagePage})`
}

function deviceUSBParams(device: HIDDevice) {
  return [
    device.collections[0].usage,
    device.collections[0].usagePage
  ]
}

// The selected keyboard
var selectedVariant: Ref<number | null> = ref(null);

function renderVariantOption(index: number) {
  const variant = props.keyboardVariants[index]
  return (variant.variant ? `${variant.variant}` : ' default')
}


function connect() {
  if (selectedInterface.value !== null && selectedVariant.value !== null) {
    emit(
      'keyboard-selector-item-connect',
      props.deviceInterfaces[selectedInterface.value],
      props.keyboardVariants[selectedVariant.value]
    )
  }
}

function forget() {
  if (selectedInterface.value !== null) {
    emit(
      'keyboard-selector-item-forget',
      props.deviceInterfaces[selectedInterface.value]
    )
  }
}
</script>

<template>
  <CardContainer>
    <h4>{{ deviceName }}</h4>

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
    <br />
    <!-- Buttons -->
    <div class="grid">
      <button @click="connect" :disabled="selectedInterface === null || selectedVariant === null">Connect</button>
      <button @click="forget" :disabled="selectedInterface === null">Forget</button>
    </div>
  </CardContainer>
</template>