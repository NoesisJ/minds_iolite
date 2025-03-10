<template>
  <div class="flex flex-col h-full w-full">
    <HeaderLayout class="w-full" />
    <ContentLayout class="w-full h-[calc(100%-var(--header-height))]" />
  </div>
</template>

<script lang="ts" setup>
import HeaderLayout from "./HeaderLayout.vue";
import ContentLayout from "./ContentLayout.vue";
</script>
