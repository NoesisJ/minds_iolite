<template>
  <div class="viewer-view">
    <!-- 顶部导航 -->
    <div
      class="viewer-header flex justify-between items-center p-3 bg-gray-800 border-b border-gray-700"
    >
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-semibold text-white">
          {{ currentPage?.title || "页面阅览" }}
        </h1>

        <div v-if="pages.length > 1" class="relative">
          <base-button
            status="default"
            size="small"
            @click="togglePageMenu"
            class="flex items-center min-w-[120px]"
          >
            <span class="text-gray-200">切换页面</span>
            <i class="pi pi-chevron-down ml-1.5 text-gray-400"></i>
          </base-button>

          <div
            v-show="showPageMenu"
            class="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 w-48"
          >
            <div class="py-1 max-h-[250px] overflow-y-auto">
              <div
                v-for="page in pages"
                :key="page.id"
                @click="handlePageSelection(page.id)"
                class="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
              >
                {{ page.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <base-button
          status="primary"
          size="small"
          @click="returnToDesigner"
          class="flex items-center"
        >
          <i class="pi pi-pencil mr-1.5"></i>
          <span>返回设计器</span>
        </base-button>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="viewer-content bg-gray-900 min-h-[calc(100vh-56px)] p-4">
      <div
        v-if="currentPage"
        class="bg-gray-800 rounded-lg shadow-md p-4 max-w-6xl mx-auto"
      >
        <div
          v-for="(region, index) in currentPage.regions"
          :key="index"
          class="mb-4"
        >
          <div
            v-if="region.components.length > 0"
            class="region-content"
            :style="{
              display: 'flex',
              flexDirection:
                region.layout?.direction === 'horizontal' ? 'row' : 'column',
              gap: `${region.layout?.gap || 8}px`,
              padding: `${region.layout?.padding || 0}px`,
            }"
          >
            <div
              v-for="component in region.components"
              :key="component.id"
              class="relative"
            >
              <component
                :is="getComponentType(component.type)"
                v-bind="component.props"
                :style="component.styles"
              />
            </div>
          </div>
          <div
            v-else
            class="empty-region p-4 text-center text-gray-400 border border-dashed border-gray-700 rounded"
          >
            {{ region.name }} - 空区域
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center h-[60vh] text-gray-400"
      >
        <i class="pi pi-exclamation-circle text-5xl mb-4"></i>
        <div class="text-xl mb-2">未找到页面</div>
        <p class="mb-4">请返回设计器创建或选择页面</p>
        <base-button status="primary" @click="returnToDesigner"
          >返回设计器</base-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getComponentType } from "@/utils/componentUtils";
import BaseButton from "@/components/Form/Buttons/BaseButton.vue";

// 本地存储键名
const STORAGE_KEY = "minds_iolite_designer_data";

// 状态变量
const pages = ref([]);
const currentPageId = ref("");
const showPageMenu = ref(false);

// 路由
const router = useRouter();
const route = useRoute();

// 计算属性
const currentPage = computed(() => {
  return pages.value.find((p) => p.id === currentPageId.value);
});

// 初始化数据
onMounted(() => {
  loadFromLocalStorage();

  // 检查路由参数中是否有页面ID
  if (route.params.id) {
    currentPageId.value = route.params.id;
  }

  // 点击外部关闭下拉菜单
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative") && showPageMenu.value) {
      showPageMenu.value = false;
    }
  });
});

// 从本地存储加载
function loadFromLocalStorage() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      // 加载页面数据
      if (Array.isArray(parsedData.pages)) {
        pages.value = parsedData.pages;
      }

      // 设置当前页面
      if (
        parsedData.currentPageId &&
        pages.value.some((p) => p.id === parsedData.currentPageId) &&
        !currentPageId.value
      ) {
        currentPageId.value = parsedData.currentPageId;
      } else if (pages.value.length > 0 && !currentPageId.value) {
        currentPageId.value = pages.value[0].id;
      }
    }
  } catch (error) {
    console.error("从本地存储加载失败:", error);
  }
}

// 切换页面菜单
function togglePageMenu() {
  showPageMenu.value = !showPageMenu.value;
}

// 选择页面
function handlePageSelection(pageId) {
  currentPageId.value = pageId;
  showPageMenu.value = false;

  // 更新URL，不刷新页面
  router.replace({
    name: "Viewer",
    params: { id: pageId },
  });
}

// 返回设计器
function returnToDesigner() {
  router.push({ name: "Designer" });
}

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId && pages.value.some((p) => p.id === newId)) {
      currentPageId.value = newId;
    }
  }
);
</script>

<style scoped>
.viewer-header {
  height: 56px;
}
</style>
