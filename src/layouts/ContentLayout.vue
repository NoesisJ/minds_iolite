<template>
  <div class="contentLayout flex flex-row mt-[4.75rem]">
    <SidebarLayout />
    <!-- Main content -->
     <!-- 这里的ml为sidebar的宽度 -->
     <!-- scale transition -->

  <router-view v-slot="{ Component }">
    <transition name="scale" mode="out-in" class="ml-[12.5rem]">
      <component :is="Component" />
    </transition>
  </router-view>
  </div>
</template>

<script setup lang="ts">
import SidebarLayout from "./SidebarLayout.vue";
</script>

<style lang="scss" scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}


.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>