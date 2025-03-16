import axios from 'axios';
import { ref } from 'vue';

// 创建一个响应式变量来跟踪API状态
export const apiStatus = ref({
  connected: false,
  lastError: null as string | null,
  retrying: false
});

// 配置axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
  // 添加重试配置
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器
api.interceptors.request.use(
  config => {
    // 在发送请求前可以做一些处理
    return config;
  },
  error => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  response => {
    // 请求成功时更新API状态
    apiStatus.value.connected = true;
    apiStatus.value.lastError = null;
    apiStatus.value.retrying = false;
    return response;
  },
  error => {
    // 请求失败时更新API状态
    apiStatus.value.connected = false;
    apiStatus.value.lastError = error.message || '网络连接错误';
    
    console.error('API响应错误:', error);
    // 可以在这里添加重试逻辑
    return Promise.reject(error);
  }
);

const handleError = (error: unknown) => {
  console.error('API Error:', error);
  // 返回一个更友好的错误对象，而不是直接抛出错误
  return {
    success: false,
    error: error instanceof Error ? error.message : '未知错误',
    data: null
  };
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
  },
  
  // 检查API连接状态
  checkConnection: async () => {
    try {
      await api.get('/health');
      apiStatus.value.connected = true;
      return true;
    } catch (error) {
      apiStatus.value.connected = false;
      apiStatus.value.lastError = error instanceof Error ? error.message : '连接失败';
      return false;
    }
  }
};

// 财务数据类型定义 - 与后端接口匹配
export type FinancialItem = {
  id?: string | number;
  name: string;
  model: string;
  quantity: string;
  unit: string;
  price: string;
  extra_price: string;
  purchase_link: string;
  post_date: string;
  purchaser: string;
  campus: string;
  group_name: string;
  troop_type: string;
  project: string;
  remarks: string;
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