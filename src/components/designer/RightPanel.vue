<template>
  <div
    class="bg-[var(--material-item-bg)] overflow-auto p-3 text-gray-800 dark:text-gray-200 border-l border-[var(--material-item-border)]"
  >
    <!-- 调试信息 - 临时启用以查看问题 -->
    <!-- <div class="mb-4 p-2 bg-gray-100 dark:bg-gray-700 text-xs rounded border">
      <div>当前页面ID: {{ currentPageId || '无' }}</div>
      <div>有页面: {{ !!currentPage }}</div>
      <div>选中区域: {{ selectedRegionId || '无' }}</div>
      <div>选中组件: {{ selectedComponentId || '无' }}</div>
      <div>应显示页面属性: {{ showPageProperties }}</div>
    </div> -->

    <!-- 添加调试信息 -->
    <div class="mb-3 p-2 bg-gray-100 dark:bg-gray-700 text-xs rounded">
      <div>选中组件ID: {{ selectedComponentId || "无" }}</div>
      <div>选中区域ID: {{ selectedRegionId || "无" }}</div>
      <div>当前页面ID: {{ currentPageId || "无" }}</div>
    </div>

    <!-- 页面属性面板 -->
    <div v-if="showPageProperties">
      <h3 class="text-lg font-medium mb-3">页面属性</h3>

      <div class="form-group mb-3">
        <label
          class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >页面标题</label
        >
        <base-input
          v-model="pageTitle"
          @update:modelValue="updatePageTitle"
          class="w-full"
          placeholder="请输入页面标题"
        />
      </div>

      <div class="form-group mb-3">
        <label
          class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >页面名称</label
        >
        <base-input
          v-model="pageName"
          @update:modelValue="updatePageName"
          class="w-full"
          placeholder="请输入页面名称"
        />
      </div>

      <div class="form-group mb-3">
        <label
          class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >布局类型</label
        >
        <base-select
          v-model="layoutType"
          :options="layoutOptions"
          @update:modelValue="updateLayoutType"
          placeholder="选择布局类型"
          class="w-full"
        />
      </div>

      <!-- 布局预览 -->
      <div v-if="currentLayout" class="mt-4">
        <div class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          布局预览
        </div>
        <div class="border rounded p-3 bg-gray-50 dark:bg-gray-800">
          <div class="text-sm mb-2 text-center text-blue-500">
            {{ currentLayout.name }}
          </div>
          <div class="grid grid-cols-1 gap-2">
            <div
              v-for="region in currentLayout.regions"
              :key="region.id"
              class="bg-white dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 p-2 text-center text-xs text-gray-600 dark:text-gray-400"
            >
              {{ region.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域属性 -->
    <div v-else-if="selectedRegion">
      <h3 class="text-lg font-medium mb-3">区域属性</h3>

      <div class="form-group mb-3">
        <label
          class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >区域名称</label
        >
        <base-input v-model="regionName" disabled class="w-full" />
      </div>

      <div class="form-group mb-3">
        <label
          class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >组件数量</label
        >
        <base-input v-model="componentCount" disabled class="w-full" />
      </div>

      <!-- 布局设置 -->
      <div class="form-group mb-3">
        <label
          class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >布局方向</label
        >
        <base-select
          v-model="layoutDirection"
          :options="[
            { label: '垂直排列', value: 'vertical' },
            { label: '水平排列', value: 'horizontal' },
          ]"
          @update:modelValue="updateLayoutDirection"
          class="w-full"
        />
      </div>

      <div class="form-group mb-3">
        <label
          class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >组件间距</label
        >
        <base-input
          type="number"
          v-model="layoutGap"
          @update:modelValue="updateLayoutGap"
          class="w-full"
          placeholder="请输入组件间距（像素）"
        />
      </div>

      <div class="form-group mb-3">
        <label
          class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >内边距</label
        >
        <base-input
          type="number"
          v-model="layoutPadding"
          @update:modelValue="updateLayoutPadding"
          class="w-full"
          placeholder="请输入内边距（像素）"
        />
      </div>
    </div>

    <!-- 组件属性 -->
    <div v-else-if="selectedComponentId && currentComponent">
      <h3 class="font-medium text-lg mb-3">组件属性</h3>

      <!-- 添加组件类型调试信息 -->
      <div class="mb-3 p-2 bg-yellow-100 text-xs rounded text-black">
        <div>组件类型: {{ currentComponent.componentId }}</div>
        <div>组件ID: {{ currentComponent.id }}</div>
      </div>

      <!-- 文本组件的属性编辑器 -->
      <div v-if="currentComponent && currentComponent.componentId === 'text'">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">文本内容</label>
          <textarea
            v-model="currentComponent.props.content"
            class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            rows="3"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">字体大小</label>
          <input
            v-model="currentComponent.styles.fontSize"
            type="text"
            class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">文本颜色</label>
          <input
            v-model="currentComponent.styles.color"
            type="color"
            class="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">对齐方式</label>
          <select
            v-model="currentComponent.styles.textAlign"
            class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
          </select>
        </div>
      </div>

      <!-- 图片组件的属性编辑器 -->
      <div
        v-else-if="currentComponent && currentComponent.componentId === 'image'"
      >
        <!-- 图片组件属性编辑器内容 -->
      </div>

      <!-- 按钮组件的属性编辑器 -->
      <div
        v-else-if="
          currentComponent && currentComponent.componentId === 'button'
        "
      >
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">按钮文本</label>
          <input
            v-model="currentComponent.props.label"
            type="text"
            class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">按钮类型</label>
          <select
            v-model="currentComponent.props.status"
            class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="primary">主要按钮 (Primary)</option>
            <option value="info">信息按钮 (Info)</option>
            <option value="success">成功按钮 (Success)</option>
            <option value="warning">警告按钮 (Warning)</option>
            <option value="danger">危险按钮 (Danger)</option>
            <option value="basic">基础按钮 (Basic)</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">按钮大小</label>
          <select
            v-model="currentComponent.props.size"
            class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="small">小 (Small)</option>
            <option value="medium">中 (Medium)</option>
            <option value="large">大 (Large)</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">按钮形状</label>
          <select
            v-model="currentComponent.props.shape"
            class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="rectangle">矩形 (Rectangle)</option>
            <option value="semi-round">半圆角 (Semi-round)</option>
            <option value="round">圆角 (Round)</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">图标</label>
          <input
            v-model="currentComponent.props.icon"
            type="text"
            placeholder="例如: pi pi-check"
            class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <p class="text-xs text-gray-500 mt-1">
            使用PrimeIcons图标, 例如: pi pi-check
          </p>
        </div>

        <div class="mb-4 space-y-2">
          <label class="block text-sm font-medium mb-1">样式选项</label>
          <div class="flex items-center">
            <input
              type="checkbox"
              id="hero-option"
              v-model="currentComponent.props.hero"
              class="mr-2"
            />
            <label for="hero-option">突出按钮 (Hero)</label>
          </div>

          <div class="flex items-center">
            <input
              type="checkbox"
              id="outline-option"
              v-model="currentComponent.props.outline"
              class="mr-2"
            />
            <label for="outline-option">轮廓按钮 (Outline)</label>
          </div>

          <div class="flex items-center">
            <input
              type="checkbox"
              id="ghost-option"
              v-model="currentComponent.props.ghost"
              class="mr-2"
            />
            <label for="ghost-option">幽灵按钮 (Ghost)</label>
          </div>

          <div class="flex items-center">
            <input
              type="checkbox"
              id="disabled-option"
              v-model="currentComponent.props.disabled"
              class="mr-2"
            />
            <label for="disabled-option">禁用状态 (Disabled)</label>
          </div>
        </div>

        <!-- 自定义样式 -->
        <div class="mb-4">
          <details class="border rounded p-2">
            <summary class="font-medium cursor-pointer">高级样式设置</summary>
            <div class="pt-2 space-y-2">
              <div>
                <label class="block text-xs font-medium mb-1"
                  >外边距 (margin)</label
                >
                <input
                  v-model="currentComponent.styles.margin"
                  type="text"
                  placeholder="例如: 8px 12px"
                  class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1"
                  >宽度 (width)</label
                >
                <input
                  v-model="currentComponent.styles.width"
                  type="text"
                  placeholder="例如: 100% 或 120px"
                  class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                />
              </div>
            </div>
          </details>
        </div>
      </div>

      <!-- 不支持的组件类型 -->
      <div v-else>
        <p class="text-yellow-500">
          暂不支持编辑此类型组件的属性:
          {{ currentComponent?.componentId || "未知" }}
        </p>
      </div>
    </div>

    <!-- 未选择任何内容 -->
    <div v-else class="h-full flex items-center justify-center">
      <div class="text-center text-gray-500 dark:text-gray-400">
        <i class="pi pi-arrow-left text-2xl mb-2"></i>
        <p>请从左侧选择页面<br />或从画布选择组件</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDesignerStore } from "@/stores/designerStore";
