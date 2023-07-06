<script setup lang="ts">
import CardItem from '@/components/CardItem.vue'
import KeyLayout from '@/components/KeyLayout.vue'
import moonlander from '@/assets/kbd/moonlander.json'
</script>

<template>
  <CardItem>
    <KeyLayout :layout="moonlander.layout" />
  </CardItem>
</template>

<style scoped></style>