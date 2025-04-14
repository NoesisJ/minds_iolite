<template>
  <LayoutHub class="z-0" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import LayoutHub from "@/layouts/LayoutHub.vue";
import { initApp } from "@/utils/initApp";

onMounted(() => {
  const cleanup = initApp();
  onUnmounted(cleanup);
});
</script>
