<template>
  <div class="contentLayout flex flex-row">
    <SidebarLayout />
    <!-- Main content -->
    <router-view v-slot="{ Component }">
      <transition name="slide-fade" mode="out-in" class="">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import SidebarLayout from "./SidebarLayout.vue";
</script>

<style scoped>
/* 动画的总持续时间和效果 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.07s ease;
}

/* 进入动画 */
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px); /* 从上向下 */
}

/* 离开动画 */
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px); /* 向下移出 */
}
</style>
