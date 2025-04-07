<template>
  <div
    class="toolbar p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
  >
    <div class="left-section flex items-center space-x-4">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white">
        页面设计器
      </h1>

      <base-button
        status="primary"
        size="small"
        @click="createNewPage"
        class="flex items-center"
      >
        <i class="pi pi-plus mr-1.5"></i>
        新页面
      </base-button>

      <div class="relative">
        <base-button
          status="default"
          size="small"
          @click="togglePageMenu"
          class="flex items-center min-w-[120px]"
        >
          <span class="text-gray-700 dark:text-gray-200">{{
            currentPageName || "选择页面"
          }}</span>
          <i
            class="pi pi-chevron-down ml-1.5 text-gray-500 dark:text-gray-400"
          ></i>
        </base-button>

        <div
          v-show="showPageMenu"
          class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10 w-48"
        >
          <div class="py-1 max-h-[250px] overflow-y-auto">
            <div
              v-for="page in designerStore.pages"
              :key="page.id"
              @click="handlePageSelection(page.id)"
              class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between text-gray-700 dark:text-gray-200"
            >
              <span>{{ page.title }}</span>
              <i
                v-if="page.id === currentPageId"
                class="pi pi-check text-green-500"
              ></i>
            </div>
            <div
              v-if="designerStore.pages.length === 0"
              class="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm italic"
            >
              无可用页面
            </div>
          </div>
        </div>
      </div>

      <base-button
        status="default"
        size="small"
        @click="openPageSettings"
        :disabled="!currentPageId"
        class="flex items-center"
      >
        <i class="pi pi-cog mr-1.5"></i>
        <span class="text-gray-700 dark:text-gray-200">页面设置</span>
      </base-button>
    </div>

    <div class="right-section flex items-center space-x-4">
      <base-button
        status="success"
        size="small"
        @click="openPublishToSidebarDialog"
        :disabled="!currentPageId"
        class="flex items-center"
      >
        <i class="pi pi-share-alt mr-1.5"></i>
        <span class="text-white">发布到侧边栏</span>
      </base-button>

      <base-button
        status="info"
        size="small"
        @click="openManagePublishedPagesDialog"
        class="flex items-center"
      >
        <i class="pi pi-list mr-1.5"></i>
        <span class="text-white">管理已发布页面</span>
      </base-button>

      <base-button
        status="default"
        size="small"
        @click="openViewer"
        :disabled="!currentPageId"
        class="flex items-center"
      >
        <i class="pi pi-desktop mr-1.5"></i>
        <span class="text-gray-700 dark:text-gray-200">阅览</span>
      </base-button>

      <base-button
        status="info"
        size="small"
        @click="previewPage"
        :disabled="!currentPageId"
        class="flex items-center"
      >
        <i class="pi pi-eye mr-1.5"></i>
        <span class="text-white">预览</span>
      </base-button>

      <base-button
        status="success"
        size="small"
        @click="savePage"
        :disabled="!currentPageId"
        class="flex items-center"
      >
        <i class="pi pi-save mr-1.5"></i>
        <span class="text-white">保存</span>
      </base-button>

      <div class="theme-toggle cursor-pointer p-2" @click="toggleTheme">
        <i
          class="pi"
          :class="[
            isDarkMode ? 'pi-sun text-yellow-400' : 'pi-moon text-indigo-600',
          ]"
        ></i>
      </div>
    </div>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useDesignerStore } from "@/stores/designerStore";
import BaseButton from "@/components/Form/Buttons/BaseButton.vue";
import PreviewModal from "./PreviewModal.vue";
import PublishToSidebarDialog from "./PublishToSidebarDialog.vue";
import ManagePublishedPagesDialog from "./ManagePublishedPagesDialog.vue";
import { useRouter } from "vue-router";

const designerStore = useDesignerStore();
const router = useRouter();

// 状态管理
const showPageMenu = ref(false);
const isDarkMode = ref(false);
const showPreview = ref(false);
const showPublishToSidebarDialog = ref(false);
const showManagePublishedPagesDialog = ref(false);

// 计算属性
const currentPageId = computed(() => designerStore.currentPageId);
const currentPageName = computed(() => {
  const currentPage = designerStore.pages.find(
    (page) => page.id === currentPageId.value
  );
  return currentPage ? currentPage.title : "";
});
const hasPages = computed(() => designerStore.pages.length > 0);

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

const openPageSettings = () => {
  // 实现页面设置功能
  console.log("打开页面设置");
};

const previewPage = () => {
  if (!designerStore.currentPage) {
    alert("请先选择或创建页面");
    return;
  }

  showPreview.value = true;
};

const savePage = () => {
  const success = designerStore.saveToLocalStorage();

  if (success) {
    // 可以在这里添加保存成功的提示，比如使用一个简单的alert或自定义UI组件
    alert("页面已保存到本地存储");
  } else {
    alert("保存失败，请检查浏览器存储权限");
  }
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle("dark", isDarkMode.value);
  localStorage.setItem("darkMode", isDarkMode.value ? "true" : "false");
};

// 打开阅览器视图
const openViewer = () => {
  const currentPage = designerStore.currentPage;
  if (!currentPage) {
    alert("请先选择或创建页面");
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
  alert(
    `页面"${publishedPage.title}"已成功发布到侧边栏！刷新页面后即可在侧边栏中查看。`
  );
};

const handleUnpublishSuccess = (page: any) => {
  console.log("页面已取消发布:", page);
  alert(`页面"${page.title}"已成功从侧边栏移除！刷新页面后生效。`);
};

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem("darkMode");
  if (savedTheme === "true") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  }

  // 点击外部关闭下拉菜单
  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".relative") && showPageMenu.value) {
      showPageMenu.value = false;
    }
  });
});
</script>

<style scoped>
.toolbar {
  height: 56px;
}

:deep(.n-button) {
  font-weight: 500;
}

.dark :deep(.n-button) {
  border-color: #4b5563;
}
</style>
