import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});

const handleError = (error: unknown) => {
  console.error('API Error:', error);
  throw error;
};

export const financeApi = {
  // 获取财务数据列表
  getList: async () => {
    try {
      const { data } = await api.get('/financial');
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 获取单个财务数据
  get: async (id: string) => {
    try {
      const { data } = await api.get(`/financial/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 创建财务数据
  create: async (item: FinancialItem) => {
    try {
      const { data } = await api.post('/financial', item);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 更新财务数据
  update: async (id: string, item: FinancialItem) => {
    try {
      const { data } = await api.put(`/financial/${id}`, item);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 删除财务数据
  delete: async (id: string) => {
    try {
      await api.delete(`/financial/${id}`);
      return true;
    } catch (error) {
      return handleError(error);
    }
  },

  // 批量删除
  batchDelete: async (ids: string[]) => {
    try {
      await api.delete('/financial/batch', { data: { ids } });
      return true;
    } catch (error) {
      return handleError(error);
    }
  },

  // 导出CSV
  export: async () => {
    try {
      const response = await api.get('/financial/export', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
};

// 财务数据类型定义
export type FinancialItem = {
  id?: string;
  title: string;
  amount: number;
  type: string; // 收入/支出
  category: string;
  date: string;
  paymentMethod: string;
  description: string;
  responsible: string;
  project?: string;
  receipt?: string;
  status: string;
};

export type Item = {
  id?: string;
  name: string;
  model: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  shippingCost: number;
  totalPrice: number;
  purchaser: string;
  date: string;
  campus: string;
  group: string;
  branch: string;
  link: string;
  project: string;
  remarks: string;
};