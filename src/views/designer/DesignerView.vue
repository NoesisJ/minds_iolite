<template>
  <div class="designer-view h-full w-full overflow-hidden">
    <!-- 顶部工具栏 -->
    <ToolBar class="h-[var(--designer-header-height)]" />
    <div
      class="flex h-[calc(100%-var(--designer-header-height))] overflow-hidden"
    >
      <!-- 左侧面板：页面/布局选择 -->
      <LeftPanel class="w-64" />

      <!-- 中间画布 -->
      <DesignCanvas class="flex-1 overflow-auto" />

      <!-- 右侧面板：属性配置 -->
      <RightPanel class="w-64" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useDesignerStore } from "@/stores/designerStore";
import ToolBar from "@/components/designer/ToolBar.vue";
import LeftPanel from "@/components/designer/LeftPanel.vue";
import DesignCanvas from "@/components/designer/DesignCanvas.vue";
import RightPanel from "@/components/designer/RightPanel.vue";

const designerStore = useDesignerStore();

// 组件挂载时自动加载保存的数据
onMounted(() => {
  // 设置设计器模式标志
  window.__DESIGNER_MODE__ = true;
  window.$designerStore = designerStore;
  
  const loaded = designerStore.loadFromLocalStorage();

  // 如果没有保存的数据，创建一个默认页面
  if (!loaded && designerStore.pages.length === 0) {
    designerStore.createPage();
  }
});

// 组件卸载时重置设计器模式标志
onUnmounted(() => {
  window.__DESIGNER_MODE__ = false;
});
</script>

<style scoped>
.designer-view {
  --designer-header-height: 4rem; /* 顶部工具栏高度 */
}
</style>
