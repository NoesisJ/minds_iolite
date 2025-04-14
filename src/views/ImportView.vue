<template>
  <div class="relative transform-3d flex flex-col items-center justify-center">
    <!-- 主面板 -->
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-[var(--material-bg-light)] rounded-2xl shadow-xl w-full max-w-2xl h-[90%] p-6 overflow-auto"
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

        <div v-if="showPreview && connectionResult" class="mb-6">
          <h3 class="text-lg font-medium mb-3">数据库连接成功</h3>
          <div class="bg-gray-700 rounded-md p-4">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-400">主机</p>
                <p class="text-white">{{ connectionResult.host }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">端口</p>
                <p class="text-white">{{ connectionResult.port }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">数据库</p>
                <p class="text-white">{{ connectionResult.database }}</p>
              </div>
            </div>

            <!-- MongoDB 集合预览 -->
            <div
              v-if="
                selectedDbType === 'mongodb' && connectionResult.collections
              "
            >
              <h4 class="text-md font-medium mb-2">集合信息</h4>
              <div class="space-y-4">
                <div
                  v-for="(collection, name) in connectionResult.collections"
                  :key="name"
                  class="border border-gray-600 rounded-md p-3"
                >
                  <h5 class="font-medium text-white mb-2">{{ name }}</h5>
                  <div class="text-sm">
                    <p class="text-gray-400 mb-1">字段类型:</p>
                    <div class="flex flex-wrap gap-2 mb-2">
                      <span
                        v-for="(type, field) in collection.fields"
                        :key="field"
                        class="px-2 py-1 bg-gray-600 rounded text-xs"
                      >
                        {{ field }}: {{ type }}
                      </span>
                    </div>
                    <p class="text-gray-400 mb-1">示例数据:</p>
                    <pre
                      class="bg-gray-800 p-2 rounded text-xs overflow-auto"
                      >{{ formatJson(collection.sample_data) }}</pre
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- MySQL 表预览 -->
            <div v-if="selectedDbType === 'mysql' && connectionResult.tables">
              <h4 class="text-md font-medium mb-2">表信息</h4>
              <div class="space-y-4">
                <div
                  v-for="(table, name) in connectionResult.tables"
                  :key="name"
                  class="border border-gray-600 rounded-md p-3"
                >
                  <h5 class="font-medium text-white mb-2">{{ name }}</h5>
                  <div class="text-sm">
                    <p class="text-gray-400 mb-1">字段类型:</p>
                    <div class="flex flex-wrap gap-2 mb-2">
                      <span
                        v-for="(type, field) in table.fields"
                        :key="field"
                        class="px-2 py-1 bg-gray-600 rounded text-xs"
                      >
                        {{ field }}: {{ type }}
                      </span>
                    </div>
                    <p class="text-gray-400 mb-1">示例数据:</p>
                    <pre
                      class="bg-gray-800 p-2 rounded text-xs overflow-auto"
                      >{{ formatJson(table.sample_data) }}</pre
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文件数据预览 -->
        <div v-if="showPreview && previewData" class="mb-6">
          <h3 class="text-lg font-medium mb-3">文件数据预览</h3>
          <div class="bg-gray-700 rounded-md p-4">
            <div class="mb-4">
              <p class="text-sm text-gray-400 mb-1">字段类型:</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(type, field) in previewData.fields"
                  :key="field"
                  class="px-2 py-1 bg-gray-600 rounded text-xs"
                >
                  {{ field }}: {{ type }}
                </span>
              </div>
            </div>

            <div class="overflow-auto max-h-60">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-600">
                    <th
                      v-for="(type, field) in previewData.fields"
                      :key="field"
                      class="px-2 py-1 text-left text-gray-400"
                    >
                      {{ field }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in previewData.sampleData"
                    :key="index"
                    class="border-b border-gray-600"
                  >
                    <td
                      v-for="(type, field) in previewData.fields"
                      :key="field"
                      class="px-2 py-1 text-white"
                    >
                      {{ row[field] }}
                    </td>
                  </tr>
                </tbody>
              </table>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { File, Loader } from "lucide-vue-next";
import { open } from "@tauri-apps/plugin-dialog";
import axios from "axios";
import {
  ConnectionConfig,
  FileProcessConfig,
  MongoImportConfig,
  databaseTypes,
  DatabaseConnectionResult,
  PreviewData,
} from "@/types/import";
import Toast from "@/components/ui/Toast.vue";
import { setActiveSession } from "@/services/sessionStore";

// 状态管理
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
const connectionResult = ref<DatabaseConnectionResult | null>(null);
const previewData = ref<PreviewData | null>(null);
const showPreview = ref(false);

// 持久连接相关变量
const sessionId = ref<string>("");
const hasActiveSession = ref(false);
const refreshInterval = ref<number | null>(null);

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
    toast.value?.add({
      severity: "error",
      summary: "错误",
      detail: "打开文件对话框失败",
      life: 3000,
    });
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
      await connectToDatabase();
    } else {
      if (importMode.value === "preview" || selectedDbType.value === "excel") {
        await previewFileData();
      } else if (importMode.value === "mongodb") {
        await importCsvToMongo();
      }
    }
  } catch (error) {
    console.error("操作失败:", error);
    toast.value?.add({
      severity: "error",
      summary: "操作失败",
      detail: `操作失败，请检查配置或文件`,
      life: 3000,
    });
  }
};

