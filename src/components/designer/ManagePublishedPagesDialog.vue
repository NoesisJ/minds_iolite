<template>
  <div v-if="show" class="manage-dialog-overlay" @click="onClose">
    <div class="manage-dialog-container" @click.stop>
      <div class="dialog-header">
        <h2 class="text-xl font-medium text-gray-800 dark:text-white">
          管理已发布页面
        </h2>
        <button
          @click="onClose"
          class="close-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="dialog-content">
        <div v-if="publishedPages.length === 0" class="empty-state">
          <i class="pi pi-info-circle text-3xl mb-3 text-gray-400"></i>
          <div class="text-gray-500 dark:text-gray-400">暂无已发布页面</div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            使用"发布到侧边栏"功能将设计器页面发布到侧边栏
          </div>
        </div>

        <div v-else class="published-pages-list">
          <div
            v-for="page in publishedPages"
            :key="page.id"
            class="published-page-item"
          >
            <div class="page-info">
              <div class="flex items-center">
                <i :class="[page.icon, 'page-icon']"></i>
                <div class="page-title">{{ page.title }}</div>
              </div>
              <div class="page-meta">
                <div class="page-route">路径: {{ page.route }}</div>
                <div class="page-date">
                  发布时间: {{ formatDate(page.createdAt) }}
                </div>
              </div>
            </div>
            <div class="page-actions">
              <button
                @click="openPage(page)"
                class="action-btn view-btn"
                title="查看页面"
              >
                <i class="pi pi-eye"></i>
              </button>
              <button
                @click="confirmDelete(page)"
                class="action-btn delete-btn"
                title="取消发布"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button
          class="btn-close px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          @click="onClose"
        >
          关闭
        </button>
      </div>
    </div>

    <!-- 确认删除对话框 -->
    <div
      v-if="showConfirmDelete"
      class="confirm-dialog-overlay"
      @click.stop="showConfirmDelete = false"
    >
      <div class="confirm-dialog-container">
        <div class="confirm-dialog-header">
          <h3 class="text-lg font-medium text-gray-800 dark:text-white">
            确认取消发布
          </h3>
        </div>
        <div class="confirm-dialog-content">
          <p class="text-gray-600 dark:text-gray-300">
            确定要取消发布页面 "{{ pageToDelete?.title }}"
            吗？此操作将从侧边栏中移除该页面。
          </p>
        </div>
        <div class="confirm-dialog-footer">
          <button
            class="btn-cancel px-3 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="showConfirmDelete = false"
          >
            取消
          </button>
          <button
            class="btn-delete px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 ml-2"
            @click="deletePage"
          >
            确定取消发布
          </button>
        </div>
      </div>
    </div>

    <!-- 错误消息对话框 -->
    <MessageDialog
      v-model:visible="showErrorMessage"
      :message="errorMessage"
      title="操作失败"
      type="error"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import {
  unpublishPage,
  PublishedPage,
} from "@/services/publishedPagesService";
import MessageDialog from "@/components/information/MessageDialog.vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "unpublish-success"]);

const router = useRouter();
const publishedPages = ref<PublishedPage[]>([]);
const showConfirmDelete = ref(false);
const pageToDelete = ref<PublishedPage | null>(null);

// 错误消息对话框状态
const showErrorMessage = ref(false);
const errorMessage = ref("");

// 加载已发布页面
function loadPublishedPages() {
  try {
    const pages = JSON.parse(localStorage.getItem("published_pages") || "[]");
    publishedPages.value = pages;
  } catch (error) {
    console.error("加载已发布页面失败:", error);
    publishedPages.value = [];
  }
}

// 格式化日期
function formatDate(timestamp: number): string {
  if (!timestamp) return "未知";
  const date = new Date(timestamp);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 打开页面
function openPage(page: PublishedPage) {
  onClose();
  router.push(page.route);
}

// 确认删除页面
function confirmDelete(page: PublishedPage) {
  pageToDelete.value = page;
  showConfirmDelete.value = true;
}

// 删除页面
async function deletePage() {
  if (!pageToDelete.value) return;

  try {
    await unpublishPage(pageToDelete.value.id);
    emit("unpublish-success", pageToDelete.value);
    showConfirmDelete.value = false;
    loadPublishedPages(); // 重新加载列表
  } catch (error: any) {
    errorMessage.value = error.message || "取消发布失败";
    showErrorMessage.value = true;
  }
}

// 关闭对话框
function onClose() {
  emit("close");
}

// 组件挂载时加载页面
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      loadPublishedPages();
    }
  }
);

onMounted(() => {
  if (props.show) {
    loadPublishedPages();
  }
});
</script>

<style scoped>
.manage-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.manage-dialog-container {
  width: 95%;
  max-width: 700px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-content {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
  max-height: 60vh;
}

.dialog-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.published-page-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.published-page-item:hover {
  background-color: #f9fafb;
}

.published-page-item:last-child {
  border-bottom: none;
}

.page-info {
  flex-grow: 1;
}

.page-icon {
  font-size: 18px;
  color: #4b5563;
  margin-right: 10px;
}

.page-title {
  font-weight: 500;
  font-size: 16px;
  color: #111827;
  margin-bottom: 4px;
}

.page-meta {
  display: flex;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.page-route {
  margin-right: 16px;
}

.page-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-btn {
  color: #3b82f6;
}

.view-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

/* 确认对话框样式 */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.confirm-dialog-container {
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.confirm-dialog-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.confirm-dialog-content {
  padding: 20px;
}

.confirm-dialog-footer {
  padding: 12px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

/* 深色模式 */
:global(.dark) .manage-dialog-container,
:global(.dark) .confirm-dialog-container {
  background-color: #1f2937;
  color: #f9fafb;
}

:global(.dark) .dialog-header,
:global(.dark) .dialog-footer,
:global(.dark) .confirm-dialog-header,
:global(.dark) .confirm-dialog-footer {
  border-color: #374151;
}

:global(.dark) .published-page-item {
  border-color: #374151;
}

:global(.dark) .published-page-item:hover {
  background-color: #111827;
}

:global(.dark) .page-title {
  color: #f9fafb;
}

:global(.dark) .page-meta {
  color: #9ca3af;
}

:global(.dark) .page-icon {
  color: #d1d5db;
}
</style>
