<template>
  <div class="header-layout z-10 shadow-xl">
    <div
      class="h-[4.75rem] p-2 pl-[1.25rem] bg-[#323259] flex justify-between items-center"
      data-tauri-drag-region
    >
      <div class="flex flex-row items-center space-x-8 pl-1">
        <!-- Page Name -->
        <i
          class="pi pi-bars pr-[2rem] border-r-[2px] border-[#1b1b38] text-[#b4b4db]"
          data-tauri-drag-region
          style="font-size: 1.5rem"
        ></i>
        <h1
          class="text-large"
          style="font-size: 1.5rem; font-family: inter; font-weight: 400"
          data-tauri-drag-region
        >
          吉甲终端
        </h1>
      </div>

      <!-- Message,settings,etc -->
      <div class="space-x-6 ml-auto mr-20 text-[#b4b4db]">
        <i
          class="pi pi-envelope pr-[1.5rem] border-r-[2px] border-[#1b1b38]"
        ></i>
        <i class="pi pi-bell pr-[1.5rem] border-r-[2px] border-[#1b1b38]"></i>
        <i class="pi pi-cog"></i>
      </div>

      <!-- Native Buttons -->
      <div>
        <Button
          icon="pi pi-minus"
          aria-label="Minimize"
          class="header-button"
          @click="getCurrentWebviewWindow().minimize()"
        />
        <Button
          :icon="maximizeIcon"
          aria-label="Maximize"
          class="header-button"
          @click="toggleMaximize"
        />

        <Button
          icon="pi pi-times"
          aria-label="Close"
          class="header-button"
          @click="getCurrentWebviewWindow().close()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

const maximizeIcon = ref("pi pi-expand"); // 初始图标

// 函数来切换窗口大小
const toggleMaximize = async () => {
  const window = getCurrentWebviewWindow();
  const isMaximized = await window.isMaximized(); // 等待 Promise 完成

  if (isMaximized) {
    window.unmaximize();
    maximizeIcon.value = "pi pi-expand";
  } else {
    window.maximize();
    maximizeIcon.value = "pi pi-clone";
  }
};

// 组件挂载时检查窗口最大化状态，并设置初始图标
onMounted(async () => {
  const window = getCurrentWebviewWindow();
  const isMaximized = await window.isMaximized();
  maximizeIcon.value = isMaximized ? "pi pi-window-minimize" : "pi pi-expand";
});
</script>

<style scoped>
/* .header-layout {
  user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 4.75rem;
  background-color: #323259;
} */

.header-button {
  height: 2.125rem;
  width: 2.125rem;
  margin-right: 0.5rem;
  background-color: #a16eff;
  border: none;
}
</style>
