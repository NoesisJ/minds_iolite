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
      <div class="flex flex-row space-x-6 ml-auto mr-20 mt-2 text-[#b4b4db]">
        <OverlayBadge
          :value="unreadMessages"
          severity="info"
          size="small"
          class="cursor-pointer"
          @click="openMessageWindow"
        >
          <i class="pi pi-envelope" style="font-size: 1.5rem"></i>
        </OverlayBadge>

        <Divider layout="vertical" />

        <OverlayBadge
          :value="unreadNotifications"
          severity="info"
          size="small"
          class="cursor-pointer"
          @click="openNotificationWindow"
        >
          <i class="pi pi-bell" style="font-size: 1.5rem"></i>
        </OverlayBadge>

        <Divider layout="vertical" />

        <OverlayBadge
          :value="unreadSettings"
          severity="info"
          size="small"
          class="cursor-pointer"
          @click="openSettingsWindow"
        >
          <i class="pi pi-cog" style="font-size: 1.5rem"></i>
        </OverlayBadge>
      </div>

      <!-- Native Buttons -->
      <div v-if="isTauri">
        <Button
          icon="pi pi-minus"
          aria-label="Minimize"
          class="native-button"
          @click="getCurrentWebviewWindow().minimize()"
        />
        <Button
          :icon="maximizeIcon"
          aria-label="Maximize"
          class="native-button"
          @click="toggleMaximize"
        />

        <Button
          icon="pi pi-times"
          aria-label="Close"
          class="native-button"
          @click="getCurrentWebviewWindow().close()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Button from "primevue/button";
import OverlayBadge from "primevue/overlaybadge";
import Divider from "primevue/divider";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { createGlobalState, useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

const router = useRouter();
const isTauri = (window as any).__TAURI__;
const maximizeIcon = ref("pi pi-expand"); // 初始图标
// 组件挂载时检查窗口最大化状态，并设置初始图标
onMounted(async () => {
  if (isTauri) {
    // console.log("Running in Tauri");
    const webviewWindow = getCurrentWebviewWindow();
    const isMaximized = await webviewWindow.isMaximized();
    maximizeIcon.value = isMaximized ? "pi pi-window-minimize" : "pi pi-expand";
  } else {
    // console.log("Running in browser");
  }
});

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
  return notifications.value.filter((notification) => !notification.read).length;
});
// 从 localStorage 读取未读设置数
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

// 切换窗口大小
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
  margin-right: 0.5rem;
  background-color: #a16eff;
  border: none;
  color: #ffffff;
}
.p-button.native-button:hover {
  border: none;
  color: #ffffff;
}
.p-button {
  --p-button-primary-hover-border-color: #38bcf6;
  --p-button-primary-hover-background: #38bcf6;
}
</style>
