<template>
  <div class="flex flex-col items-center justify-center">
    <!-- 主触发按钮 -->
    <button
      @click="openPanel"
      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      连接/导入数据库
    </button>

    <!-- 主面板 -->
    <div
      v-if="showPanel"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-[var(--material-bg-light)] rounded-2xl shadow-xl w-full max-w-2xl p-6"
      >
        <h2 class="text-2xl font-normal mb-4">数据库连接/导入</h2>

        <!-- 数据库类型选择 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-200 mb-2"
            >数据库类型</label
          >
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="dbType in databaseTypes"
              :key="dbType.value"
              @click="selectDatabaseType(dbType.value)"
              :class="[
                'p-3 rounded-md text-center',
                selectedDbType === dbType.value
                  ? 'border-2 border-[var(--material-item-border)] bg-[var(--material-bg-dark)]'
                  : 'border-[1.5px] border-gray-400 hover:border-[var(--material-item-border)] hover:bg-[var(--material-bg-dark)]',
              ]"
            >
              <component :is="dbType.icon" class="mx-auto h-8 w-8 mb-2" />
              <span class="text-sm font-medium">{{ dbType.label }}</span>
            </button>
          </div>
        </div>

        <!-- 连接表单 (MongoDB/MySQL) -->
        <div v-if="isConnectionType" class="mb-6">
          <div class="space-y-4">
            <div class="flex flex-col gap-3">
              <label for="host" class="block text-sm font-medium text-gray-200"
                >主机地址</label
              >
              <input
                id="host"
                v-model="connectionConfig.host"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="localhost"
              />
            </div>

            <div class="flex flex-col gap-3">
              <label for="port" class="block text-sm font-medium text-gray-200"
                >端口</label
              >
              <input
                id="port"
                v-model="connectionConfig.port"
                type="number"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                :placeholder="defaultPort"
              />
            </div>

            <div class="flex flex-col gap-3">
              <label
                for="username"
                class="block text-sm font-medium text-gray-200"
                >用户名</label
              >
              <input
                id="username"
                v-model="connectionConfig.username"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="可选"
              />
            </div>

            <div class="flex flex-col gap-3">
              <label
                for="password"
                class="block text-sm font-medium text-gray-200"
                >密码</label
              >
              <input
                id="password"
                v-model="connectionConfig.password"
                type="password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="可选"
              />
            </div>

            <div class="flex flex-col gap-3">
              <label
                for="database"
                class="block text-sm font-medium text-gray-200"
                >数据库名称</label
              >
              <input
                id="database"
                v-model="connectionConfig.database"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="数据库名"
              />
            </div>
          </div>
        </div>

        <!-- 文件上传 (SQLite/CSV/Excel) -->
        <div v-if="isFileType" class="mb-6">
          <div
            @click="triggerFileInput"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="dragActive = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer',
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
            ]"
          >
            <div v-if="!selectedFile">
              <Upload class="mx-auto h-12 w-12 text-gray-400" />
              <p class="mt-2 text-sm text-gray-600">
                <span class="font-medium text-blue-600">点击上传</span>
                或拖放文件到此处
              </p>
              <p class="text-xs text-gray-500 mt-1">
                支持 {{ fileAcceptTypes }} 文件
              </p>
            </div>
            <div v-else class="flex flex-col items-center">
              <File class="mx-auto h-12 w-12 text-green-500" />
              <p
                class="mt-2 text-sm font-medium text-gray-900 truncate max-w-xs"
              >
                {{ selectedFile.name }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatFileSize(selectedFile.size) }}
              </p>
            </div>
          </div>
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            :accept="fileAcceptTypes"
            @change="handleFileChange"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-3">
          <button
            @click="cancel"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            @click="confirm"
            :disabled="!isFormValid"
            :class="[
              'px-4 py-2 rounded-md text-white',
              isFormValid
                ? 'bg-[var(--material-red)] hover:bg-[var(--material-red-dark)]'
                : 'bg-[var(--material-red-dark)] cursor-not-allowed',
            ]"
          >
            连接/导入
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
        <Loader class="h-12 w-12 text-blue-500 animate-spin" />
        <p class="mt-4 text-gray-700">
          {{ isLoadingMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Database,
  File,
  Loader,
  ServerCog,
  Sheet,
  Upload,
} from "lucide-vue-next";

// 定义组件发出的事件
const emit = defineEmits<{
  (e: "connect", config: ConnectionConfig): void;
  (e: "import-file", file: File, type: "sqlite" | "csv" | "excel"): void;
}>();

// 数据库类型定义
interface DatabaseType {
  value: string;
  label: string;
  icon: any;
  isConnection: boolean;
  fileAccept?: string;
  defaultPort?: number;
}

const databaseTypes: DatabaseType[] = [
  {
    value: "mongodb",
    label: "MongoDB",
    icon: ServerCog,
    isConnection: true,
    defaultPort: 27017,
  },
  {
    value: "mysql",
    label: "MySQL",
    icon: ServerCog,
    isConnection: true,
    defaultPort: 3306,
  },
  {
    value: "sqlite",
    label: "SQLite",
    icon: Database,
    isConnection: false,
    fileAccept: ".db,.sqlite,.sqlite3",
  },
  {
    value: "csv",
    label: "CSV",
    icon: Sheet,
    isConnection: false,
    fileAccept: ".csv,.txt",
  },
  {
    value: "excel",
    label: "Excel",
    icon: Sheet,
    isConnection: false,
    fileAccept: ".xlsx,.xls",
  },
];

// 连接配置类型
interface ConnectionConfig {
  host: string;
  port: number | string;
  username: string;
  password: string;
  database: string;
  type?: string; // Add the 'type' property as optional
}

// 响应式状态
const showPanel = ref(false);
const selectedDbType = ref<string | null>(null);
const connectionConfig = ref<ConnectionConfig>({
  host: "localhost",
  port: "",
  username: "",
  password: "",
  database: "",
});
const fileInput = ref<HTMLInputElement | null>(null);
const dragActive = ref(false);
const selectedFile = ref<File | null>(null);
const isLoading = ref(false);
const isLoadingMessage = ref("正在连接数据库...");

// 计算属性
const isConnectionType = computed(() => {
  if (!selectedDbType.value) return false;
  const dbType = databaseTypes.find((t) => t.value === selectedDbType.value);
  return dbType?.isConnection;
});

const isFileType = computed(() => {
  if (!selectedDbType.value) return false;
  const dbType = databaseTypes.find((t) => t.value === selectedDbType.value);
  return !dbType?.isConnection;
});

const fileAcceptTypes = computed(() => {
  if (!selectedDbType.value) return "";
  const dbType = databaseTypes.find((t) => t.value === selectedDbType.value);
  return dbType?.fileAccept || "";
});

const defaultPort = computed(() => {
  if (!selectedDbType.value) return "";
  const dbType = databaseTypes.find((t) => t.value === selectedDbType.value);
  return dbType?.defaultPort ? `默认: ${dbType.defaultPort}` : "";
});

const isFormValid = computed(() => {
  if (!selectedDbType.value) return false;

  if (isConnectionType.value) {
    return (
      connectionConfig.value.host.trim() !== "" &&
      connectionConfig.value.database.trim() !== ""
    );
  } else {
    return selectedFile.value !== null;
  }
});

// 方法
const openPanel = () => {
  showPanel.value = true;
  selectedDbType.value = null;
  selectedFile.value = null;
  connectionConfig.value = {
    host: "localhost",
    port: "",
    username: "",
    password: "",
    database: "",
  };
};

const selectDatabaseType = (type: string) => {
  selectedDbType.value = type;
  const dbType = databaseTypes.find((t) => t.value === type);
  if (dbType?.isConnection && dbType.defaultPort) {
    connectionConfig.value.port = dbType.defaultPort;
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
  }
};

const handleDragOver = () => {
  dragActive.value = true;
};

const handleDrop = (event: DragEvent) => {
  dragActive.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    // 检查文件扩展名
    const dbType = databaseTypes.find((t) => t.value === selectedDbType.value);
    if (dbType?.fileAccept) {
      const validExtensions = dbType.fileAccept
        .split(",")
        .map((ext) => ext.trim());
      const fileExtension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();

      if (validExtensions.includes(fileExtension)) {
        selectedFile.value = file;
      } else {
        alert(`请选择有效的${dbType.label}文件 (${dbType.fileAccept})`);
      }
    }
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const cancel = () => {
  showPanel.value = false;
};

const confirm = async () => {
  if (!selectedDbType.value) return;

  isLoading.value = true;

  try {
    if (isConnectionType.value) {
      isLoadingMessage.value = `正在连接${selectedDbType.value}数据库...`;
      // 模拟连接延迟
      await new Promise((resolve) => setTimeout(resolve, 1500));

      emit("connect", {
        type: selectedDbType.value,
        ...connectionConfig.value,
      });
    } else {
      isLoadingMessage.value = `正在导入${selectedDbType.value}文件...`;
      // 模拟导入延迟
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (selectedFile.value) {
        emit(
          "import-file",
          selectedFile.value,
          selectedDbType.value as "sqlite" | "csv" | "excel"
        );
      }
    }

    showPanel.value = false;
    isLoading.value = false;
  } catch (error) {
    console.error("操作失败:", error);
    alert("操作失败，请检查配置或文件");
    isLoading.value = false;
  }
};
</script>