import { getComponentDefinition } from "@/data/componentLibrary";
import BaseInput from "@/components/Form/Inputs/BaseInput.vue";
import BaseSelect from "@/components/Form/Inputs/BaseSelect.vue";

// 调试模式开关

const designerStore = useDesignerStore();

// 页面属性相关
const pageTitle = ref("");
const pageName = ref("");
const layoutType = ref("");

// 计算属性
const currentPageId = computed(() => designerStore.currentPageId);
const currentPage = computed(() => designerStore.currentPage);
const selectedRegionId = computed(() => designerStore.selectedRegionId);
const selectedRegion = computed(() => {
  if (!currentPage.value || !selectedRegionId.value) return null;
  return currentPage.value.regions.find((r) => r.id === selectedRegionId.value);
});
const selectedComponentId = computed(() => designerStore.selectedComponentId);
const selectedComponent = computed(() => designerStore.selectedComponent);

// 组件属性
const componentId = ref("");
const componentType = ref("");
const props = ref<any>({});
const styles = ref<any>({});

// 区域属性
const regionName = ref("");
const componentCount = ref(0);

// 布局选项
const layoutOptions = computed(() => {
  return designerStore.layoutTemplates.map((layout) => ({
    label: layout.name,
    value: layout.id,
  }));
});

