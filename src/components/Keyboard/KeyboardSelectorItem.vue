<script setup lang="ts">
import CardContainer from '@/components/Container/CardContainer.vue'

const props = defineProps<{
  name: string
  devices: Array<HIDDevice>
  keyboards: Record<KeyboardId, Keyboard>
}>()

const emit = defineEmits([
  'keyboard-selector-item-connect',
  'keyboard-selector-item-forget'
])

// The selected device
var selectedDevice: number

// The selected keyboard
var selectedKeyboard: KeyboardId

function deviceUSBParams(device: HIDDevice) {
  return [
    device.collections[0].usage,
    device.collections[0].usagePage
  ]
}

function renderDeviceOption(device: HIDDevice) {
  const [usage, usagePage] = deviceUSBParams(device)
  return `${device.productName} (usage: ${usage}, usagePage: ${usagePage})`
}

function renderKeyboardOption(keyboard: Keyboard) {
  return keyboard.name + (keyboard.variant ? ` (variant ${keyboard.variant})` : ' (single variant)')
}

function connect() {
  emit('keyboard-selector-item-connect', props.devices[selectedDevice], props.keyboards[selectedKeyboard])
}

function forget() {
  emit('keyboard-selector-item-forget', props.devices[selectedDevice])
}
</script>

<template>
  <CardContainer>
    <h4>{{ name }}</h4>

    <div class="grid">
      <!-- Interface -->
      <div>
        <label for="keyboard-selector">
          <strong>Device interface</strong>
        </label>
        <select id="keyboard-selector" v-model="selectedDevice">
          <option disabled selected value>Select an option</option>
          <template v-for="(device, index) of devices" :key="deviceUSBParams(device)">
            <option :value="index">{{ renderDeviceOption(device) }}</option>
          </template>
        </select>
      </div>
      <!-- Keyboard -->
      <div>
        <label for="keyboard-selector">
          <strong>Keyboard variant</strong>
        </label>
        <select id="keyboard-selector" v-model="selectedKeyboard">
          <option disabled selected value>Select an option</option>
          <template v-for="keyboard in keyboards" :key="keyboard.id">
            <option :value="keyboard.id">{{ renderKeyboardOption(keyboard) }}</option>
          </template>
        </select>
      </div>
    </div>
    <br />
    <!-- Buttons -->
    <div class="grid">
      <button @click="connect">Connect</button>
      <button @click="forget">Forget</button>
    </div>
  </CardContainer>
</template>