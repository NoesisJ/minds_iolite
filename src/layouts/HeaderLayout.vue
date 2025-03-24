<template>
  <div
    class="header-layout z-10 shadow-md py-3 pl-6 pr-4 bg-[var(--material-red)] flex justify-between items-center h-[var(--header-height)]"
    data-tauri-drag-region
  >
    <div class="flex flex-row items-center space-x-6">
      <a href="#" class="cursor-pointer">
        <i
          class="pi pi-bars text-white"
          data-tauri-drag-region
          style="font-size: 1.5rem"
        ></i>
      </a>
      <a
        href="#"
        class="cursor-pointer border-l-1 border-[#1f1f1f] px-[1.25rem] py-0"
      >
        <h1 class="text-2xl text-white font-[500]" data-tauri-drag-region>
          Minds-Iolite
        </h1>
      </a>
    </div>

    <!-- Message,settings,etc -->
    <div class="flex flex-row items-center space-x-3 ml-auto mr-20 text-white">
      <i
        class="pi pi-envelope cursor-pointer"
        style="font-size: 1.2rem"
        @click="openMessageWindow"
      ></i>

      <Divider layout="vertical" />
      <i
        class="pi pi-bell cursor-pointer"
        style="font-size: 1.2rem"
        @click="openNotificationWindow"
      ></i>

      <Divider layout="vertical" />
      <i
        class="pi pi-cog cursor-pointer"
        style="font-size: 1.2rem"
        @click="openSettingsWindow"
      ></i>
    </div>

    <!-- Native Buttons -->
    <div v-if="isTauri" class="flex flex-row space-x-3">
      <Button
        icon="pi pi-minus"
        aria-label="Minimize"
        class="native-button"
        @click="appStore.minimizeWindow"
      />
      <Button
        :icon="isMaximized ? 'pi pi-window-minimize' : 'pi pi-expand'"
        aria-label="Maximize"
        class="native-button"
        @click="appStore.toggleMaximizeWindow"
      />

      <Button
        icon="pi pi-times"
        aria-label="Close"
        class="native-button"
        @click="appStore.closeWindow"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";
