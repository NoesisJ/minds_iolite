<template>
  <LayoutHub class="bg-[#f8f8fa] z-0" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, nextTick } from "vue";
import { useApp } from "@/hooks/useApp";
import LayoutHub from "@/layouts/LayoutHub.vue";
import { windowManager } from "@/app/window-manager";

const appStore = useApp();
const { isTauri } = storeToRefs(appStore);

let cleanupWindowState: (() => void) | null = null;

// 监听窗口最大化状态
onMounted(async () => {
  await nextTick(); // Must wait for the next tick to get the correct window state.
  if (isTauri) {
    // 设置窗口最大化状态监听
    cleanupWindowState = await windowManager.listenMaximizeState(
      (maximized) => {
        appStore.setMaximizedState(maximized);
      }
    );
  }
});

// 清理
onUnmounted(() => {
  cleanupWindowState?.();
});
</script>
