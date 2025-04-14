<template>
  <div
    class="header-layout z-10 shadow-md py-3 pl-4 pr-2 bg-[var(--material-red-dark)] flex justify-between items-center h-[var(--header-height)]"
    data-tauri-drag-region
  >
    <div class="flex flex-row items-center space-x-4">
      <a href="#" class="cursor-pointer">
        <Menu class="w-8 h-8 text-white" data-tauri-drag-region />
      </a>
      <a
        href="#"
        class="cursor-pointer border-l-1 border-[#1f1f1f] px-[1.25rem] py-0"
      >
        <h1 class="text-2xl text-white font-[500]" data-tauri-drag-region>
          Aikura
        </h1>
      </a>
    </div>

    <!-- Message,settings,etc -->
    <div class="flex flex-row items-center gap-1 ml-auto mr-10 text-white">
      <Mail
        class="cursor-pointer"
        style="font-size: 1.2rem"
        @click="openMessageWindow"
      />
      <Divider layout="vertical" />
      <Settings
        class="cursor-pointer"
        style="font-size: 1.2rem"
        @click="openSettingsWindow"
      />
    </div>

    <!-- Native Buttons -->
    <div v-if="isTauri" class="flex flex-row space-x-2">
      <HeaderButton aria-label="Minimize" @click="appStore.minimizeWindow">
        <template #icon>
          <Minus />
        </template>
      </HeaderButton>
      <HeaderButton
        aria-label="Maximize"
        @click="appStore.toggleMaximizeWindow"
      >
        <template #icon>
          <Minimize2 v-if="isMaximized" class="w-5 h-5" />
          <Maximize2 v-else class="w-5 h-5" />
        </template>
      </HeaderButton>
      <HeaderButton aria-label="Close" @click="appStore.closeWindow">
        <template #icon>
          <X />
        </template>
      </HeaderButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import {
  Bell,
  Mail,
  Settings,
  Minus,
  X,
  Minimize2,
  Maximize2,
  Menu,
} from "lucide-vue-next";
import HeaderButton from "@/components/HeaderButton.vue";
import Divider from "primevue/divider";
import { useApp } from "@/hooks/useApp";

const appStore = useApp();
const { isTauri, isMaximized } = storeToRefs(appStore);

const router = useRouter();

// 打开消息窗口
const openMessageWindow = () => {
  router.push("/functional/messages");
};
// 打开设置窗口
const openSettingsWindow = () => {
  router.push("/import");
};
</script>
