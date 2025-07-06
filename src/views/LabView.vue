<script setup lang="ts">
import { type Ref, ref, onUnmounted } from 'vue'
import * as WebHID from '@/util/webhid'
import CardContainer from '@/components/Container/CardContainer.vue'
import ConfigEditor from '@/components/Keyboard/ConfigEditor.vue'

// Is this a supported browser?
let supported = WebHID.isSupported()
</script>

<template>
  <div class="custom-configurator-view">
    <Transition mode="out-in">
      <ConfigEditor />
    </Transition>
  </div>
</template>
