import axios from 'axios';

const api = axios.create({
  baseURL: 'https://example.com/api/finance',
  timeout: 10000
});

const handleError = (error: unknown) => {
  console.error('API Error:', error);
  throw error;
};

export const financeApi = {
  // 获取物资列表
  getList: async (): Promise<Item[]> => {
    try {
      const { data } = await api.get('/items');
      return data.map((item: any) => ({
        ...item,
        unitPrice: Number(item.unitPrice) || 0,
        quantity: Number(item.quantity) || 0,
        shippingCost: Number(item.shippingCost) || 0,
        totalPrice: Number(item.totalPrice) || 0
      }));
    } catch (error) {
      return handleError(error);
    }
  },

  // 创建物资
  create: async (item: Item) => {
    try {
      const { data } = await api.post('/items', item);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 更新物资
  update: async (id: string, item: Item) => {
    try {
      const { data } = await api.put(`/items/${id}`, item);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 删除物资
  delete: async (id: string) => {
    try {
      await api.delete(`/items/${id}`);
      return true;
    } catch (error) {
      return handleError(error);
    }
  },

  // 批量删除
  batchDelete: async (ids: string[]) => {
    try {
      await api.delete('/items/batch', { data: { ids } });
      return true;
    } catch (error) {
      return handleError(error);
    }
  },

  // 导出CSV
  export: async () => {
    try {
      const response = await api.get('/items/export', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
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