const connectToDatabase = async () => {
  try {
    isLoading.value = true;
    isLoadingMessage.value = `正在连接${selectedDbType.value}数据库...`;

    let apiUrl = "";
    let requestData = {};

    if (selectedDbType.value === "mongodb") {
      apiUrl = "http://localhost:8080/api/datasource/mongodb/connect";
      requestData = {
        ConnectionURI: `mongodb://${connectionConfig.value.host}:${connectionConfig.value.port}`,
        Database: connectionConfig.value.database,
      };
    } else if (selectedDbType.value === "mysql") {
      apiUrl = "http://localhost:8080/api/datasource/mysql/connect";
      requestData = {
        host: connectionConfig.value.host,
        port: connectionConfig.value.port,
        username: connectionConfig.value.username,
        password: connectionConfig.value.password,
        database: connectionConfig.value.database,
      };
    }

    const response = await axios.post(apiUrl, requestData);
    connectionResult.value = response.data;

    console.log("连接结果:", connectionResult.value);

    toast.value?.add({
      severity: "success",
      summary: "连接成功",
      detail: `已成功连接到${selectedDbType.value}数据库`,
      life: 3000,
    });

    // 显示预览
    showPreview.value = true;
    
    // 创建持久连接
    if (selectedDbType.value) {
      await createPersistentSession(selectedDbType.value, requestData);
    }
  } catch (error) {
    console.error("连接失败:", error);
    toast.value?.add({
      severity: "error",
      summary: "连接失败",
      detail: `无法连接到${selectedDbType.value}数据库，请检查配置`,
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const previewFileData = async () => {
  try {
    isLoading.value = true;
    isLoadingMessage.value = `正在处理${selectedDbType.value}文件...`;

    let apiUrl = "";
    let requestData: FileProcessConfig = {
      type: selectedDbType.value || "",
      filePath: selectedFilePath.value,
    };

    if (selectedDbType.value === "csv") {
      requestData.options = { ...csvOptions.value };
      apiUrl = "http://localhost:8080/api/datasource/csv/preview";
    } else if (selectedDbType.value === "sqlite") {
      apiUrl = "http://localhost:8080/api/datasource/sqlite/preview";
    } else if (selectedDbType.value === "excel") {
      apiUrl = "http://localhost:8080/api/datasource/excel/preview";
    }

    const response = await axios.post(apiUrl, requestData);
    previewData.value = response.data;

    toast.value?.add({
      severity: "success",
      summary: "处理成功",
      detail: `文件处理完成`,
      life: 3000,
    });

    // 显示预览
    showPreview.value = true;
  } catch (error) {
    console.error("文件处理失败:", error);
    toast.value?.add({
      severity: "error",
      summary: "处理失败",
      detail: `无法处理文件，请检查文件格式`,
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const importCsvToMongo = async () => {
  try {
    isLoading.value = true;
    isLoadingMessage.value = `正在将${selectedDbType.value}数据导入到MongoDB...`;

    const importConfig: MongoImportConfig = {
      sourceType: selectedDbType.value || "",
      filePath: selectedFilePath.value,
    };

    if (selectedDbType.value === "csv") {
      importConfig.options = { ...csvOptions.value };
    }

    if (mongoDbOptions.value.dbName) {
      importConfig.dbName = mongoDbOptions.value.dbName;
    }
    if (mongoDbOptions.value.collName) {
      importConfig.collName = mongoDbOptions.value.collName;
    }

    const apiUrl = "http://localhost:8080/api/datasource/csv/import-to-mongo";

    const response = await axios.post(apiUrl, importConfig);
    const importResult = response.data;

    console.log("CSV导入MongoDB结果:", importResult);

    toast.value?.add({
      severity: "success",
      summary: "导入成功",
      detail: `数据已成功导入到MongoDB`,
      life: 3000,
    });
    
    // 显示导入后的MongoDB连接信息
    connectionResult.value = importResult;
    showPreview.value = true;
    
    // 为导入的CSV数据创建持久连接
    await createPersistentSession("mongodb", importResult);
  } catch (error) {
    console.error("导入失败:", error);
    toast.value?.add({
      severity: "error",
      summary: "导入失败",
      detail: `数据导入失败，请检查配置或文件`,
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const formatJson = (jsonStr: string) => {
  try {
    const jsonObj = JSON.parse(jsonStr);
    return JSON.stringify(jsonObj, null, 2); // 缩进2空格
  } catch {
    return jsonStr; // 失败时返回原始字符串
  }
};

// 生命周期钩子
onMounted(() => {
  // 检查是否有保存的会话ID
  const savedSessionId = localStorage.getItem("dbSessionId");
  if (savedSessionId !== null) {
    sessionId.value = savedSessionId;
    checkSession(savedSessionId);
  }
});

onBeforeUnmount(() => {
  // 组件卸载前清理
  if (refreshInterval.value) {
    window.clearInterval(refreshInterval.value);
  }
});

// 检查保存的会话是否有效
const checkSession = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/sessions/${id}`);
    if (response.data.success) {
      hasActiveSession.value = true;
      // 恢复会话状态
      const sessionState = response.data.state;
      // 更新UI显示会话信息
      connectionResult.value = {
        host: sessionState.info.host,
        port: sessionState.info.port,
        username: sessionState.info.username,
        password: "", // 添加空密码以满足类型要求
        database: sessionState.info.database,
        collections: sessionState.collections,
        tables: sessionState.tables
      };
      selectedDbType.value = sessionState.info.type;
      
      // 开始定期刷新会话
      startSessionRefresh();
      
      toast.value?.add({
        severity: "info",
        summary: "会话已恢复",
        detail: `已恢复到之前的${selectedDbType.value}数据库连接`,
        life: 3000,
      });
    }
  } catch (error) {
    console.log("保存的会话已失效:", error);
    // 清除无效的会话ID
    localStorage.removeItem("dbSessionId");
    sessionId.value = "";
    hasActiveSession.value = false;
  }
};

// 开始定期刷新会话
const startSessionRefresh = () => {
  if (refreshInterval.value) {
    window.clearInterval(refreshInterval.value);
  }
  
  // 每10分钟刷新一次会话
  refreshInterval.value = window.setInterval(() => {
    if (sessionId.value) {
      refreshSession();
    }
  }, 10 * 60 * 1000); // 10分钟
};

// 刷新会话
const refreshSession = async () => {
  if (!sessionId.value) return;
  
  try {
    await axios.put(`http://localhost:8080/api/sessions/${sessionId.value}/refresh`);
    console.log("会话已刷新");
  } catch (error) {
    console.error("会话刷新失败:", error);
    // 如果刷新失败，可能是会话已过期
    localStorage.removeItem("dbSessionId");
    sessionId.value = "";
    hasActiveSession.value = false;
    
    if (refreshInterval.value) {
      window.clearInterval(refreshInterval.value);
      refreshInterval.value = null;
    }
    
    toast.value?.add({
      severity: "error",
      summary: "会话已失效",
      detail: "数据库会话已失效，请重新连接",
      life: 3000,
    });
  }
};

// 关闭会话
const closeSession = async () => {
  if (!sessionId.value) return;
  
  try {
    await axios.delete(`http://localhost:8080/api/sessions/${sessionId.value}`);
    console.log("会话已关闭");
    
    // 清理会话状态
    localStorage.removeItem("dbSessionId");
    sessionId.value = "";
    hasActiveSession.value = false;
    
    if (refreshInterval.value) {
      window.clearInterval(refreshInterval.value);
      refreshInterval.value = null;
    }
    
    toast.value?.add({
      severity: "info",
      summary: "会话已关闭",
      detail: "数据库会话已关闭",
      life: 3000,
    });
  } catch (error) {
    console.error("关闭会话失败:", error);
  }
};

// 创建持久连接
const createPersistentSession = async (type: string, connectionInfo: any) => {
  try {
    isLoadingMessage.value = `正在创建持久连接...`;
    
    // 先关闭已有的会话
    if (sessionId.value) {
      await closeSession();
    }
    
    // 构建请求数据
    let requestData: any = {
      type: type
    };
    
    // 根据不同类型构建参数
    if (type === "mongodb") {
      if (connectionInfo.host && connectionInfo.port) {
        requestData.host = connectionInfo.host;
        requestData.port = connectionInfo.port;
        requestData.database = connectionInfo.database;
        
        // 如果是从CSV导入，添加集合信息
        if (connectionInfo.collections) {
          requestData.collections = connectionInfo.collections;
        }
      } else if (connectionInfo.ConnectionURI) {
        requestData.uri = connectionInfo.ConnectionURI;
        requestData.database = connectionInfo.Database;
      }
    } else if (type === "mysql") {
      requestData.host = connectionInfo.host;
      requestData.port = connectionInfo.port;
      requestData.username = connectionInfo.username;
      requestData.password = connectionInfo.password;
      requestData.database = connectionInfo.database;
    } else if (type === "csv") {
      // CSV通过MongoDB连接实现持久化
      requestData.type = "mongodb";
      requestData.host = "localhost"; // 本地MongoDB服务器
      requestData.port = 27017;
      
      // 使用导入CSV时指定的数据库名
      const dbName = mongoDbOptions.value.dbName || getDefaultDbName();
      requestData.database = dbName;
    }
    
    // 创建持久会话
    const response = await axios.post("http://localhost:8080/api/sessions", requestData);
    
    if (response.data.success) {
      sessionId.value = response.data.sessionId;
      hasActiveSession.value = true;
      
      // 保存会话ID
      localStorage.setItem("dbSessionId", sessionId.value);
      
      // 保存会话信息到sessionStore，用于表格组件自动获取
      setActiveSession({
        sessionId: response.data.sessionId,
        type: requestData.type,
        database: requestData.database,
        collection: selectedDbType.value === 'csv' ? mongoDbOptions.value.collName || getFileName(selectedFilePath.value).split('.')[0] : undefined
      });
      
      // 开始定期刷新会话
      startSessionRefresh();
      
      console.log("创建持久连接成功:", response.data);
      
      toast.value?.add({
        severity: "success",
        summary: "持久连接已建立",
        detail: `已建立${type}数据库的持久连接`,
        life: 3000,
      });
    }
  } catch (error) {
    console.error("创建持久连接失败:", error);
    toast.value?.add({
      severity: "error",
      summary: "创建持久连接失败",
      detail: "无法建立持久连接，请重试",
      life: 3000,
    });
  }
};
</script>
