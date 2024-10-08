<template>
  <div class="header-layout flex items-center pl-[1.25rem] shadow-lg min-w-[760px]">
    <div
      class="flex w-full justify-between items-center p-2 h-[3rem]"
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
      <div class="space-x-6 ml-auto mr-20 text-[#b4b4db]" >
        <!-- // 11 -->
        <i class="pi pi-envelope pr-[1.5rem] border-r-[2px] border-[#1b1b38]"></i>
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
          icon="pi pi-expand"
          aria-label="Maximize"
          class="header-button"
          @click="
            () => {
              getCurrentWebviewWindow()
                .isMaximized()
                .then((maximized) => {
                  if (maximized) {
                    getCurrentWebviewWindow().unmaximize();
                  } else {
                    getCurrentWebviewWindow().maximize();
                  }
                });
            }
          "
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
import Button from "primevue/button";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
</script>

<style scoped>
.header-layout {
  user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 4.75rem;
  background-color: rgb(50, 50, 89);
}

.header-button {
  height: 2.125rem;
  width: 2.125rem;
  margin-right: 0.5rem;
  background-color: #a16eff;
  border: none;
}

/* .header-button:hover {
  background-color: #8a4fff;
} */
</style>
