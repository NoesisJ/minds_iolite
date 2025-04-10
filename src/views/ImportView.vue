<template>
  <div class="flex flex-col items-center justify-center">
    <!-- 触发按钮 -->
    <button
      @click="openFileDialog"
      class="px-4 py-2 bg-[var(--material-red)] text-white rounded-lg hover:bg-[var(--material-red-dark)] transition-colors"
    >
      导入数据库文件
    </button>

    <!-- 文件选择输入 (隐藏) -->
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept=".db,.osv,.sqlite,.sqlite3"
      @change="handleFileChange"
    />

    <!-- 对话框 -->
    <div
      v-if="showDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-semibold mb-4">选择数据库文件</h2>

        <div class="mb-6">
          <p class="text-gray-600 mb-4">
            请选择.db或.osv格式的数据库文件作为新数据库的基础
          </p>

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
                支持 .db, .osv, .sqlite 文件
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
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="cancelImport"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="confirmImport"
            :disabled="!selectedFile"
            :class="[
              'px-4 py-2 rounded-md text-white',
              selectedFile
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-300 cursor-not-allowed',
            ]"
          >
            确认导入
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
        <p class="mt-4 text-gray-700">正在处理数据库文件，请稍候...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { File, Loader, Upload } from "lucide-vue-next";

// 定义组件发出的事件
const emit = defineEmits<{
  (e: "file-selected", file: File): void;
}>();

// 响应式状态
const fileInput = ref<HTMLInputElement | null>(null);
const showDialog = ref(false);
const dragActive = ref(false);
const selectedFile = ref<File | null>(null);
const isLoading = ref(false);

// 打开文件对话框
const openFileDialog = () => {
  showDialog.value = true;
  selectedFile.value = null;
};

// 触发隐藏的文件输入
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 处理文件选择变化
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
  }
};

// 处理拖放相关事件
const handleDragOver = () => {
  dragActive.value = true;
};

const handleDrop = (event: DragEvent) => {
  dragActive.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    // 检查文件扩展名
    const validExtensions = [".db", ".osv", ".sqlite", ".sqlite3"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (validExtensions.includes(fileExtension)) {
      selectedFile.value = file;
    } else {
      alert("请选择有效的数据库文件 (.db, .osv, .sqlite)");
    }
  }
};

// 取消导入
const cancelImport = () => {
  showDialog.value = false;
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// 确认导入
const confirmImport = async () => {
  if (!selectedFile.value) return;

  isLoading.value = true;

  try {
    // 这里可以添加文件处理逻辑，例如：
    // 1. 验证文件内容
    // 2. 解析文件
    // 3. 创建新数据库

    // 模拟处理延迟
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 发出事件，父组件可以处理文件
    emit("file-selected", selectedFile.value);

    // 重置状态
    showDialog.value = false;
    isLoading.value = false;
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  } catch (error) {
    console.error("处理数据库文件时出错:", error);
    alert("处理数据库文件时出错，请检查文件格式");
    isLoading.value = false;
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>
