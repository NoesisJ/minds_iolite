<template>
  <div class="h-full flex flex-col text-white">
    <!-- 顶部标题栏 -->
    <header class="flex justify-between items-center px-6 py-5">
      <!-- 选型 -->
      <div class="flex items-center gap-4">
        <!-- 下拉历史记录按钮 -->
        <DropdownMenu
          :items="
            chatHistory.map((item) => ({ label: item.title, value: item }))
          "
          :callback="(item) => (selectedChat = item.value)"
          class="history-selector"
        >
          <div class="flex items-center">
            <span>{{ selectedChat ? selectedChat.title : "AI助手" }}</span>
          </div>
        </DropdownMenu>

        <!-- 模型选择下拉菜单 -->
        <DropdownMenu
          :items="models.map((model) => ({ label: model.name, value: model }))"
          :callback="(item) => (selectedModel = item.value)"
          class="model-selector"
        >
          <div class="flex items-center">
            <span>{{ selectedModel ? selectedModel.name : "deepseek" }}</span>
          </div>
        </DropdownMenu>
      </div>
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
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex w-full"
          :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[80%] rounded-lg p-4"
            :class="
              message.sender === 'user'
                ? 'bg-[#404040] text-white'
                : 'bg-[#353535] text-white'
            "
          >
            {{ message.content }}
          </div>
        </div>
      </div>
    </main>

    <!-- 底部输入区 -->
    <footer class="p-4 w-full">
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

        <!-- 功能开关按钮 -->
        <div class="flex items-center mt-2 ml-[-0.6rem] space-x-3">
          <!-- 联网搜索按钮 -->
          <button
            class="flex items-center py-1.5 px-2 rounded-lg transition-colors duration-200"
            :class="
              isSearchEnabled
                ? 'bg-[#c964428d] text-white'
                : 'text-gray-400 hover:text-gray-300'
            "
            @click="toggleSearch"
          >
            <Globe class="w-5 h-5 mr-2" />
            <span>联网搜索</span>
          </button>
        </div>

        <!-- 发送按钮 -->
        <button
          class="absolute bottom-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
          :class="
            userInput.trim().length > 0
              ? 'bg-[#c96442] text-white'
              : 'bg-[#7d4a38] text-[#989897] cursor-not-allowed'
          "
          :disabled="userInput.trim().length === 0"
          @click="sendMessage"
        >
          <Send class="w-4 h-4" />
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import DropdownMenu from "@/components/ui/DropDown.vue";
import { Globe, Send } from "lucide-vue-next";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface ChatSession {
  id: number;
  title: string;
  date: Date;
}

interface Model {
  id: string;
  name: string;
}

// 示例聊天历史记录
// TODO: 接入实际聊天记录
const chatHistory = ref<ChatSession[]>([
  { id: 1, title: "关于项目架构的讨论", date: new Date() },
  { id: 2, title: "如何优化代码性能", date: new Date() },
  { id: 3, title: "Bug修复建议", date: new Date() },
]);

// 示例可选模型
// TODO: 接入实际模型
const models = ref<Model[]>([
  { id: "deepseek", name: "deepseek" },
  { id: "gpt", name: "gpt" },
]);

const selectedChat = ref<ChatSession | null>(null);
const selectedModel = ref<Model>(models.value[0]); // 默认选择deepseek

// 功能开关状态
const isSearchEnabled = ref(false);
const isReasoningEnabled = ref(false);

// 切换联网搜索状态
const toggleSearch = () => {
  isSearchEnabled.value = !isSearchEnabled.value;
};

// 状态管理
const userInput = ref<string>("");
const messages = ref<Message[]>([]);
const messagesContainer = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// 自动调整输入框高度
const adjustTextareaHeight = () => {
  if (!textareaRef.value) return;

  textareaRef.value.style.height = "auto"; // 重置高度为自动，以便计算正确的高度

  // 计算新的高度（不超过最大高度）
  const newHeight = Math.min(
    textareaRef.value.scrollHeight,
    400 // 最大高度（px）
  );

  textareaRef.value.style.height = `${newHeight}px`; // 应用
  textareaRef.value.style.overflowY = newHeight >= 400 ? "auto" : "hidden"; // 溢出则显示滚动条
};

// 在组件挂载时和内容变化时调整高度
onMounted(() => {
  adjustTextareaHeight();
});

watch(userInput, () => {
  nextTick(adjustTextareaHeight);
});

// 发送消息方法
const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  // 添加用户消息
  const userMessage: Message = {
    id: Date.now(),
    content: userInput.value,
    sender: "user",
    timestamp: new Date().toLocaleTimeString(),
  };

  messages.value.push(userMessage);
  userInput.value = "";

  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = "40px"; // 重置为最小高度
    }
  });

  // 模拟AI响应
  setTimeout(() => {
    const aiMessage: Message = {
      id: Date.now(),
      content: `我是基于${selectedModel.value.name}的AI助手，很高兴为您服务！${isSearchEnabled.value ? "我已启用联网搜索功能。" : ""}${isReasoningEnabled.value ? "我已启用推理功能。" : ""}请问有什么我可以帮助您的吗？`,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
    };

    messages.value.push(aiMessage);
  }, 1000);
};

// 监听消息变化，自动滚动到底部
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
