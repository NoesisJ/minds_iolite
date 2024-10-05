<template>
  <div class="contentLayout flex flex-row">
    <!-- Sidebar -->
    <SidebarLayout />
    <!-- Main content -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import SidebarLayout from "./SidebarLayout.vue";
</script>
