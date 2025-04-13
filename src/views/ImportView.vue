<template>
  <div class="relative transform-3d flex flex-col items-center justify-center">
    <!-- 主触发按钮 -->
    <button
      @click="openPanel"
      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      连接/导入数据库
    </button>

    <!-- 主面板 -->
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-[var(--material-bg-light)] rounded-2xl shadow-xl w-full max-w-2xl max-h-[700px] p-6 overflow-auto"
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

        <!-- 文件选择 (SQLite/CSV/Excel) -->
        <div v-if="isFileType" class="mb-6">
          <div class="space-y-4">
            <div class="flex flex-col gap-3">
              <label class="block text-sm font-medium text-gray-200">
                文件路径
              </label>
              <div class="flex">
                <input
                  v-model="selectedFilePath"
                  type="text"
                  class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="选择文件路径"
                  readonly
                />
                <button
                  @click="openFileDialog"
                  class="px-4 py-2 bg-gray-600 text-white rounded-r-md hover:bg-gray-700 transition-colors"
                >
                  浏览
                </button>
              </div>
              <p class="text-xs text-gray-400 mt-1">
                支持 {{ fileAcceptTypes }} 文件
              </p>
            </div>

            <!-- 文件选择成功后显示 -->
            <div
              v-if="selectedFilePath"
              class="flex items-center p-3 bg-gray-700 rounded-md"
            >
              <File class="h-6 w-6 text-green-500 mr-2" />
              <div class="overflow-hidden">
                <p class="text-sm font-medium text-gray-200 truncate">
                  {{ getFileName(selectedFilePath) }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ selectedFilePath }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- CSV 特定选项 -->
        <div v-if="selectedDbType === 'csv' && selectedFilePath" class="mb-6">
          <h3 class="text-lg font-medium mb-3">CSV 选项</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-200"> 分隔符: </label>
              <select
                v-model="csvOptions.delimiter"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value=",">逗号 (,)</option>
                <option value=";">分号 (;)</option>
                <option value="\t">制表符 (Tab)</option>
                <option value="|">竖线 (|)</option>
                <option value=" ">空格 (Space)</option>
              </select>
            </div>

            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-200"> 编码: </label>
              <select
                v-model="csvOptions.encoding"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="utf-8">UTF-8</option>
                <option value="gbk">GBK</option>
                <option value="gb2312">GB2312</option>
                <option value="iso-8859-1">ISO-8859-1</option>
              </select>
            </div>

            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasHeader"
                v-model="csvOptions.hasHeader"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="hasHeader" class="text-sm font-medium text-gray-200">
                第一行为表头
              </label>
            </div>
          </div>
        </div>

        <!-- 导入方式选择 -->
        <div
          v-if="
            isFileType &&
            selectedFilePath &&
            (selectedDbType === 'csv' || selectedDbType === 'sqlite')
          "
          class="mb-6"
        >
          <h3 class="text-lg font-medium mb-3">选择导入方式</h3>
          <div class="flex gap-3">
            <div
              @click="importMode = 'preview'"
              :class="[
                'flex-1 p-3 border rounded-md cursor-pointer text-center',
                importMode === 'preview'
                  ? 'border-[var(--material-item-border)] bg-[var(--material-bg-dark)]'
                  : 'border-gray-400',
              ]"
            >
              <p class="font-medium">预览数据</p>
              <p class="text-xs text-gray-400 mt-1">仅处理文件并显示预览</p>
            </div>
            <div
              @click="importMode = 'mongodb'"
              :class="[
                'flex-1 p-3 border rounded-md cursor-pointer text-center',
                importMode === 'mongodb'
                  ? 'border-[var(--material-item-border)] bg-[var(--material-bg-dark)]'
                  : 'border-gray-400',
              ]"
            >
              <p class="font-medium">导入 MongoDB</p>
              <p class="text-xs text-gray-400 mt-1">
                将数据导入到本地 MongoDB 数据库
              </p>
            </div>
          </div>
        </div>

        <!-- MongoDB导入选项 -->
        <div
          v-if="
            isFileType &&
            selectedFilePath &&
            importMode === 'mongodb' &&
            (selectedDbType === 'csv' || selectedDbType === 'sqlite')
          "
          class="mb-6"
        >
          <h3 class="text-lg font-medium mb-3">MongoDB 导入选项</h3>
          <div class="space-y-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-200">
                数据库名称 (可选)
              </label>
              <input
                v-model="mongoDbOptions.dbName"
                type="text"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                :placeholder="`默认: ${getDefaultDbName()}`"
              />
              <p class="text-xs text-gray-400">
                留空将使用默认名称: {{ getDefaultDbName() }}
              </p>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-200">
                集合名称 (可选)
              </label>
              <input
                v-model="mongoDbOptions.collName"
                type="text"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                :placeholder="`默认: ${getDefaultCollName()}`"
              />
              <p class="text-xs text-gray-400">
                留空将使用默认名称: {{ getDefaultCollName() }}
              </p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-3">
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
            {{ confirmButtonText }}
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

    <Toast ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { File, Loader } from "lucide-vue-next";
