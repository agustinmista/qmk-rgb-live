<script setup lang="ts">
defineProps<{
  devices: Array<HIDDevice>
  connected: boolean
}>()

defineEmits([
  'device-pair',
  'device-connect',
  'device-disconnect',
  'device-forget',
  'device-select'
])

// The selected value
var value: number

function renderOption(dev: HIDDevice) {
  return dev.productName
}
</script>

<template>
  <!-- Keyboard selector -->
  <label for="selector">
    <strong>Select your device:</strong>
  </label>
  <div class="grid">
    <div>
      <select id="selector" v-model="value" @change="$emit('device-select', devices[value])">
        <template v-for="(dev, index) in devices" :key="dev.productName">
          <option :value="index">{{ renderOption(dev) }}</option>
        </template>
      </select>
    </div>
    <!-- Connect/disconnect button -->
    <button v-if="!connected" @click="$emit('device-connect')">Connect</button>
    <button v-if="connected" @click="$emit('device-disconnect')">Disconnect</button>
    <!-- Pair button -->
    <button @click="$emit('device-pair')">Pair new</button>
    <!-- Forget button -->
    <button @click="$emit('device-forget')">Forget</button>
  </div>
</template>