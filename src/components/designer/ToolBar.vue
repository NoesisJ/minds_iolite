<template>
  <div
    class="px-3 bg-[#262624] border-b border-[var(--material-item-border)] flex items-center justify-between"
  >
    <div class="left-section flex items-center space-x-4">
      <BaseButton
        status="primary"
        @click="createNewPage"
        class="flex items-center"
      >
        <i class="pi pi-plus mr-1.5"></i>
        新页面
      </BaseButton>

      <div class="relative">
        <BaseButton
          status="primary"
          @click="togglePageMenu"
          class="flex items-center min-w-[90px]"
        >
          <span class="text-gray-200">{{ currentPageName || "选择页面" }}</span>
          <i class="pi pi-chevron-down ml-1.5 text-gray-400"></i>
        </BaseButton>

        <div
          v-show="showPageMenu"
          class="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 w-48"
        >
          <div class="py-1 max-h-[250px] overflow-y-auto">
            <div
              v-for="page in designerStore.pages"
              :key="page.id"
              @click="handlePageSelection(page.id)"
              class="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between text-gray-200"
            >
              <span>{{ page.title }}</span>
              <i
                v-if="page.id === currentPageId"
                class="pi pi-check text-green-500"
              ></i>
            </div>
            <div
              v-if="designerStore.pages.length === 0"
              class="px-4 py-2 text-gray-400 text-sm italic"
            >
              无可用页面
            </div>
          </div>
        </div>
      </div>

      <BaseButton
        status="primary"
        @click="openManagePublishedPagesDialog"
        class="flex items-center"
      >
        <i class="pi pi-list mr-1.5"></i>
        <span class="text-white">管理已发布页面</span>
      </BaseButton>
    </div>

    <div class="right-section flex items-center space-x-4">
      <BaseButton
        status="danger"
        @click="openPublishToSidebarDialog"
        :disabled="!currentPageId"
        class="flex items-center"
      >
        <i class="pi pi-share-alt mr-1.5"></i>
        <span class="text-white">发布到侧边栏</span>
      </BaseButton>

      <BaseButton
        status="danger"
        @click="openViewer"
        :disabled="!currentPageId"
        class="flex items-center"
      >
        <i class="pi pi-desktop mr-1.5"></i>
        <span class="text-white">阅览</span>
      </BaseButton>

      <BaseButton
        status="success"
        @click="savePage"
        :disabled="!currentPageId"
        class="flex items-center"
      >
        <i class="pi pi-save mr-1.5"></i>
        <span class="text-white">保存</span>
      </BaseButton>
    </div>

    <!-- 预览模态框 -->
    <PreviewModal
      :show="showPreview"
      :page="designerStore.currentPage"
      @close="showPreview = false"
    />

    <!-- 发布到侧边栏对话框 -->
    <PublishToSidebarDialog
      :show="showPublishToSidebarDialog"
      @close="showPublishToSidebarDialog = false"
      @publish-success="handlePublishToSidebarSuccess"
    />

    <!-- 管理已发布页面对话框 -->
    <ManagePublishedPagesDialog
      :show="showManagePublishedPagesDialog"
      @close="showManagePublishedPagesDialog = false"
      @unpublish-success="handleUnpublishSuccess"
    />

    <!-- 消息对话框 -->
    <MessageDialog
      v-model:visible="showMessageDialog"
      :message="messageDialogContent.message"
      :title="messageDialogContent.title"
      :type="messageDialogContent.type"
      :button-label="messageDialogContent.buttonLabel"
    />

    <Toast ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useDesignerStore } from "@/stores/designerStore";
import BaseButton from "@/components/Form/Buttons/BaseButton.vue";
import PreviewModal from "./PreviewModal.vue";
import PublishToSidebarDialog from "./PublishToSidebarDialog.vue";
import ManagePublishedPagesDialog from "./ManagePublishedPagesDialog.vue";
import { useRouter } from "vue-router";
import MessageDialog from "@/components/information/MessageDialog.vue";
import Toast from "@/components/ui/Toast.vue";

const toast = ref<InstanceType<typeof Toast> | null>(null);
const designerStore = useDesignerStore();
const router = useRouter();

// 状态管理
const showPageMenu = ref(false);
const showPreview = ref(false);
const showPublishToSidebarDialog = ref(false);
const showManagePublishedPagesDialog = ref(false);

// 消息对话框状态
const showMessageDialog = ref(false);
const messageDialogContent = ref({
  message: "",
  title: "消息",
  type: "info",
  buttonLabel: "确定",
});

// 计算属性
const currentPageId = computed(() => designerStore.currentPageId);
const currentPageName = computed(() => {
  const currentPage = designerStore.pages.find(
    (page) => page.id === currentPageId.value
  );
  return currentPage ? currentPage.title : "";
});

// 方法
const createNewPage = () => {
  console.log("创建新页面");
  const newPageId = designerStore.createPage();
  console.log("新页面已创建，ID:", newPageId);
};

const togglePageMenu = () => {
  showPageMenu.value = !showPageMenu.value;
};

const handlePageSelection = (pageId: string) => {
  console.log("工具栏选择页面:", pageId);

  // 调用 Store 的方法，而不是直接设置属性
  designerStore.selectPage(pageId);

  // 关闭菜单
  setTimeout(() => {
    showPageMenu.value = false;
  }, 50);
};

// 显示消息对话框
const showMessage = (message: string, options: any = {}) => {
  messageDialogContent.value = {
    message,
    title: options.title || "消息",
    type: options.type || "info",
    buttonLabel: options.buttonLabel || "确定",
  };
  showMessageDialog.value = true;
};

const savePage = () => {
  const success = designerStore.saveToLocalStorage();

  if (success) {
    toast.value?.add({
      severity: "success",
      summary: "成功",
      detail: "保存成功",
      life: 3000,
    });
  } else {
    toast.value?.add({
      severity: "error",
      summary: "错误",
      detail: "保存失败，请检查浏览器存储权限",
      life: 3000,
    });
  }
};

// 打开阅览器视图
const openViewer = () => {
  const currentPage = designerStore.currentPage;
  if (!currentPage) {
    showMessage("请先选择或创建页面", { type: "warning" });
    return;
  }

  // 保存当前状态
  designerStore.saveToLocalStorage();

  // 导航到阅览页面
  router.push({
    name: "Viewer",
    params: { id: currentPage.id },
  });
};

// 发布相关方法
const openPublishToSidebarDialog = () => {
  showPublishToSidebarDialog.value = true;
};

const openManagePublishedPagesDialog = () => {
  showManagePublishedPagesDialog.value = true;
};

const handlePublishToSidebarSuccess = (publishedPage: any) => {
  console.log("页面已发布到侧边栏:", publishedPage);
  showMessage(
    `页面"${publishedPage.title}"已成功发布到侧边栏！刷新页面后即可在侧边栏中查看。`,
    { type: "success", title: "发布成功" }
  );
};

const handleUnpublishSuccess = (page: any) => {
  console.log("页面已取消发布:", page);
  showMessage(`页面"${page.title}"已成功从侧边栏移除！刷新页面后生效。`, {
    type: "success",
    title: "取消发布成功",
  });
};

// 初始化主题
onMounted(() => {
  // 点击外部关闭下拉菜单
  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".relative") && showPageMenu.value) {
      showPageMenu.value = false;
    }
  });
});
</script>