import { open } from "@tauri-apps/plugin-dialog";
import axios from "axios";
import {
  ConnectionConfig,
  FileProcessConfig,
  MongoImportConfig,
  databaseTypes,
} from "@/types/import";
import Toast from "@/components/ui/Toast.vue";

const showPanel = ref(false);
const selectedDbType = ref<string | null>(null);
const connectionConfig = ref<ConnectionConfig>({
  type: "",
  host: "localhost",
  port: "",
  username: "",
  password: "",
  database: "",
});
const selectedFilePath = ref<string>("");
const isLoading = ref(false);
const isLoadingMessage = ref("正在处理...");
const importMode = ref<"preview" | "mongodb">("preview");
const toast = ref<InstanceType<typeof Toast> | null>(null);

// CSV特定选项
const csvOptions = ref({
  delimiter: ",",
  hasHeader: true,
  encoding: "utf-8",
});

// MongoDB导入选项
const mongoDbOptions = ref({
  dbName: "",
  collName: "",
});

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
  return dbType?.fileExtensions?.join(", ") || "";
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
    return selectedFilePath.value !== "";
  }
});

const confirmButtonText = computed(() => {
  if (!selectedDbType.value) return "确认";

  if (isConnectionType.value) {
    return "连接数据库";
  } else {
    if (selectedDbType.value === "excel") {
      return "导入数据";
    } else if (importMode.value === "preview") {
      return "预览数据";
    } else {
      return "导入到MongoDB";
    }
  }
});

// 方法
const openPanel = () => {
  showPanel.value = true;
  selectedDbType.value = null;
  selectedFilePath.value = "";
  importMode.value = "preview";
  csvOptions.value = {
    delimiter: ",",
    hasHeader: true,
    encoding: "utf-8",
  };
  mongoDbOptions.value = {
    dbName: "",
    collName: "",
  };
  connectionConfig.value = {
    type: "",
    host: "localhost",
    port: "",
    username: "",
    password: "",
    database: "",
  };
};

const selectDatabaseType = (type: string) => {
  selectedDbType.value = type;
  selectedFilePath.value = "";
  const dbType = databaseTypes.find((t) => t.value === type);
  if (dbType?.isConnection && dbType.defaultPort) {
    connectionConfig.value.port = dbType.defaultPort;
    connectionConfig.value.type = type;
  }
};

// 使用Tauri API打开文件选择对话框
const openFileDialog = async () => {
  try {
    const dbType = databaseTypes.find((t) => t.value === selectedDbType.value);
    if (!dbType || !dbType.fileExtensions) return;

    // 构建文件选择器过滤器
    const filters = {
      name: `${dbType.label} 文件`,
      extensions: dbType.fileExtensions.map((ext) => ext.replace(".", "")),
    };

    // 打开文件选择对话框
    const selected = await open({
      multiple: false,
      filters: [filters],
    });

    if (selected && typeof selected === "string") {
      // 替换反斜杠为正斜杠
      selectedFilePath.value = selected.replace(/\\/g, "/");
      console.log("选择的文件路径:", selectedFilePath.value);
      // 重置相关选项
      if (selectedDbType.value === "csv") {
        importMode.value = "preview";
      }
    }
  } catch (error) {
    console.error("打开文件对话框失败:", error);
  }
};

