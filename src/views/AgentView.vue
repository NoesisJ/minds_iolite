<template>
  <div class="h-full flex flex-col text-white">
    <!-- 顶部标题栏 -->
    <header class="relative flex items-center px-6 py-5 gap-4">
      <!-- 下拉历史记录按钮 -->
      <DropdownMenu
        :items="chatHistoryItems"
        :callback="selectChat"
        class="history-selector"
      >
        <div class="flex items-center">
          <span>{{ currentChatTitle }}</span>
        </div>
        <template #action="{ item }">
          <Delete
            class="w-4 h-4 text-[#c96442] cursor-pointer hover:text-[#ff0000]"
            @click.stop="deleteChat(item.value)"
          />
        </template>
      </DropdownMenu>

      <!-- 添加新对话 -->
      <button
        class="bg-[#c96442] text-[#ffeaea] rounded-full p-2 transition-colors duration-300 hover:bg-[#ff5100]"
        @click="chatStore.createNewChat()"
      >
        <Plus class="w-6 h-6" />
      </button>
    </header>

    <!-- 消息展示区 -->
    <main class="flex-1 overflow-y-auto p-4 flex flex-col">
      <!-- 欢迎消息 -->
      <div
        v-if="messages.length === 0"
        class="flex-1 flex flex-col items-center justify-center"
      >
        <h2 class="text-3xl font-medium mb-6">有什么可以帮忙的?</h2>
      </div>

      <!-- 消息列表区域 -->
      <div
        v-else
        class="w-full max-w-3xl mx-auto space-y-6"
        ref="messagesContainer"
      >
        <MessageItem
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
      </div>
    </main>

    <!-- 底部输入区 -->
    <footer class="p-4 w-full relative">
      <div
        class="relative max-w-3xl mx-auto bg-[#353535] rounded-2xl border border-[#65645f] py-3 px-6"
      >
        <!-- 输入框 -->
        <textarea
          ref="textareaRef"
          v-model="userInput"
          placeholder="询问任何问题"
          class="w-full min-h-[40px] max-h-[400px] border-0 text-white pr-10 py-2 outline-none custom-scrollbar resize-none"
          @keydown.enter.exact.prevent="sendMessage"
          @input="adjustTextareaHeight"
          style="overflow-y: hidden"
        />

        <!-- 发送按钮 -->
        <button
          class="absolute bottom-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
          :class="sendButtonClass"
          :disabled="!canSendMessage"
          @click="sendMessage"
        >
          <Send class="w-4 h-4" />
        </button>
      </div>
    </footer>

    <!-- Toast组件 -->
    <Toast ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { storeToRefs } from "pinia";
import DropdownMenu from "@/components/ui/DropDown.vue";
import { Delete, Plus, Send } from "lucide-vue-next";
import { useMessageStore } from "@/stores/messageStore";
import { useChatStore } from "@/stores/chatStore";
import MessageItem from "@/components/chat/MessageItem.vue";
import Toast from "@/components/ui/Toast.vue";
import { chatService } from "@/services/chatService";

// 引用和状态
const toast = ref<InstanceType<typeof Toast> | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const userInput = ref<string>("");

// 使用状态管理
const messageStore = useMessageStore();
const chatStore = useChatStore();
const { messages } = storeToRefs(messageStore);
const { chatHistory, selectedChat } = storeToRefs(chatStore);

// 计算属性
const chatHistoryItems = computed(() =>
  chatHistory.value.map((item) => ({ label: item.title, value: item }))
);

const currentChatTitle = computed(() =>
  selectedChat.value ? selectedChat.value.title : "AI助手"
);

const canSendMessage = computed(() => userInput.value.trim().length > 0);

const sendButtonClass = computed(() =>
  canSendMessage.value
    ? "bg-[#c96442] text-white"
    : "bg-[#7d4a38] text-[#989897] cursor-not-allowed"
);

// 方法
const adjustTextareaHeight = () => {
  if (!textareaRef.value) return;

  textareaRef.value.style.height = "auto";
  const newHeight = Math.min(textareaRef.value.scrollHeight, 400);
  textareaRef.value.style.height = `${newHeight}px`;
  textareaRef.value.style.overflowY = newHeight >= 400 ? "auto" : "hidden";
};

const selectChat = async (item: { value: any }) => {
  chatStore.setSelectedChat(item.value);
  try {
    messageStore.loadMessages(item.value.id);
  } catch (error) {
    showError("加载聊天记录失败，请稍后再试");
    console.error("Error loading chat messages:", error);
  }
};

const sendMessage = async () => {
  if (!canSendMessage.value) return;

  try {
    console.log("Sending message:", userInput.value);
    // 先添加用户消息到界面
    const userMessage = messageStore.addUserMessage(userInput.value);

    // 清空输入框并重置高度
    userInput.value = "";
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = "40px";
      }
    });

    // 发送消息到服务器
    const response = await chatService.sendMessage({
      stream: false,
      session_id: selectedChat.value?.id ?? "default",
      message: userMessage.content,
    });

    // 处理响应
    messageStore.addAIMessage(response.response);
  } catch (error) {
    showError("发送消息失败，请稍后再试");
    console.error("Error sending message:", error);
  }
};

const deleteChat = async (chat: any) => {
  try {
    await chatStore.deleteChat(chat.id);
  } catch (error) {
    showError("删除聊天记录失败，请稍后再试");
    console.error("Error deleting chat:", error);
  }
};

const showError = (message: string) => {
  toast.value?.add({
    severity: "error",
    summary: "错误",
    detail: message,
    life: 3000,
  });

  messageStore.addSystemMessage(message, "error");
};

// 生命周期钩子
onMounted(() => {
  adjustTextareaHeight();
  // 默认加载最新的聊天记录或创建新聊天
  if (chatHistory.value.length > 0) {
    selectChat({ value: chatHistory.value[0] });
  } else {
    chatStore.createNewChat();
  }
});

// 监听器
watch(userInput, () => {
  nextTick(adjustTextareaHeight);
});

watch(
  messages,
  () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop =
          messagesContainer.value.scrollHeight;
      }
    });
  },
  { deep: true }
);
</script>
