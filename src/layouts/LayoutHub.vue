<template>
  <div class="layoutHub">
    <HeaderLayout/>
    <ContentLayout />
  </div>
</template>

<script lang="ts" setup>
import HeaderLayout from './HeaderLayout.vue';
import ContentLayout from './ContentLayout.vue';
</script>

<style scoped>
.layoutHub {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
