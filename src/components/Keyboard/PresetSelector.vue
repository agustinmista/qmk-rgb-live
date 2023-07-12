<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'

const props = defineProps<{
  keyboard: Keyboard,
  colors: ColorMap
}>()

const emit = defineEmits([
  'preset-selector-load'
])

// The saved presets
let presets: Ref<Record<string, ColorMap>> = ref({})

onMounted(loadPresetsFromLocalStorage)

// The currently selected preset
let selectedPreset: Ref<string | null> = ref(null)

// Load and save presets from local storage

function savePresetsToLocalStorage() {
  const key = `presets_${props.keyboard!.id}`
  console.log('Saving preset data', { key, presets: presets.value })
  // We need to convert inner Maps to arrays of tuples because of reasons
  let obj: Record<string, Array<[string, HexColor]>> = {}
  Object.keys(presets.value).forEach(preset => {
    obj[preset] = Array.from(presets.value[preset])
  })
  const value = JSON.stringify(obj)
  localStorage.setItem(key, value)
}

function loadPresetsFromLocalStorage() {
  const key = `presets_${props.keyboard!.id}`
  const value = localStorage.getItem(key)
  // We need to convert inner arrays of tuples into Maps because of reasons
  let obj: Record<string, Array<[string, HexColor]>> = value ? JSON.parse(value) : {}
  presets.value = {}
  Object.keys(obj).forEach(preset => {
    presets.value[preset] = new Map(obj[preset])
  })
  console.log('Read presets data', { key, presets: presets.value })
}

// The saving modal

// Should the modal be opened?
let saving: Ref<boolean> = ref(false)

// The preset name the user inputs in the modal
let presetName: string = ''

function openSaveModal() {
  presetName = ''
  saving.value = true
}
function closeSaveModal() {
  saving.value = false
}

function savePresetAndCloseModal(name: string) {
  presets.value[name] = new Map(props.colors)
  selectedPreset.value = name
  savePresetsToLocalStorage()
  closeSaveModal()
}

function deletePreset(name: string) {
  delete presets.value[name]
  selectedPreset.value = null
  savePresetsToLocalStorage()
}

function loadPreset(name: string) {
  console.log('Loading preset', name)
  let preset = presets.value[name]
  emit('preset-selector-load', preset)
}
</script>

<template>
  <!-- Preset selector -->
  <div class="button-grid">
    <div class="button-grid-header">
      <select id="preset-selector" v-model="selectedPreset" @change="loadPreset(selectedPreset!)">
        <option disabled selected value="null">Select a preset</option>
        <template v-for="preset in Object.keys(presets)" :key="preset">
          <option :value="preset">{{ preset }}</option>
        </template>
      </select>
    </div>
    <div class="button-grid-b1">
      <button @click="loadPreset(selectedPreset!)" :disabled="!selectedPreset">Load</button>
    </div>
    <div class="button-grid-b2">
      <button class="green" @click="openSaveModal" :disabled="colors.size === 0">Save</button>
    </div>
    <div class="button-grid-b3">
      <button class="red" @click="deletePreset(selectedPreset!)" :disabled="!selectedPreset">Delete</button>
    </div>
  </div>

  <!-- Saving modal -->
  <Transition>
    <dialog v-if="saving" open>
      <article>
        <h4>Name your new preset</h4>
        <div class="grid">
          <input type="text" v-model="presetName">
        </div>
        <footer>
          <a href="#" role="button" class="secondary" @click="closeSaveModal">Cancel</a>
          <a href="#"   role="button" class="green" @click="savePresetAndCloseModal(presetName)">Save</a>
        </footer>
      </article>
    </dialog>
  </Transition>

</template>