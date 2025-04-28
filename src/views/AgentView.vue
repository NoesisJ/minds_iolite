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
            @click="router.push('/import')"
          >
            <Settings class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

    <!-- 消息展示区 -->
    <main
      class="flex-1 py-6 px-6 flex flex-col custom-scrollbar overflow-x-hidden overflow-y-auto"
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
      <div v-else class="w-full mx-auto space-y-6">
        <TransitionGroup name="message-fade">
          <MessageItem
            v-for="message in messages"
            :key="message.id"
            :message="message"
            @retry="retryMessage()"
            @copy="copyMessage(message)"
            class="w-[80%] max-w-[800px] mx-auto"
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
            class="w-full min-h-[80px] max-h-[400px] border-0 text-white p-4 pr-12 outline-none custom-scrollbar resize-none bg-transparent"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="newLine"
            @input="handleInput"
            @keydown.down.prevent="navigateSuggestions(1)"
            @keydown.up.prevent="navigateSuggestions(-1)"
            @keydown.tab.prevent="selectSuggestion"
            @keydown.escape="closeSuggestions"
            style="overflow-y: hidden"
          />

          <div class="flex items-center mb-2 ml-2 space-x-3">
            <!-- 联网搜索按钮 -->
            <button
              class="flex items-center py-1.5 px-2 rounded-lg transition-colors duration-200"
              :class="
                isSearchEnabled
                  ? 'bg-[#c964428d] text-white'
                  : 'text-gray-400 hover:text-gray-300 bg-[#2f2f2f]'
              "
              @click="toggleSearch"
            >
              <Globe class="w-5 h-5 mr-2" />
              <span>联网搜索</span>
            </button>
          </div>

          <!-- 提示词下拉菜单 -->
          <div
            v-if="showSuggestions && filteredPromptSuggestions.length > 0"
            class="absolute bottom-full left-4 mb-2 w-72 max-h-64 overflow-y-auto bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] shadow-xl z-50 custom-scrollbar"
          >
            <div class="py-1">
              <div
                v-for="(suggestion, index) in filteredPromptSuggestions"
                :key="suggestion.id"
                @click="applySuggestion(suggestion)"
                class="px-3 py-2 flex items-center cursor-pointer transition-colors duration-200"
                :class="{
                  'bg-[#454545]': selectedSuggestionIndex === index,
                  'hover:bg-[#404040]': selectedSuggestionIndex !== index,
                }"
              >
                <div class="flex-1">
                  <div class="font-medium text-sm text-white">
                    {{ suggestion.label }}
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ suggestion.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 发送按钮 -->
          <button
            class="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
            :class="sendButtonClass"
            :disabled="!canSendMessage"
            @click="sendMessage"
          >
            <Send class="w-5 h-5 mt-0.5" />
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
  Globe,
  Bot,
} from "lucide-vue-next";
import { useMessageStore } from "@/stores/messageStore";
import { useChatStore } from "@/stores/chatStore";
import MessageItem from "@/components/chat/MessageItem.vue";
import Toast from "@/components/ui/Toast.vue";
import { chatService } from "@/services/chatService";
import router from "@/router";

// 引用和状态
const toast = ref<InstanceType<typeof Toast> | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const userInput = ref<string>("");
const isTyping = ref<boolean>(false);
const isSearchEnabled = ref<boolean>(false); // 联网搜索状态

// 提示词相关状态
const showSuggestions = ref(false);
const promptSuggestions = ref([
  {
    id: 1,
    label: "#表格",
    description: "生成数据表格分析",
    template: "#表格 {tableName}",
  },
  {
    id: 2,
    label: "#图表",
    description: "生成数据可视化图表",
    template: "#图表 {chartType} {dataSource}",
  },
  {
    id: 3,
    label: "#查询",
    description: "执行SQL查询",
    template: "#查询 {sqlQuery}",
  },
  {
    id: 4,
    label: "#趋势",
    description: "分析数据趋势",
    template: "#趋势 {metricName} {timeRange}",
  },
  {
    id: 5,
    label: "#对比",
    description: "对比数据集",
    template: "#对比 {dataset1} {dataset2}",
  },
  {
    id: 6,
    label: "#预测",
    description: "预测未来趋势",
    template: "#预测 {metric} {timeFrame}",
  },
  {
    id: 7,
    label: "#汇总",
    description: "汇总数据统计",
    template: "#汇总 {tableName} {fields}",
  },
  {
    id: 8,
    label: "#分组",
    description: "按类别分组数据",
    template: "#分组 {tableName} {groupByField}",
  },
]);
const selectedSuggestionIndex = ref(0);
const currentPromptFilter = ref("");
const promptStartPosition = ref(0);

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

