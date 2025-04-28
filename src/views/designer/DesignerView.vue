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
      <DesignCanvas class="flex-1 overflow-auto custom-scrollbar" />

      <!-- 右侧面板：属性配置 -->
      <RightPanel class="w-64" />
    </div>

    <!-- 组件预览浮层 -->
    <div
      v-if="showPreview"
      class="component-preview-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      @click.self="closePreview"
      @mousedown.self="closePreview"
    >
      <div
        class="preview-container rounded-lg shadow-lg p-6 overflow-auto"
        style="background-color: rgb(53, 53, 53)"
      >
        <div
          class="flex justify-between items-center mb-4 pb-2 border-b border-gray-700"
        >
          <h3 class="text-lg font-medium text-gray-200">
            {{ previewComponentData?.name || "组件" }} 预览
          </h3>
          <button
            @click="closePreview"
            class="text-gray-400 hover:text-gray-200"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div
          class="preview-content p-4 flex justify-center w-fit h-fit"
        >
          <component-preview
            v-if="previewComponentData"
            :component="{
              componentId: previewComponentData.id,
              props: previewComponentData.defaultProps,
              styles: previewComponentData.defaultStyles,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useDesignerStore } from "@/stores/designerStore";
import ToolBar from "@/components/designer/ToolBar.vue";
import LeftPanel from "@/components/designer/LeftPanel.vue";
import DesignCanvas from "@/components/designer/DesignCanvas.vue";
import RightPanel from "@/components/designer/RightPanel.vue";
import ComponentPreview from "@/components/designer/ComponentPreview.vue";

const designerStore = useDesignerStore();

// 组件预览相关
const showPreview = ref(false);
const previewComponentData = ref<any>(null);

// 根据组件类型获取预览尺寸
const getPreviewSize = (type: string) => {
  switch (type) {
    case "chart":
      return { width: "600px", height: "400px" };
    case "table":
      return { width: "700px", height: "500px" };
    default:
      return { width: "400px", minHeight: "200px" };
  }
};

// 处理组件预览
const handlePreviewComponent = (event: CustomEvent) => {
  previewComponentData.value = event.detail.component;
  showPreview.value = true;
};

// 关闭预览
const closePreview = () => {
  showPreview.value = false;
};

// 组件挂载时自动加载保存的数据
onMounted(() => {
  // 设置设计器模式标志
  (window as any).__DESIGNER_MODE__ = true;
  (window as any).$designerStore = designerStore;

  const loaded = designerStore.loadFromLocalStorage();

  // 如果没有保存的数据，创建一个默认页面
  if (!loaded && designerStore.pages.length === 0) {
    designerStore.createPage();
  }

  // 监听组件预览事件
  window.addEventListener(
    "preview-component",
    handlePreviewComponent as EventListener
  );

  // 当拖动开始时关闭预览
  window.addEventListener("dragstart", closePreview);
});

// 组件卸载时重置设计器模式标志
onUnmounted(() => {
  (window as any).__DESIGNER_MODE__ = false;

  // 移除事件监听
  window.removeEventListener(
    "preview-component",
    handlePreviewComponent as EventListener
  );
  window.removeEventListener("dragstart", closePreview);
});
</script>

<style scoped>
.designer-view {
  --designer-header-height: 4rem; /* 顶部工具栏高度 */
}

.component-preview-overlay {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.preview-container {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
