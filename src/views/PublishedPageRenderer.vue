<template>
  <div class="published-page-container">
    <div v-if="pageData" class="page-content">
      <div
        v-for="(region, index) in pageData.regions"
        :key="index"
        class="region-wrapper"
      >
        <div
          v-if="region.components.length > 0"
          class="components-container"
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
            class="component-wrapper"
          >
            <component
              :is="getComponentType(component.type)"
              v-bind="component.props"
              :style="component.styles"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="error-message">
      <div
        class="flex flex-col items-center justify-center p-8 text-gray-400"
      >
        <i class="pi pi-exclamation-circle text-5xl mb-4"></i>
        <div class="text-xl mb-2">页面不存在或已被删除</div>
        <p class="mb-4">请检查页面是否已发布或联系管理员</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getComponentType } from "@/utils/componentUtils";

const props = defineProps({
  pageId: {
    type: String,
    default: "",
  },
});

const route = useRoute();
const pageData = ref(null);

// 加载页面数据函数
function loadPageData() {
  // 从存储中获取发布的页面数据
  const publishedPages = JSON.parse(
    localStorage.getItem("published_pages") || "[]"
  );

  // 优先使用props中的pageId
  let pageId = props.pageId;

  // 如果props中没有，则尝试从路由元数据中获取
  if (!pageId && route.meta && route.meta.pageId) {
    pageId = route.meta.pageId;
  }

  let page;

  if (pageId) {
    // 通过ID查找页面
    page = publishedPages.find((p) => p.id === pageId);
    console.log("通过ID查找页面:", pageId, page ? "找到" : "未找到");
  }

  // 如果没有找到，使用路径匹配（作为备用方法）
  if (!page) {
    page = publishedPages.find((p) => p.route === route.path);
    console.log("通过路径查找页面:", route.path, page ? "找到" : "未找到");
  }

  if (page) {
    console.log("加载页面:", page.title, "ID:", page.id);
    pageData.value = page.pageData;
    // 设置页面标题
    document.title = page.title || "发布页面";
  } else {
    console.error("未找到页面, 路径:", route.path, "页面ID:", pageId);
    pageData.value = null;
  }
}

// 监听路由变化和props变化，重新加载页面数据
watch([() => route.path, () => props.pageId], () => {
  loadPageData();
});

onMounted(() => {
  loadPageData();
});
</script>

<style scoped>
.published-page-container {
  min-height: calc(100vh - 56px);
  background-color: #111827;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  color: #e5e7eb;
}

.region-wrapper {
  margin-bottom: 16px;
}

.component-wrapper {
  /* 无需margin-bottom，使用flex gap代替 */
}

.error-message {
  text-align: center;
  padding: 40px 0;
  color: #9ca3af;
}
</style>
