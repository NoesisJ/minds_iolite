<template>
  <div class="bg-gray-800 rounded-lg shadow overflow-hidden">
    <div
      v-if="$slots.header"
      class="px-4 py-3 bg-gray-900 border-b border-gray-700 font-medium"
    >
      <slot name="header"></slot>
    </div>
    <div class="p-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// 简单的卡片容器组件
</script>
