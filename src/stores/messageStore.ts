// stores/messageStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import type { Message } from "@/types/chat";
import { useChatStore } from "@/stores/chatStore";
import axios from "axios";

const API_URL = "http://localhost:8001";

export const useMessageStore = defineStore("messages", () => {
  const messages = ref<Message[]>([]);

  function getChatStore() {
    return useChatStore();
  }

  // 添加用户消息
  function addUserMessage(content: string): Message {
    const message: Message = {
      id: Date.now(),
      content,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    messages.value.push(message);
    if (messages.value.length === 1) {
      const chatStore = getChatStore();
      if (chatStore.selectedChat) {
        chatStore.selectedChat.title = content.slice(0, 10) + "..."; // 截取前10个字符作为标题
        chatStore.selectedChat.date = new Date(); // 更新日期
      }
    }
    return message;
  }

  // 添加AI消息
  function addAIMessage(content: string): Message {
    const message: Message = {
      id: Date.now() + 1,
      content,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
    };

    messages.value.push(message);
    return message;
  }

  // 添加系统消息（如错误提示）
  function addSystemMessage(
    content: string,
    type: "info" | "error" = "info"
  ): Message {
    const message: Message = {
      id: Date.now() + 2,
      content,
      sender: "system",
      type,
      timestamp: new Date().toLocaleTimeString(),
    };

    messages.value.push(message);
    return message;
  }

  // 加载指定会话的消息
  async function loadMessages(sessionId: string) {
    const headers = {
      "Content-Type": "application/json",
      user_id: "user",
      session_id: sessionId,
    };

    const response = await axios.get(`${API_URL}/api/sessions`, {
      headers,
    });

    if (response.data.code !== 200) {
      console.error("加载消息失败:", response.statusText);
      return;
    }

    const messagesData = response.data.data.messages;
    messages.value = messagesData.map((msg: any) => ({
      id: Date.now() + Math.random(),
      content: msg.content,
      sender: msg.role,
      timestamp: new Date().toLocaleTimeString(),
    }));
  }

  // 清空消息
  function clearMessages(): void {
    messages.value = [];
  }

  return {
    messages,
    addUserMessage,
    addAIMessage,
    addSystemMessage,
    loadMessages,
    clearMessages,
  };
});
