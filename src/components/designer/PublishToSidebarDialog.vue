<template>
  <div v-if="show" class="publish-dialog-overlay" @click="onClose">
    <div class="publish-dialog-container bg-gray-700"  @click.stop >
      <div class="dialog-header">
        <h2 class="text-xl font-medium text-white">发布到侧边栏</h2>
        <button
          @click="onClose"
          class="close-btn text-gray-400 hover:text-gray-200"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="dialog-content">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >选择页面</label
          >
          <select
            v-model="selectedPageId"
            class="form-select w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-3 py-2"
          >
            <option value="">选择要发布的页面</option>
            <option v-for="page in pages" :key="page.id" :value="page.id">
              {{ page.title || "未命名页面" }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >菜单标题</label
          >
          <input
            v-model="menuTitle"
            class="form-input w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-3 py-2"
            placeholder="侧边栏显示的名称"
          />
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >菜单图标</label
          >
          <select
            v-model="menuIcon"
            class="form-select w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-3 py-2"
          >
            <option value="pi pi-file">文档图标</option>
            <option value="pi pi-users">用户图标</option>
            <option value="pi pi-chart-bar">图表图标</option>
            <option value="pi pi-database">数据库图标</option>
            <option value="pi pi-cog">设置图标</option>
            <option value="pi pi-calendar">日历图标</option>
            <option value="pi pi-inbox">收件箱图标</option>
            <option value="pi pi-list">列表图标</option>
            <option value="pi pi-pencil">编辑图标</option>
            <option value="pi pi-eye">查看图标</option>
          </select>
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >路由路径</label
          >
          <input
            v-model="routePath"
            class="form-input w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-3 py-2"
            placeholder="/my-page"
          />
          <div class="form-hint text-xs text-gray-400 mt-1">
            路径必须以'/'开头，例如: /dashboard/analytics
          </div>
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >父菜单</label
          >
          <select
            v-model="parentMenu"
            class="form-select w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-3 py-2"
          >
            <option value="">无 (顶级菜单)</option>
            <option value="finance">财务管理</option>
            <option value="material">物资管理</option>
            <option value="charts">图表</option>
            <option value="forms">表单</option>
          </select>
        </div>
      </div>

      <div class="dialog-footer">
        <button
          class="btn-cancel px-4 py-2 rounded text-gray-300 hover:bg-gray-700 mr-2"
          @click="onClose"
        >
          取消
        </button>
        <button
          class="btn-publish px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="publishToSidebar"
          :disabled="!isFormValid"
        >
          发布
        </button>
      </div>
    </div>

    <!-- 确认覆盖对话框 -->
    <ConfirmDialog
      v-model:visible="showOverwriteConfirm"
      :message="overwriteConfirmMessage"
      title="确认覆盖"
      type="warning"
      @confirm="handleOverwriteConfirm"
    />

    <!-- 错误消息对话框 -->
    <MessageDialog
      v-model:visible="showErrorMessage"
      :message="errorMessage"
      title="发布失败"
      type="error"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useDesignerStore } from "@/stores/designerStore";
import { publishPage } from "@/services/publishedPagesService";
import ConfirmDialog from "@/components/information/ConfirmDialog.vue";
import MessageDialog from "@/components/information/MessageDialog.vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "publish-success"]);

const designerStore = useDesignerStore();

// 表单数据
const selectedPageId = ref("");
const menuTitle = ref("");
const menuIcon = ref("pi pi-file");
const routePath = ref("");
const parentMenu = ref("");

// 获取设计器中的页面
const pages = computed(() => designerStore.pages);

// 表单验证
const isFormValid = computed(() => {
  return (
    selectedPageId.value &&
    menuTitle.value &&
    routePath.value &&
    routePath.value.startsWith("/")
  );
});

// 当显示对话框时，默认选中当前页面
watch(
  () => props.show,
  (newVal) => {
    if (newVal && designerStore.currentPageId) {
      selectedPageId.value = designerStore.currentPageId;

      // 设置默认值
      const currentPage = designerStore.pages.find(
        (p) => p.id === designerStore.currentPageId
      );
      if (currentPage) {
        menuTitle.value = currentPage.title || "";
        // 生成默认路由路径，移除特殊字符并转为小写
        const pageName = (currentPage.name || currentPage.title || "")
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-");
        routePath.value = "/" + pageName;
      }
    }
  },
  { immediate: true }
);

// 确认覆盖对话框状态
const showOverwriteConfirm = ref(false);
const overwriteConfirmMessage = ref("");
const overwritePendingResult = ref<any>(null);

// 错误消息对话框状态
const showErrorMessage = ref(false);
const errorMessage = ref("");

// 关闭对话框
function onClose() {
  emit("close");
}

// 发布到侧边栏
async function publishToSidebar() {
  if (!isFormValid.value) return;

  try {
    // 1. 获取选中的页面数据
    const selectedPage = designerStore.pages.find(
      (p) => p.id === selectedPageId.value
    );
    if (!selectedPage) {
      throw new Error("未找到选中的页面");
    }

    // 2. 发布页面
    const result = await publishPage(selectedPage, {
      title: menuTitle.value,
      icon: menuIcon.value,
      route: routePath.value,
      parentMenu: parentMenu.value,
    });

    // 检查是否需要确认覆盖
    if (
      "needsOverwriteConfirmation" in result &&
      result.needsOverwriteConfirmation
    ) {
      overwriteConfirmMessage.value = `路径 "${routePath.value}" 已被页面 "${result.existingPage.title}" 使用。\n\n是否覆盖现有页面？`;
      overwritePendingResult.value = result;
      showOverwriteConfirm.value = true;
      return;
    }

    // 3. 通知成功
    emit("publish-success", result);

    // 4. 关闭对话框
    onClose();
  } catch (error: any) {
    errorMessage.value = error.message || "发布失败，请检查配置";
    showErrorMessage.value = true;
  }
}

// 处理覆盖确认
async function handleOverwriteConfirm() {
  try {
    if (!overwritePendingResult.value) return;

    // 用户确认覆盖，使用提供的确认方法
    const publishedPage = await overwritePendingResult.value.confirmOverwrite();

    // 通知成功
    emit("publish-success", publishedPage);

    // 关闭对话框
    onClose();
  } catch (error: any) {
    errorMessage.value = error.message || "覆盖页面失败，请重试";
    showErrorMessage.value = true;
  }
}
</script>

<style scoped>
.publish-dialog-overlay {
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

.publish-dialog-container {
  width: 95%;
  max-width: 500px;
  background-color: #303030;
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
}

.dialog-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
}

.form-group {
  margin-bottom: 16px;
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

/* 深色模式 */
:global(.dark) .publish-dialog-container {
  background-color: #1f2937;
  color: #f9fafb;
}

:global(.dark) .dialog-header {
  border-bottom-color: #374151;
}

:global(.dark) .dialog-footer {
  border-top-color: #374151;
}
</style>
