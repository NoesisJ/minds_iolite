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
    try {
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
    } catch (error) {
      console.error("加载聊天记录时出错:", error);
      throw new Error("加载聊天记录失败");
    }
  }

  // 设置当前选中的聊天
  function setSelectedChat(chat: ChatSession): void {
    selectedChat.value = chat;
  }

  // 创建新聊天
  async function createNewChat(): Promise<ChatSession> {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: "新对话",
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

      try {
        // 发送删除请求到后端
        const response = await axios.delete(
          `${API_URL}/api/sessions/${chatId}`,
          {
            headers: {
              "X-Forwarded-For": "user",
            },
          }
        );

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
      } catch (error) {
        console.error("删除聊天时出错:", error);
        throw new Error("删除聊天失败");
      }
    }
  }

  // 更新聊天标题
  async function updateChatTitle(chatId: string, newTitle: string) {
    const chat = chatHistory.value.find((chat) => chat.id === chatId);
    if (!chat) {
      console.error("找不到聊天会话:", chatId);
      throw new Error("找不到聊天会话");
    }

    try {
      // 发送更新请求到后端
      const response = await axios.put(
        `${API_URL}/api/sessions/${chatId}`,
        { title: newTitle },
        {
          headers: {
            "X-Forwarded-For": "user",
          },
        }
      );

      if (response.data.code !== 200) {
        console.error("更新聊天标题失败:", response.statusText);
        throw new Error("更新聊天标题失败");
      }

      // 更新本地状态
      chat.title = newTitle;

      return chat;
    } catch (error) {
      console.error("更新聊天标题时出错:", error);
      throw new Error("更新聊天标题失败");
    }
  }

  // 获取单个聊天详情
  async function getChatDetail(chatId: string): Promise<ChatSession> {
    try {
      const response = await axios.get(`${API_URL}/api/sessions/${chatId}`);

      if (response.data.code !== 200) {
        console.error("获取聊天详情失败:", response.statusText);
        throw new Error("获取聊天详情失败");
      }

      return {
        id: response.data.data.session_id,
        title: response.data.data.title,
      };
    } catch (error) {
      console.error("获取聊天详情时出错:", error);
      throw new Error("获取聊天详情失败");
    }
  }

  // 将聊天从一个位置移动到另一个位置
  function moveChatPosition(fromIndex: number, toIndex: number) {
    if (
      fromIndex < 0 ||
      fromIndex >= chatHistory.value.length ||
      toIndex < 0 ||
      toIndex >= chatHistory.value.length
    ) {
      return;
    }

    const chat = chatHistory.value.splice(fromIndex, 1)[0];
    chatHistory.value.splice(toIndex, 0, chat);
  }

  return {
    chatHistory,
    selectedChat,
    loadChatHistory,
    setSelectedChat,
    createNewChat,
    deleteChat,
    updateChatTitle,
    getChatDetail,
    moveChatPosition,
  };
});