// 是否显示页面属性面板 - 修改逻辑
const showPageProperties = computed(() => {
  const shouldShow =
    currentPageId.value &&
    currentPage.value &&
    !selectedRegionId.value &&
    !selectedComponentId.value;

  console.log("页面属性面板显示状态:", {
    当前页面ID: currentPageId.value,
    有当前页面: !!currentPage.value,
    选中区域ID: selectedRegionId.value,
    选中组件ID: selectedComponentId.value,
    应显示: shouldShow,
  });

  return shouldShow;
});

// 获取当前选中的布局
const currentLayout = computed(() => {
  if (!layoutType.value) return null;
  return designerStore.layoutTemplates.find((t) => t.id === layoutType.value);
});

// 当前选中的组件
const currentComponent = computed(() => {
  if (!selectedComponentId.value) return null;

  // 确保当前页面存在
  const currentPage = designerStore.currentPage;
  if (!currentPage) return null;

  // 在所有区域中查找组件
  for (const region of currentPage.regions || []) {
    const component = (region.components || []).find(
      (c) => c.id === selectedComponentId.value
    );
    if (component) return component;
  }

  return null;
});

// 布局相关属性
const layoutDirection = ref("vertical");
const layoutGap = ref(8);
const layoutPadding = ref(0);

// 监听页面变化
watch(
  currentPage,
  (page) => {
    if (page) {
      pageTitle.value = page.title || "";
      pageName.value = page.name || "";
      layoutType.value = page.layoutType || "";
      console.log("页面已加载:", page);
    } else {
      pageTitle.value = "";
      pageName.value = "";
      layoutType.value = "";
      console.log("无当前页面");
    }
  },
  { immediate: true }
);

