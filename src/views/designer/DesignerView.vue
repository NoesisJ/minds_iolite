<template>
  <div class="designer-view h-full w-full bg-white dark:bg-gray-800">
    <!-- 顶部工具栏 -->
    <ToolBar class="border-b border-gray-200 dark:border-gray-700" />

    <!-- 主体内容区 - 确保占满所有可用空间 -->
    <div class="designer-main flex h-[calc(100%-56px)] overflow-hidden">
      <!-- 左侧面板：页面/布局选择 -->
      <LeftPanel class="w-64 border-r border-gray-200 dark:border-gray-700" />

      <!-- 中间画布区域 -->
      <DesignCanvas class="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900" />

      <!-- 右侧面板：属性配置 -->
      <RightPanel class="w-64 border-l border-gray-200 dark:border-gray-700" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useDesignerStore } from "@/stores/designerStore";
import ToolBar from "@/components/designer/ToolBar.vue";
import LeftPanel from "@/components/designer/LeftPanel.vue";
import DesignCanvas from "@/components/designer/DesignCanvas.vue";
import RightPanel from "@/components/designer/RightPanel.vue";

const designerStore = useDesignerStore();

// 组件挂载时自动加载保存的数据
onMounted(() => {
  const loaded = designerStore.loadFromLocalStorage();

  // 如果没有保存的数据，创建一个默认页面
  if (!loaded && designerStore.pages.length === 0) {
    designerStore.createPage();
  }
});
</script>

<style scoped>
.designer-view {
  color: #333;
  position: relative;
}

/* 假设工具栏高度为56px，调整主内容区域高度 */
.designer-main {
  height: calc(100% - 56px);
}

/* 使用:deep覆盖Naive UI组件样式 */
:deep(.n-button) {
  margin: 0 2px;
}

:deep(.n-tabs-tab) {
  color: #555;
}

:deep(.n-tabs-tab.n-tabs-tab--active) {
  color: #2563eb;
}

:deep(.n-input) {
  background-color: white;
}

.dark :deep(.n-input) {
  background-color: #333;
  color: #eee;
}
</style>
