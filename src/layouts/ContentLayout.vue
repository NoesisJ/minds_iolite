<template>
  <div class="flex flex-row">
    <SidebarLayout class="h-full" />
    <!-- Main content -->
    <div
      class="w-[calc(100%-var(--sidebar-width))] h-full overflow-y-auto custom-scrollbar bg-[var(--material-bg-light)] text-white"
    >
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" class="h-full w-full" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarLayout from "./SidebarLayout.vue";
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.07s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
