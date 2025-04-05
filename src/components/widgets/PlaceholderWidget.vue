<template>
  <div
    class="placeholder-widget p-4 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
  >
    <div class="text-center text-gray-500 dark:text-gray-400">
      <i class="pi pi-box text-2xl mb-2"></i>
      <div>{{ title || "组件占位符" }}</div>
      <div class="text-xs mt-1">{{ description || "此组件正在开发中" }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  description: String,
});
</script>
