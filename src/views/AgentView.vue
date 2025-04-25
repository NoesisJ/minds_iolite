<template>
  <div
    class="h-full flex flex-col bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white"
  >
    <!-- 顶部标题栏 -->
    <header
      class="relative flex items-center px-3 py-2 border-b border-[#3a3a3a] bg-[#252525] backdrop-blur-sm"
    >
      <div class="flex items-center justify-between w-full mx-auto">
        <!-- 下拉历史记录按钮 -->
        <DropdownMenu
          :items="chatHistoryItems"
          :callback="selectChat"
          class="w-56"
        >
          <div
            class="flex items-center gap-2 rounded-lg hover:bg-[#353535] transition-colors"
          >
            <MessageSquare class="w-5 h-5 text-[#c96442]" />
            <span class="text-lg font-medium truncate max-w-[150px]">{{
              currentChatTitle
            }}</span>
          </div>
          <template #action="{ item }">
            <Trash2
              class="w-4 h-4 text-[#c96442] cursor-pointer hover:text-[#ff0000]"
              @click.stop="deleteChat(item.value)"
            />
          </template>
        </DropdownMenu>

        <div class="flex items-center gap-3">
          <!-- 添加新对话 -->
          <button
            class="bg-[#c96442] text-[#ffeaea] rounded-full p-2 transition-all duration-300 hover:bg-[#ff5100] hover:shadow-lg hover:shadow-[#c96442]/20 transform hover:scale-105"
            @click="chatStore.createNewChat()"
            title="新建对话"
          >
            <Plus class="w-5 h-5" />
          </button>

          <!-- 设置按钮 -->
          <button
            class="bg-[#353535] text-gray-300 rounded-full p-2 transition-all duration-300 hover:bg-[#454545] hover:text-white"
            title="设置"
          >
            <Settings class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

    <!-- 消息展示区 -->
    <main
      class="flex-1 overflow-y-auto py-6 px-6 flex flex-col custom-scrollbar bg-[url('/images/chat-bg-pattern.png')] bg-opacity-5"
      ref="messagesContainer"
    >
      <!-- 欢迎消息 -->
      <div
        v-if="messages.length === 0"
        class="flex-1 flex flex-col items-center justify-center"
      >
        <div
          class="text-center p-8 rounded-2xl bg-[#2a2a2a]/70 backdrop-blur-sm border border-[#3a3a3a] shadow-lg max-w-md"
        >
          <Bot class="w-16 h-16 mx-auto text-[#c96442] mb-6" />
          <h2 class="text-3xl font-medium mb-4">有什么可以帮忙的?</h2>
          <p class="text-gray-400 mb-6">
            我可以回答问题、提供信息、帮助解决问题...
          </p>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="(suggestion, index) in suggestions"
              :key="index"
              @click="useSuggestion(suggestion)"
              class="p-3 rounded-xl bg-[#353535] hover:bg-[#454545] text-sm text-left transition-colors duration-300 border border-[#454545]"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>

      <!-- 消息列表区域 -->
      <div v-else class="w-full max-w-3xl mx-auto space-y-6">
        <TransitionGroup name="message-fade">
          <MessageItem
            v-for="message in messages"
            :key="message.id"
            :message="message"
            @retry="retryMessage()"
            @copy="copyMessage(message)"
          />
        </TransitionGroup>

        <!-- 打字指示器 -->
        <div
          v-if="isTyping"
          class="flex items-center gap-2 p-4 rounded-lg bg-[#2a2a2a]/70"
        >
          <div class="flex space-x-1">
            <div
              class="w-2 h-2 rounded-full bg-[#c96442] animate-bounce"
              style="animation-delay: 0.1s"
            ></div>
            <div
              class="w-2 h-2 rounded-full bg-[#c96442] animate-bounce"
              style="animation-delay: 0.2s"
            ></div>
            <div
              class="w-2 h-2 rounded-full bg-[#c96442] animate-bounce"
              style="animation-delay: 0.3s"
            ></div>
          </div>
          <span class="text-sm text-gray-400">AI正在思考...</span>
        </div>
      </div>
    </main>

    <!-- 底部输入区 -->
    <footer
      class="px-6 pb-2 pt-4 w-full relative border-t border-[#3a3a3a] bg-[#252525]"
    >
      <div class="max-w-3xl mx-auto">
        <div
          class="relative bg-[#353535] rounded-2xl border border-[#65645f] hover:border-[#c96442] focus-within:border-[#c96442] transition-colors duration-300 shadow-lg"
        >
          <!-- 输入框 -->
          <textarea
            ref="textareaRef"
            v-model="userInput"
            placeholder="询问任何问题..."
            class="w-full min-h-[100px] max-h-[400px] border-0 text-white p-4 pr-12 outline-none custom-scrollbar resize-none bg-transparent"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="newLine"
            @input="adjustTextareaHeight"
            style="overflow-y: hidden"
          />

          <!-- 发送按钮 -->
          <button
            class="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
            :class="sendButtonClass"
            :disabled="!canSendMessage"
            @click="sendMessage"
          >
            <Send
              class="w-5 h-5"
              :class="{ 'transform translate-x-0.5': canSendMessage }"
            />
          </button>
        </div>

        <div class="mt-2 text-xs text-center text-gray-500">
          按 Enter 发送消息，Shift + Enter 换行
        </div>
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
import {
  MessageSquare,
  Trash2,
  Plus,
  Send,
  Settings,
  Bot,
} from "lucide-vue-next";
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
const isTyping = ref<boolean>(false);

