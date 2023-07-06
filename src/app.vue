<script setup lang="ts">
import NavMenu from './components/NavMenu.vue'
import NavLink from './components/NavLink.vue'
import MainSection from './components/MainSection.vue'
import logo from './assets/img/logo.svg'
</script>

<template>
  <!-- Nav -->
  <NavMenu name="QMK live RGB" :logo="logo">
    <NavLink to="/">Home</NavLink>
    <NavLink to="/about">About</NavLink>
  </NavMenu>

  <!-- Main content -->
  <MainSection />
</template>

<style scoped></style>
