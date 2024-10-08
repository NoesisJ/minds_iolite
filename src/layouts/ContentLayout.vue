<template>
  <div class="contentLayout flex flex-row mt-[4.75rem]">
    <SidebarLayout />
    <!-- Main content -->
     <!-- 这里的ml为sidebar的宽度 -->
    <RouterView class="ml-[12.5rem]"/>
  </div>
</template>

<script setup lang="ts">
import SidebarLayout from "./SidebarLayout.vue";
</script>
