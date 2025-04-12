// stores/chatStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import type { ChatSession } from "@/types/chat";
import { useMessageStore } from "@/stores/messageStore";
import axios from "axios";

const API_URL = "http://localhost:8001";

export const useChatStore = defineStore("chats", () => {
  const chatHistory = ref<ChatSession[]>([
    { id: "1", title: "关于项目架构的讨论", date: new Date() },
    { id: "2", title: "如何优化代码性能", date: new Date() },
    { id: "3", title: "Bug修复建议", date: new Date() },
  ]);

  const selectedChat = ref<ChatSession | null>(null);

  function getChatStore() {
    return useMessageStore();
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
      date: new Date(),
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
      chatHistory.value.splice(index, 1);

      console.log("删除聊天会话:", chatId);

      // 发送删除请求到后端
      const response = await axios.delete(`${API_URL}/api/sessions/${chatId}`, {
        headers: {
          "X-Forwarded-For": "user",
        },
      });

      if (response.data.code !== 200) {
        if (response.data.code === 404 ){
            console.error("聊天会话不存在:", chatId);
            throw new Error("聊天会话不存在");
        }
        console.error("删除聊天会话失败:", response.statusText);
        throw new Error("删除聊天会话失败");
      }

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
    setSelectedChat,
    createNewChat,
    deleteChat,
  };
});
