<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Greet from "./components/Greet.vue";
import Button from 'primevue/button';
import Dashboard from "./views/Dashboard.vue";

</script>

<template>
  <div id="app">
    <h1>Welcome to Tauri!</h1>
    <Button label="Info" severity="info" />
    <p>Click on the Tauri, Vite, and Vue logos to learn more.</p>
    <i class="pi pi-spin pi-eye" style="font-size: 1.5rem;color:red"></i>
    <Greet />
    <Dashboard />
    <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  </div>
</template>
