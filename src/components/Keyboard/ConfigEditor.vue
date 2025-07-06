<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { validateKeyboardConfig, loadKeyboardConfigFromLocalStorage, saveKeyboardConfigToLocalStorage } from '@/util/keyboardLoader'
import CardContainer from '@/components/Container/CardContainer.vue'

// The custom config
let configString: Ref<string> = ref('')

// Whether the custom config is valid JSON
let isValidConfig: Ref<boolean> = ref(false)

onMounted(() => {
  const kbd = loadKeyboardConfigFromLocalStorage()
  configString.value = kbd ? JSON.stringify(kbd, null, 2) : ''
  isValidConfig.value = kbd !== null;
})

// Watch for changes in the text area and save after 1s of inactivity
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function handleInput() {
  const kbd = validateKeyboardConfig(configString.value)
  isValidConfig.value = kbd !== null;
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => { autosave(); }, 1000);
}

function autosave() {
  const kbd = validateKeyboardConfig(configString.value)
  if (kbd) {
    console.log('Autosaving custom keyboard configuration ...')
    saveKeyboardConfigToLocalStorage(kbd)
  }
}
</script>

<template>
  <CardContainer>
    <template #header>Keyboard Configuration Editor</template>
    <span class="helper-text">Edit your custom keyboard configuration below:</span>
    <textarea v-model="configString" :class="{'valid': isValidConfig, 'invalid': !isValidConfig}" @input="handleInput"></textarea>
  </CardContainer>
</template>

<style scoped>
textarea {
  font-family: monospace;
  resize: vertical;
  height: 75vh;
  padding: 0;
  margin-bottom: 0rem;
}

.valid {
  border: 2px solid green;
}

.invalid {
  border: 2px solid red;
}

.helper-text {
  padding-left: 0;
}
</style>