// 根据输入筛选提示词
const filteredPromptSuggestions = computed(() => {
  if (!currentPromptFilter.value) return promptSuggestions.value;

  return promptSuggestions.value.filter(
    (suggestion) =>
      suggestion.label
        .toLowerCase()
        .includes(currentPromptFilter.value.toLowerCase()) ||
      suggestion.description
        .toLowerCase()
        .includes(currentPromptFilter.value.toLowerCase())
  );
});

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

const handleInput = () => {
  adjustTextareaHeight();

  if (!textareaRef.value) return;

  const text = userInput.value;
  const cursorPosition = textareaRef.value.selectionStart;

  // 检查当前位置之前是否有 # 符号
  let hashPosition = -1;
  for (let i = cursorPosition - 1; i >= 0; i--) {
    // 如果遇到空格或换行，说明不是一个完整的提示词标记
    if (text[i] === " " || text[i] === "\n") {
      break;
    }
    // 找到 # 符号
    if (text[i] === "#") {
      hashPosition = i;
      break;
    }
  }

  if (hashPosition !== -1) {
    // 提取输入的过滤文本
    currentPromptFilter.value = text.substring(
      hashPosition + 1,
      cursorPosition
    );
    promptStartPosition.value = hashPosition;
    showSuggestions.value = true;
    selectedSuggestionIndex.value = 0; // 重置选择索引
  } else {
    // 没有找到 # 符号，关闭建议
    closeSuggestions();
  }
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

// 上下导航提示词
const navigateSuggestions = (direction: number) => {
  if (!showSuggestions.value || filteredPromptSuggestions.value.length === 0)
    return;

  const maxIndex = filteredPromptSuggestions.value.length - 1;
  let newIndex = selectedSuggestionIndex.value + direction;

  // 循环导航
  if (newIndex < 0) newIndex = maxIndex;
  if (newIndex > maxIndex) newIndex = 0;

  selectedSuggestionIndex.value = newIndex;
};

// 选择提示词
const selectSuggestion = () => {
  if (showSuggestions.value && filteredPromptSuggestions.value.length > 0) {
    applySuggestion(
      filteredPromptSuggestions.value[selectedSuggestionIndex.value]
    );
  }
};

// 应用选择的提示词
const applySuggestion = (suggestion: any) => {
  if (!textareaRef.value) return;

  const cursorPosition = textareaRef.value.selectionStart;
  const beforeText = userInput.value.substring(0, promptStartPosition.value);
  const afterText = userInput.value.substring(cursorPosition);

  // 应用模板而不是标签
  const suggestionText = suggestion.label.split(" ")[0]; // 只取 #命令部分

  // 替换文本
  userInput.value = beforeText + suggestionText + " " + afterText;

  // 关闭提示词菜单
  closeSuggestions();

  // 设置光标位置
  nextTick(() => {
    if (textareaRef.value) {
      const newPosition = promptStartPosition.value + suggestionText.length + 1;
      textareaRef.value.selectionStart = textareaRef.value.selectionEnd =
        newPosition;
      textareaRef.value.focus();
    }
  });
};

// 关闭提示词菜单
const closeSuggestions = () => {
  showSuggestions.value = false;
  currentPromptFilter.value = "";
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
    const message2Send = isSearchEnabled.value
      ? userMessage.content + " /联网搜索"
      : userMessage.content;

    const response = await chatService.sendMessage({
      stream: false,
      session_id: selectedChat.value?.id ?? "default",
      message: message2Send,
    });

    // 处理响应
    isTyping.value = false;
    messageStore.addAIMessage(response.response);
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

const toggleSearch = () => {
  isSearchEnabled.value = !isSearchEnabled.value;
  if (isSearchEnabled.value) {
    toast.value?.add({
      severity: "info",
      summary: "联网搜索已启用",
      detail: "可以使用联网搜索功能",
      life: 3000,
    });
  } else {
    toast.value?.add({
      severity: "warn",
      summary: "联网搜索已禁用",
      detail: "联网搜索功能已关闭",
      life: 3000,
    });
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

  // 聚焦输入框
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus();
    }
  });

  // 点击其他地方关闭提示词菜单
  document.addEventListener("click", (e) => {
    if (textareaRef.value && !textareaRef.value.contains(e.target as Node)) {
      closeSuggestions();
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

// 监听光标位置变化
watch(
  () => textareaRef.value?.selectionStart,
  () => {
    if (showSuggestions.value) {
      handleInput();
    }
  }
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
