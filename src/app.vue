<script setup lang="ts">
import NavMenu from '@/components/Nav/NavMenu.vue'
import NavLink from '@/components/Nav/NavLink.vue'
import MainSection from '@/components/Section/MainSection.vue'
import logo from '@/assets/img/logo.svg'
</script>

<template>
  <!-- Nav -->
  <NavMenu name="QMK live RGB configurator" :logo="logo">
    <NavLink to="/">Home</NavLink>
    <NavLink to="/about">About</NavLink>
  </NavMenu>

  <!-- Main content -->
  <MainSection />
</template>

<style scoped></style>