const getFileName = (filePath: string): string => {
  if (!filePath) return "";
  // 获取文件名 (跨平台)
  const parts = filePath.split(/[\/\\]/);
  return parts[parts.length - 1];
};

const getDefaultDbName = (): string => {
  if (!selectedFilePath.value) return "";

  const fileName = getFileName(selectedFilePath.value);
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));

  if (selectedDbType.value === "csv") {
    return `csv_${nameWithoutExt}`;
  } else if (selectedDbType.value === "sqlite") {
    return `sqlite_${nameWithoutExt}`;
  }

  return nameWithoutExt;
};

const getDefaultCollName = (): string => {
  if (selectedDbType.value === "csv") {
    return "data";
  } else if (selectedDbType.value === "sqlite") {
    // 对于SQLite，默认使用表名作为集合名
    // 这里需要用户在界面上选择具体的表
    return "table_name";
  }
  return "data";
};

const confirm = async () => {
  if (!selectedDbType.value) return;

  isLoading.value = true;

  try {
    if (isConnectionType.value) {
      isLoadingMessage.value = `正在连接${selectedDbType.value}数据库...`;
      // 模拟连接延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: 连接数据库逻辑
    } else {
      // 文件类型处理
      if (importMode.value === "preview" || selectedDbType.value === "excel") {
        // 预览数据
        isLoadingMessage.value = `正在处理${selectedDbType.value}文件...`;

        let processConfig: FileProcessConfig = {
          type: selectedDbType.value,
          filePath: selectedFilePath.value,
        };

        // 添加CSV特定选项
        if (selectedDbType.value === "csv") {
          processConfig.options = { ...csvOptions.value };
        }

        // TODO: 处理文件逻辑
      } else if (importMode.value === "mongodb") {
        importCsvToMongo();
      }
    }

    showPanel.value = false;
    isLoading.value = false;
  } catch (error) {
    console.error("操作失败:", error);
    alert("操作失败，请检查配置或文件");
    toast.value?.add({
      severity: "error",
      summary: "操作失败",
      detail: `操作失败，请检查配置或文件`,
      life: 3000,
    });
    isLoading.value = false;
  }
};

const importCsvToMongo = () => {
  isLoadingMessage.value = `正在将${selectedDbType.value}数据导入到MongoDB...`;

  let importConfig: MongoImportConfig = {
    sourceType: selectedDbType.value || "",
    filePath: selectedFilePath.value,
  };

  // 添加特定选项
  if (selectedDbType.value === "csv") {
    importConfig.options = { ...csvOptions.value };
  }

  // 添加MongoDB选项
  if (mongoDbOptions.value.dbName) {
    importConfig.dbName = mongoDbOptions.value.dbName;
  }
  if (mongoDbOptions.value.collName) {
    importConfig.collName = mongoDbOptions.value.collName;
  }

  const apiUrl = "http://localhost:8080/api/datasource/csv/import-to-mongo";

  const requestData = {
    filePath: selectedFilePath.value,
    options: {
      delimiter: ",",
      hasHeader: true,
      encoding: "utf-8",
    },
    dbName: "csv_data",
    collName: "customers",
  };

  axios
    .post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("导入成功:", response.data);
      toast.value?.add({
        severity: "success",
        summary: "导入成功",
        detail: `数据已成功导入到MongoDB`,
        life: 3000,
      });
    })
    .catch((error) => {
      console.error("导入失败:", error);
      toast.value?.add({
        severity: "error",
        summary: "导入失败",
        detail: `数据导入失败，请检查配置或文件`,
        life: 3000,
      });
    });
};
</script>