// 常用问题建议
const suggestions = ref([
  "推荐几本经典科幻小说",
  "如何提高英语口语能力?",
  "解释量子计算的基本原理",
  "帮我写一封求职邮件",
]);

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
    ? "bg-[#c96442] text-white hover:bg-[#ff5100] hover:shadow-lg hover:shadow-[#c96442]/30"
    : "bg-[#454545] text-[#989897] cursor-not-allowed"
);

// 方法
const adjustTextareaHeight = () => {
  if (!textareaRef.value) return;

  textareaRef.value.style.height = "60px";
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
        textareaRef.value.style.height = "60px";
      }
    });

    // 显示打字指示器
    isTyping.value = true;

    // 发送消息到服务器
    const response = await chatService.sendMessage({
      stream: false,
      session_id: selectedChat.value?.id ?? "default",
      message: userMessage.content,
    });

    // 处理响应
    isTyping.value = false;
    messageStore.addAIMessage(response.response);

    // 如果是第一条消息，自动更新聊天标题
    if (messages.value.length <= 2 && selectedChat.value) {
      const title =
        userMessage.content.slice(0, 20) +
        (userMessage.content.length > 20 ? "..." : "");
      chatStore.updateChatTitle(selectedChat.value.id, title);
    }
  } catch (error) {
    isTyping.value = false;
    showError("发送消息失败，请稍后再试");
    console.error("Error sending message:", error);
  }
};

const newLine = () => {
  if (!textareaRef.value) return;
  const cursorPosition = textareaRef.value.selectionStart;
  userInput.value =
    userInput.value.substring(0, cursorPosition) +
    "\n" +
    userInput.value.substring(cursorPosition);

  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.selectionStart = textareaRef.value.selectionEnd =
        cursorPosition + 1;
    }
  });
};

const useSuggestion = (suggestion: string) => {
  userInput.value = suggestion;
  nextTick(() => {
    adjustTextareaHeight();
    if (textareaRef.value) {
      textareaRef.value.focus();
    }
  });
};

const deleteChat = async (chat: any) => {
  try {
    await chatStore.deleteChat(chat.id);
    // 如果删除的是当前选中的聊天，则选择列表中的第一个或创建新聊天
    if (selectedChat.value?.id === chat.id) {
      if (chatHistory.value.length > 0) {
        selectChat({ value: chatHistory.value[0] });
      } else {
        chatStore.createNewChat();
      }
    }
    toast.value?.add({
      severity: "success",
      summary: "成功",
      detail: "聊天记录已删除",
      life: 3000,
    });
  } catch (error) {
    showError("删除聊天记录失败，请稍后再试");
    console.error("Error deleting chat:", error);
  }
};

const retryMessage = async () => {
  // 重新发送最后一条用户消息
  const lastUserMessage = messages.value
    .filter((msg) => msg.sender === "user")
    .pop();

  if (lastUserMessage) {
    // 移除最后一条AI消息
    messageStore.removeLastAIMessage();
    // 重新发送消息
    isTyping.value = true;
    try {
      const response = await chatService.sendMessage({
        stream: false,
        session_id: selectedChat.value?.id ?? "default",
        message: lastUserMessage.content,
      });

      isTyping.value = false;
      messageStore.addAIMessage(response.response);
    } catch (error) {
      isTyping.value = false;
      showError("重试消息失败");
      console.error("Error retrying message:", error);
    }
  }
};

const copyMessage = (message: any) => {
  navigator.clipboard
    .writeText(message.content)
    .then(() => {
      toast.value?.add({
        severity: "success",
        summary: "已复制",
        detail: "内容已复制到剪贴板",
        life: 2000,
      });
    })
    .catch((err) => {
      console.error("无法复制文本: ", err);
      showError("复制失败");
    });
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

  // 聚焦输入框
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus();
    }
  });
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
        console.log("Scrolling to bottom of messages container");
        messagesContainer.value.scrollTop =
          messagesContainer.value.scrollHeight;
      }
    });
  },
  { deep: true }
);
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #555 #333;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #333;
  border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #777;
}

/* 消息动画 */
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-fade-leave-to {
  opacity: 0;
}

/* 模态框动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
