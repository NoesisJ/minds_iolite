import axios from "axios";
import { ref } from "vue";

// 创建一个响应式变量来跟踪API状态
export const apiStatus = ref({
  connected: false,
  lastError: null as string | null,
  retrying: false,
  loading: false,
  lastUpdated: null as Date | null,
});

// 重试配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒延迟

// 配置axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在发送请求前可以做一些处理
    apiStatus.value.loading = true;
    return config;
  },
  (error) => {
    console.error("请求拦截器错误:", error);
    apiStatus.value.loading = false;
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => {
    // 请求成功时更新API状态
    apiStatus.value.connected = true;
    apiStatus.value.lastError = null;
    apiStatus.value.retrying = false;
    apiStatus.value.loading = false;
    apiStatus.value.lastUpdated = new Date();
    return response;
  },
  (error) => {
    // 请求失败时更新API状态
    apiStatus.value.connected = false;
    apiStatus.value.lastError = formatErrorMessage(error);
    apiStatus.value.loading = false;

    console.error("API响应错误:", error);
    return Promise.reject(error);
  }
);

// 格式化错误信息，使其更友好
const formatErrorMessage = (error: any): string => {
  if (error.response) {
    // 服务器返回了错误状态码
    const status = error.response.status;
    const message =
      error.response.data?.message || error.response.data?.error || "未知错误";

    switch (status) {
      case 400:
        return `请求参数有误: ${message}`;
      case 401:
        return "未授权访问，请重新登录";
      case 403:
        return "没有权限执行此操作";
      case 404:
        return "请求的资源不存在";
      case 500:
        return `服务器错误: ${message}`;
      default:
        return `请求失败(${status}): ${message}`;
    }
  } else if (error.request) {
    // 请求已发送但没有收到响应
    return "服务器无响应，请检查网络连接";
  } else {
    // 请求配置出错
    return `请求错误: ${error.message}`;
  }
};

// 使用重试机制的请求函数
const requestWithRetry = async (
  requestFn: () => Promise<any>,
  retries = MAX_RETRIES
) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && !apiStatus.value.retrying) {
      console.log(`请求失败，${retries}次重试后重新尝试...`);

      apiStatus.value.retrying = true;

      return new Promise((resolve) => {
        setTimeout(() => {
          apiStatus.value.retrying = false;
          resolve(requestWithRetry(requestFn, retries - 1));
        }, RETRY_DELAY);
      });
    }

    // 重试耗尽，返回标准化的错误响应
    return {
      success: false,
      error: formatErrorMessage(error),
      data: null,
    };
  }
};

// 标准化处理结果
const standardizeResponse = (response: any) => {
  // 如果已经是标准化格式，直接返回
  if (response && response.success !== undefined) {
    return response;
  }

  // 标准化响应数据
  return {
    success: true,
    error: null,
    data: response,
  };
};

export const financeApi = {
  // 获取财务数据列表
  getList: async () => {
    return requestWithRetry(async () => {
      const { data } = await api.get("/financial");
      return standardizeResponse(data).data || [];
    });
  },

  // 获取单个财务数据
  get: async (id: string) => {
    return requestWithRetry(async () => {
      const { data } = await api.get(`/financial/${id}`);
      return standardizeResponse(data);
    });
  },

  // 创建财务数据
  create: async (item: FinancialItem) => {
    return requestWithRetry(async () => {
      try {
        const { data } = await api.post("/financial", item);
        return standardizeResponse(data);
      } catch (error: any) {
        // 特别处理验证错误
        if (error.response?.status === 400) {
          return {
            success: false,
            error:
              "数据验证失败: " + (error.response.data?.message || "请检查输入"),
            data: error.response.data?.errors || null,
          };
        }
        throw error;
      }
    });
  },

  // 更新财务数据
  update: async (id: string, item: FinancialItem) => {
    return requestWithRetry(async () => {
      try {
        const { data } = await api.put(`/financial/${id}`, item);
        return standardizeResponse(data);
      } catch (error: any) {
        // 特别处理验证错误
        if (error.response?.status === 400) {
          return {
            success: false,
            error:
              "数据验证失败: " + (error.response.data?.message || "请检查输入"),
            data: error.response.data?.errors || null,
          };
        }
        throw error;
      }
    });
  },

  // 删除财务数据
  delete: async (id: string) => {
    return requestWithRetry(async () => {
      await api.delete(`/financial/${id}`);
      return { success: true, error: null, data: null };
    });
  },

  // 批量删除
  batchDelete: async (ids: string[]) => {
    return requestWithRetry(async () => {
      await api.delete("/financial/batch", { data: { ids } });
      return { success: true, error: null, data: null };
    });
  },

  // 导出CSV
  export: async () => {
    return requestWithRetry(async () => {
      const response = await api.get("/financial/export", {
        responseType: "blob",
      });
      return response.data;
    });
  },

  // 检查API连接状态
  checkConnection: async () => {
    try {
      await api.get("/health");
      apiStatus.value.connected = true;
      return true;
    } catch (error) {
      apiStatus.value.connected = false;
      apiStatus.value.lastError =
        error instanceof Error ? error.message : "连接失败";
      return false;
    }
  },
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
