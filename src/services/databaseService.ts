import axios from "axios";

// 数据库会话管理
export interface DatabaseSession {
  sessionId: string;
  type: "mongodb" | "mysql" | "csv";
  connected: boolean;
}

// 数据服务
export const databaseService = {
  // 当前活动的数据库会话
  activeSession: null as DatabaseSession | null,

  // 创建数据库会话
  async createSession(config: any): Promise<DatabaseSession> {
    try {
      const response = await axios.post("/api/sessions", config);
      if (response.data.success) {
        this.activeSession = {
          sessionId: response.data.sessionId,
          type: config.type,
          connected: true,
        };
        return this.activeSession;
      }
      throw new Error("创建数据库会话失败");
    } catch (error) {
      console.error("创建数据库会话出错:", error);
      throw error;
    }
  },

  // 获取数据库表/集合数据
  async getTableData(query: {
    sessionId: string;
    table?: string;
    collection?: string;
    fields?: string[];
    limit?: number;
    skip?: number;
    filter?: any;
    sort?: any;
  }): Promise<any[]> {
    try {
      // 根据数据库类型构建不同的请求参数
      const params: any = { sessionId: query.sessionId };

      if (this.activeSession?.type === "mongodb") {
        params.collection = query.collection || query.table;
      } else if (this.activeSession?.type === "mysql") {
        params.table = query.table;
      }

      // 添加其他查询参数
      if (query.fields) params.fields = query.fields;
      if (query.limit) params.limit = query.limit;
      if (query.skip) params.skip = query.skip;
      if (query.filter) params.filter = JSON.stringify(query.filter);
      if (query.sort) params.sort = JSON.stringify(query.sort);

      const response = await axios.get("/api/data", { params });
      return response.data.data || [];
    } catch (error) {
      console.error("获取数据出错:", error);
      return [];
    }
  },

  // 关闭数据库会话
  async closeSession(sessionId: string): Promise<boolean> {
    try {
      const response = await axios.delete(`/api/sessions/${sessionId}`);
      if (response.data.success) {
        if (this.activeSession?.sessionId === sessionId) {
          this.activeSession = null;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("关闭会话出错:", error);
      return false;
    }
  },
};
