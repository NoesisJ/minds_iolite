import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});

// 统一错误处理
const handleError = (error: unknown) => {
  console.error('API Error:', error);
  throw error;
};

export const memberApi = {
  // 获取成员列表
  getList: async () => {
    try {
      const { data } = await api.get('/members');
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 获取单个成员
  get: async (id: string) => {
    try {
      const { data } = await api.get(`/members/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 创建成员
  create: async (member: Member) => {
    try {
      const { data } = await api.post('/members', member);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 更新成员
  update: async (id: string, member: Member) => {
    try {
      const { data } = await api.put(`/members/${id}`, member);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 删除成员
  delete: async (id: string) => {
    try {
      await api.delete(`/members/${id}`);
      return true;
    } catch (error) {
      return handleError(error);
    }
  },

  // 批量删除
  batchDelete: async (ids: string[]) => {
    try {
      await api.delete('/members/batch', { data: { ids } });
      return true;
    } catch (error) {
      return handleError(error);
    }
  },

  // 导出CSV
  export: async () => {
    try {
      const response = await api.get('/members/export', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 搜索建议
  search: async (params: { q: string; field: string }) => {
    try {
      const { data } = await api.get('/members/search', { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  }
};

export type Member = {
  id?: string;
  name: string;
  gender: string;
  grade: string;
  group: string;
  identity: string;
  branch: string;
  campus: string;
  major: string;
  phone: string;
  email: string;
  qq: string;
  wechat: string;
};