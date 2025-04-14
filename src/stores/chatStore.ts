// stores/chatStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import type { ChatSession } from "@/types/chat";
import { useMessageStore } from "@/stores/messageStore";
import axios from "axios";

const API_URL = "http://localhost:8001";

export const useChatStore = defineStore("chats", () => {
  const chatHistory = ref<ChatSession[]>([]);

  // Load chat history asynchronously after the store is defined
  (async () => {
    await loadChatHistory();
  })();

  const selectedChat = ref<ChatSession | null>(null);

  function getChatStore() {
    return useMessageStore();
  }

  // 从后端获取聊天记录
  async function loadChatHistory() {
    const response = await axios.get(`${API_URL}/api/sessions/list`);

    if (response.data.code !== 200) {
      console.error("获取聊天记录失败:", response.statusText);
      return;
    }

    chatHistory.value = response.data.data.sessions.map((chat: any) => ({
      id: chat.session_id,
      title: chat.title,
    }));

    console.log("聊天记录:", chatHistory.value);

    if (chatHistory.value.length > 0) {
      setSelectedChat(chatHistory.value[0]);
    } else {
      createNewChat();
    }
  }

  // 设置当前选中的聊天
  function setSelectedChat(chat: ChatSession): void {
    selectedChat.value = chat;
  }

  // 创建新聊天
  function createNewChat(): ChatSession {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: "New Chat",
    };

    chatHistory.value.unshift(newChat);
    setSelectedChat(newChat);
    const messageStore = getChatStore();
    messageStore.clearMessages(); // 清空消息列表

    return newChat;
  }

  // 删除聊天
  async function deleteChat(chatId: string) {
    const index = chatHistory.value.findIndex((chat) => chat.id === chatId);
    if (index !== -1) {
      console.log("删除聊天会话:", chatId);

      // 发送删除请求到后端
      const response = await axios.delete(`${API_URL}/api/sessions/${chatId}`, {
        headers: {
          "X-Forwarded-For": "user",
        },
      });

      if (response.data.code !== 200) {
        if (response.data.code === 404) {
          console.error("聊天会话不存在:", chatId);
          throw new Error("聊天会话不存在");
        }
        console.error("删除聊天会话失败:", response.statusText);
        throw new Error("删除聊天会话失败");
      }

      chatHistory.value.splice(index, 1);

      // 如果删除的是当前选中的聊天，则选择第一个聊天或创建新聊天
      if (selectedChat.value?.id === chatId) {
        if (chatHistory.value.length > 0) {
          setSelectedChat(chatHistory.value[0]);
        } else {
          createNewChat();
        }
      }
    }
  }

  return {
    chatHistory,
    selectedChat,
    loadChatHistory,
    setSelectedChat,
    createNewChat,
    deleteChat,
  };
});
