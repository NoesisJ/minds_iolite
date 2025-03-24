<template>
  <div class="h-full w-full flex">
    <div class="functional w-[14rem]">
      <Button
        label="Mark All as Read"
        icon="pi pi-check mr-2 p-icon-info"
        severity="secondary"
        class="w-[12rem] h-[3rem] fixed left-4 top-10"
        @click="readAll"
      ></Button>
      <Button
        label="Filter Loved Messages"
        icon="pi pi-filter mr-2 p-icon-info"
        severity="secondary"
        class="w-[12rem] h-[3rem] fixed left-4 top-14"
        @click="toggleFilterLoved"
      ></Button>
    </div>
    <div
      class="h-[calc(100%+1.5rem)] mt-[-0.75rem] relative overflow-y-scroll flex-grow scrollbar-hide"
    >
      <div class="scroll-gradient top"></div>
      <div class="scroll-gradient bottom"></div>
      <Toast />

      <transition-group name="fade-move" tag="div" class="message-list py-6">
        <div
          v-for="message in filteredMessages"
          :key="message.id"
          class="w-[40rem] mx-auto"
        >
          <!-- 动态设置 Panel 的 class，未读消息使用未读样式 -->
          <Panel
            :class="message.read ? 'read-message' : 'unread-message'"
            class="mb-2"
            toggleable
          >
            <template #header>
              <div class="flex items-center gap-2">
                <Avatar :image="message.avatar" shape="circle" />
                <span class="font-bold">{{ message.name }}</span>
              </div>
            </template>
            <template #footer>
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                  <Button
                    icon="pi pi-check"
                    :style="{
                      color: message.read ? '#4caf50' : '#ff5722',
                      borderRadius: '50%',
                      padding: '0.5rem',
                      height: '2rem',
                      width: '2rem',
                    }"
                    severity="secondary"
                    rounded
                    text
                    @click="markAsRead(message)"
                  ></Button>
                  <Button
                    :icon="
                      message.loved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'
                    "
                    :style="{
                      color: '#ff5722',
                      borderRadius: '50%',
                      padding: '0.5rem',
                      height: '2rem',
                      width: '2rem',
                    }"
                    severity="secondary"
                    rounded
                    text
                    @click="toggleLoved(message)"
                  ></Button>
                </div>
                <span class="text-surface-500 dark:text-surface-400">{{
                  formatTimeDiff(message.time)
                }}</span>
              </div>
            </template>
            <template #icons>
              <Button icon="pi pi-cog" severity="secondary" rounded text />
              <Menu ref="menu" id="config_menu" :model="items" popup />
            </template>
            <p class="m-0">
              {{ message.content }}
            </p>
          </Panel>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createGlobalState, useStorage } from "@vueuse/core";
import { ref, computed, watch } from "vue";
import Toast from "primevue/toast";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Panel from "primevue/panel";
import Menu from "primevue/menu";

const items = ref([
  { label: "Option 1", icon: "pi pi-refresh" },
  { label: "Option 2", icon: "pi pi-times" },
]);

interface Message {
  id: number;
  avatar: string;
  name: string;
  time: Date;
  content: string;
  read: boolean;
  loved: boolean;
}

// 使用 createGlobalState 定义全局状态，存储整个消息列表
const useState = createGlobalState(() =>
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
const state = useState(); // 使用 localStorage 存储的消息列表

// 收藏过滤开关
const showLovedOnly = ref(false);

// 将 localStorage 中的消息列表恢复到 messages
const messages = ref(state.value);

// 根据消息的已读状态进行排序，未读消息置顶
const sortedMessages = computed(() => {
  return messages.value
    .slice()
    .sort(
      (a, b) =>
        (a.read ? 1 : 0) - (b.read ? 1 : 0) ||
        new Date(b.time).getTime() - new Date(a.time).getTime()
    );
});

// 计算筛选后的消息列表
const filteredMessages = computed(() => {
  return showLovedOnly.value
    ? sortedMessages.value.filter((message) => message.loved)
    : sortedMessages.value;
});

// 标记所有消息为已读
const readAll = () => {
  messages.value.forEach((message) => {
    if (!message.read) {
      message.read = true;
    }
  });
  state.value = messages.value; // 同步到 localStorage
};

// 切换筛选收藏消息
const toggleFilterLoved = () => {
  showLovedOnly.value = !showLovedOnly.value;
};

// 标记消息为已读
const markAsRead = (message: Message) => {
  message.read = true;
  state.value = messages.value; // 同步到 localStorage
};

// 切换收藏状态
const toggleLoved = (message: Message) => {
  message.loved = !message.loved;
  state.value = messages.value; // 同步到 localStorage
};

// 计算时间差并格式化显示
const formatTimeDiff = (time: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(time).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    const hours = diffHours % 24;
    return `${diffDays} days ${hours} hours ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} weeks ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} months ago`;
  } else {
    return `${diffYears} years ago`;
  }
};

// 监听 messages 列表的变化，并动态更新未读数量
watch(
  messages,
  (newMessages) => {
    state.value = newMessages; // 同步到 localStorage
  },
  { deep: true } // 深度监听，确保内部的 read 状态变化时也能触发
);
</script>

<style scoped>
/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 1s ease,
    transform 0.5s ease,
    background-color 1s ease,
    border-left 1s ease; /* 添加背景色的平滑过渡 */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-from,
.fade-enter-to {
  opacity: 1;
}

.fade-move-enter-active,
.fade-move-leave-active {
  transition:
    all 0.5s ease,
    background-color 1s ease;
}

.fade-move-enter,
.fade-move-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 移动过渡 */
.fade-move-move {
  transition:
    transform 0.5s,
    background-color 1s ease,
    border-left 1s ease; /* 包含背景色的过渡 */
}

/* 设置未读消息的背景颜色 */
.unread-message {
  background-color: #231340;
  border-left: 4px solid #ff5722;
}

/* 设置已读消息的背景颜色 */
.read-message {
  background-color: #18181b;
  border-left: 4px solid #f5f5f5;
  transition:
    background-color 1s ease,
    border-left 1s ease; /* 添加背景颜色变化的过渡 */
}

.scroll-gradient {
  position: fixed;
  width: 100%;
  height: 50px; /* 渐隐区域的高度 */
  pointer-events: none; /* 使渐变区域不可点击 */
  z-index: 1; /* 确保渐变在内容上方 */
}

.scroll-gradient.top {
  top: -100;
  background: linear-gradient(to bottom, var(--material-bg-light), transparent);
}

.scroll-gradient.bottom {
  bottom: 0;
  background: linear-gradient(to top, var(--material-bg-light), transparent);
}
</style>