import OverlayBadge from "primevue/overlaybadge";
import Divider from "primevue/divider";
import { createGlobalState, useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

import { useApp } from "@/hooks/useApp";
import { storeToRefs } from "pinia";

const appStore = useApp();
const { isTauri, isMaximized } = storeToRefs(appStore);

const router = useRouter();
// 组件挂载时检查窗口最大化状态，并设置初始图标

// 从 localStorage 读取整个消息队列
const useMessagesState = createGlobalState(() =>
  useStorage("messages", [
    {
      id: 1,
      avatar: "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png",
      name: "Amy Elsner",
      time: new Date(Date.now() - 60 * 60 * 1000),
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      read: false,
      loved: false,
    },
    {
      id: 2,
      avatar:
        "https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png",
      name: "John Doe",
      time: new Date(Date.now() - 30 * 60 * 1000),
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      read: true,
      loved: false,
    },
    {
      id: 3,
      avatar:
        "https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png",
      name: "Anna Johnson",
      time: new Date(Date.now() - 15 * 60 * 1000),
      content: "Excepteur sint occaecat cupidatat non proident.",
      read: false,
      loved: true,
    },
    {
      id: 4,
      avatar:
        "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      name: "Monica Smith",
      time: new Date(Date.now() - 5 * 60 * 1000),
      content: "Eos eu verear antiopam, hinc partem ei est.",
      read: true,
      loved: false,
    },
    {
      id: 5,
      avatar:
        "https://primefaces.org/cdn/primevue/images/organization/walter.jpg",
      name: "Michael Douglas",
      time: new Date(Date.now() - 2 * 60 * 1000),
      content: "Incididunt ut labore et dolore magna aliqua.",
      read: false,
      loved: false,
    },
  ])
);
const messages = useMessagesState(); // 使用 localStorage 中存储的消息队列
const unreadMessages = computed(() => {
  return messages.value.filter((message) => !message.read).length;
});

// 从 localStorage 读取未读通知数
const useNotificationsState = createGlobalState(() =>
  useStorage("notifications", [
    {
      id: 1,
      avatar: "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png",
      name: "Amy Elsner",
      time: new Date(Date.now() - 60 * 60 * 1000),
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      read: false,
      loved: false,
    },
    {
      id: 2,
      avatar:
        "https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png",
      name: "John Doe",
      time: new Date(Date.now() - 30 * 60 * 1000),
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      read: true,
      loved: false,
    },
    {
      id: 3,
      avatar:
        "https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png",
      name: "Anna Johnson",
      time: new Date(Date.now() - 15 * 60 * 1000),
      content: "Excepteur sint occaecat cupidatat non proident.",
      read: false,
      loved: true,
    },
    {
      id: 4,
      avatar:
        "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      name: "Monica Smith",
      time: new Date(Date.now() - 5 * 60 * 1000),
      content: "Eos eu verear antiopam, hinc partem ei est.",
      read: true,
      loved: false,
    },
    {
      id: 5,
      avatar:
        "https://primefaces.org/cdn/primevue/images/organization/walter.jpg",
      name: "Michael Douglas",
      time: new Date(Date.now() - 2 * 60 * 1000),
      content: "Incididunt ut labore et dolore magna aliqua.",
      read: false,
      loved: false,
    },
  ])
);
const notifications = useNotificationsState(); // 使用 localStorage 中存储的通知队列
const unreadNotifications = computed(() => {
  return notifications.value.filter((notification) => !notification.read)
    .length;
});
// 从 localStorage 读取未读设置数
// C-spell-checker:disable
const useSettingsState = createGlobalState(() =>
  useStorage("settings", [
    {
      id: 1,
      avatar: "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png",
      name: "Amy Elsner",
      time: new Date(Date.now() - 60 * 60 * 1000),
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      read: false,
      loved: false,
    },
    {
      id: 2,
      avatar:
        "https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png",
      name: "John Doe",
      time: new Date(Date.now() - 30 * 60 * 1000),
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      read: true,
      loved: false,
    },
    {
      id: 3,
      avatar:
        "https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png",
      name: "Anna Johnson",
      time: new Date(Date.now() - 15 * 60 * 1000),
      content: "Excepteur sint occaecat cupidatat non proident.",
      read: false,
      loved: true,
    },
    {
      id: 4,
      avatar:
        "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp",
      name: "Monica Smith",
      time: new Date(Date.now() - 5 * 60 * 1000),
      content: "Eos eu verear antiopam, hinc partem ei est.",
      read: true,
      loved: false,
    },
    {
      id: 5,
      avatar:
        "https://primefaces.org/cdn/primevue/images/organization/walter.jpg",
      name: "Michael Douglas",
      time: new Date(Date.now() - 2 * 60 * 1000),
      content: "Incididunt ut labore et dolore magna aliqua.",
      read: false,
      loved: false,
    },
  ])
);
const settings = useSettingsState(); // 使用 localStorage 中存储的设置队列
const unreadSettings = computed(() => {
  return settings.value.filter((setting) => !setting.read).length;
});
// 从 localStorage 获取未读消息、通知和设置数
// const fetchUnread = () => {
//   const messages = localStorage.getItem("unreadMessages");
//   const notifications = localStorage.getItem("unreadNotifications");
//   const settings = localStorage.getItem("unreadSettings");

//   // 读取到的值如果存在，就更新 ref 的值；如果不存在，保持默认值
//   unreadMessages.value = messages ? parseInt(messages) : unreadMessages.value;
//   unreadNotifications.value = notifications
//     ? parseInt(notifications)
//     : unreadNotifications.value;
//   unreadSettings.value = settings ? parseInt(settings) : unreadSettings.value;
// };

// 打开消息窗口
const openMessageWindow = () => {
  router.push("/functional/messages");
};
// 打开通知窗口
const openNotificationWindow = () => {
  router.push("/functional/notifications");
};
// 打开设置窗口
const openSettingsWindow = () => {
  router.push("/functional/settings");
};
</script>

<style scoped>
.native-button {
  height: 2.125rem;
  width: 2.125rem;
  background-color: var(--material-item-header);
  border: none;
  color: #ffffff;
}
.p-button.native-button:hover {
  border: none;
  color: #ffffff;
}
.p-button {
  --p-button-primary-active-background: var(--material-item-bg-hover);
  --p-button-primary-hover-background: var(--material-item-bg-hover);
}

.p-badge.p-badge-info {
  --p-badge-info-background: var(--material-item-bg);
  --p-badge-info-color: white;
}
</style>
