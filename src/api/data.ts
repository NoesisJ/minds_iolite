// 数据库对应表名为Data（注意大小写），以下是用到的数据名的对应关系，上为前端，下为数据库
//id,name,gender,grade,group,identity,branch,campus,major,phone,email,qq,wechat
//id,nickname,sex,age,jlugroup,identity,study,school,subjects,phone,email,qq,wechat
import axios from 'axios';
// 定义数据类型接口，与后端返回的数据结构保持一致
export interface DataItem {
  id: number;
  nickname: string;
  sex: string;
  age: string;
  jlugroup: string;
  identity: string;
  study: string;
  school: string;
  subjects: string;
  phone: string;
  email: string;
  qq: string;
  wechat: string;
}

const api = axios.create({
  // 使用实际的后端API地址
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});

// 统一错误处理
const handleError = (error: unknown) => {
  console.error('API Error:', error);
  throw error;
};

export const dataApi = {
  // 获取所有数据
  getAllData: async (): Promise<DataItem[]> => {
    try {
      const { data } = await api.get('/data');
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 获取单个数据
  getData: async (id: number): Promise<DataItem> => {
    try {
      const { data } = await api.get(`/data/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 创建数据
  createData: async (dataItem: Omit<DataItem, 'id'>): Promise<DataItem> => {
    try {
      const { data } = await api.post('/data', dataItem);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 更新数据
  updateData: async (id: number, dataItem: Partial<DataItem>): Promise<DataItem> => {
    try {
      const { data } = await api.put(`/data/${id}`, dataItem);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 删除数据
  deleteData: async (id: number): Promise<void> => {
    try {
      await api.delete(`/data/${id}`);
    } catch (error) {
      return handleError(error);
    }
  }
};