<template>
  <div class="flex flex-col h-screen w-screen">
    <HeaderLayout />
    <ContentLayout class="flex-1" />
  </div>
</template>

<script lang="ts" setup>
import HeaderLayout from "./HeaderLayout.vue";
import ContentLayout from "./ContentLayout.vue";
</script>
