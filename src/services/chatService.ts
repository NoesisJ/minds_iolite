// services/chatService.ts
import axios from "axios";

const API_URL = "http://localhost:8001";

class ChatService {
  private username: string = "user";

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/health`);
      return response.data.code === 200;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  async sendMessage(messageData: {
    stream: boolean;
    session_id: string;
    message: string;
  }): Promise<any> {
    // 先检查服务健康状态
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      throw new Error("服务当前不可用，请稍后再试");
    }

    const headers = {
      "Content-Type": "application/json",
      "X-Forwarded-For": this.username,
    };

    try {
      const response = await axios.post(`${API_URL}/api/chat`, messageData, {
        headers,
      });

      if (response.data.code !== 200 || !response.data.data) {
        throw new Error("服务器没有返回有效响应");
      }

      return response.data.data;
    } catch (error) {
      console.error("Send message error:", error);
      throw error;
    }
  }

  setUsername(username: string): void {
    this.username = username;
  }
}

export const chatService = new ChatService();
