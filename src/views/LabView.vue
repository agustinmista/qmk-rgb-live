<script setup lang="ts">
import ConfigEditor from '@/components/Keyboard/ConfigEditor.vue'
</script>

<template>
  <div class="custom-configurator-view">
    <Transition mode="out-in">
      <ConfigEditor />
    </Transition>
  </div>
</template>