// 监听区域变化
watch(
  selectedRegion,
  (region) => {
    if (region) {
      regionName.value = region.name;
      componentCount.value = region.components.length;
      layoutDirection.value = region.layout?.direction || "vertical";
      layoutGap.value = region.layout?.gap || 8;
      layoutPadding.value = region.layout?.padding || 0;
    }
  },
  { immediate: true }
);

// 监听组件变化
watch(
  selectedComponent,
  (component) => {
    if (component) {
      componentId.value = component.id;
      const definition = getComponentDefinition(component.componentId);
      componentType.value = definition?.type || "";
      props.value = { ...component.props };
      styles.value = { ...component.styles };
    } else {
      componentId.value = "";
      componentType.value = "";
      props.value = {};
      styles.value = {};
    }
  },
  { immediate: true }
);

// 更新页面属性
const updatePageTitle = (value: string) => {
  console.log("更新页面标题:", value);
  if (currentPageId.value) {
    designerStore.updatePageTitle(currentPageId.value, value);
  } else {
    console.warn("无法更新标题: 未选中页面");
  }
};

const updatePageName = (value: string) => {
  console.log("更新页面名称:", value);
  if (currentPageId.value) {
    designerStore.updatePageProperty(currentPageId.value, "name", value);
  } else {
    console.warn("无法更新名称: 未选中页面");
  }
};

const updateLayoutType = (value: string) => {
  console.log("更新布局类型:", value);
  if (currentPageId.value) {
    designerStore.applyLayout(value);
  } else {
    console.warn("无法更新布局: 未选中页面");
  }
};

// 更新布局方向
const updateLayoutDirection = (value: string) => {
  if (!selectedRegion.value) return;
  const region = selectedRegion.value;
  if (!region.layout) {
    region.layout = {
      direction: "vertical",
      gap: 8,
      padding: 0,
    };
  }
  region.layout.direction = value as "vertical" | "horizontal";
  designerStore.updateRegion(region);
};

// 更新组件间距
const updateLayoutGap = (value: number) => {
  if (!selectedRegion.value) return;
  const region = selectedRegion.value;
  if (!region.layout) {
    region.layout = {
      direction: "vertical",
      gap: 8,
      padding: 0,
    };
  }
  region.layout.gap = value;
  designerStore.updateRegion(region);
};

// 更新内边距
const updateLayoutPadding = (value: number) => {
  if (!selectedRegion.value) return;
  const region = selectedRegion.value;
  if (!region.layout) {
    region.layout = {
      direction: "vertical",
      gap: 8,
      padding: 0,
    };
  }
  region.layout.padding = value;
  designerStore.updateRegion(region);
};

// 添加调试信息
console.log("RightPanel 重新渲染");
console.log("当前选中组件ID:", selectedComponentId.value);
console.log("当前组件数据:", currentComponent.value);
</script>

<style scoped>
/* 确保表单项独占一行 */
.form-group {
  margin-bottom: 12px;
  width: 100%;
  display: block;
}

h4.font-medium {
  color: #555;
  font-weight: 500;
}

.dark h4.font-medium {
  color: #ccc;
}

.specific-props,
.style-props {
  padding: 0;
  background-color: transparent;
  border-radius: 0;
  margin-bottom: 16px;
}

.dark .specific-props,
.dark .style-props {
  background-color: transparent;
}

.color-picker-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.color-input {
  flex: 1;
}

.color-preview-wrapper {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-left: 8px;
  flex-shrink: 0;
  display: block;
}

.dark .color-preview-wrapper {
  border-color: #444;
}

.local-image-preview {
  max-width: 200px;
  margin: 0 auto;
}

/* 添加图片选择器样式 */
.image-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.image-chip {
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.image-chip:hover {
  background-color: #e0e0e0;
}

.dark .image-chip {
  background-color: #333;
}

.dark .image-chip:hover {
  background-color: #444;
}
</style>
