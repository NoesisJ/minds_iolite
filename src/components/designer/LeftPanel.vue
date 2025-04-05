<template>
  <div
    class="left-panel h-full overflow-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
  >
    <!-- 标签页替换 -->
    <div class="tabs border-b border-gray-200 dark:border-gray-700">
      <div class="flex">
        <button
          @click="activeTab = 'components'"
          class="flex-1 py-3 font-medium text-sm text-center transition-colors"
          :class="
            activeTab === 'components'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-600 dark:text-gray-300'
          "
        >
          组件
        </button>
        <button
          @click="activeTab = 'pages'"
          class="flex-1 py-3 font-medium text-sm text-center transition-colors"
          :class="
            activeTab === 'pages'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-600 dark:text-gray-300'
          "
        >
          页面
        </button>
      </div>
    </div>

    <!-- 组件标签内容 -->
    <div v-show="activeTab === 'components'" class="p-4">
      <!-- 组件分类选择 -->
      <div class="mb-4">
        <div class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          组件分类
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in componentCategories"
            :key="category.id"
            @click="activeCategory = category.id"
            class="px-3 py-1 text-xs rounded-full transition-colors"
            :class="
              activeCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            "
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- 组件列表 -->
      <div>
        <div class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          可用组件
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="component in filteredComponents"
            :key="component.id"
            class="component-item p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:border-blue-400 dark:hover:border-blue-400 transition-colors"
            draggable="true"
            @dragstart="onDragStart($event, component)"
          >
            <div class="flex items-center">
              <div
                class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 mr-2"
              >
                <i class="pi" :class="component.icon"></i>
              </div>
              <div class="text-sm font-medium text-gray-800 dark:text-gray-200">
                {{ component.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页面标签内容 -->
    <div v-show="activeTab === 'pages'" class="p-4">
      <div class="flex justify-between items-center mb-3">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
          页面管理
        </div>
        <button
          @click="createNewPage"
          class="p-1 rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <i class="pi pi-plus text-sm"></i>
        </button>
      </div>

      <div class="pages-list space-y-2">
        <div
          v-for="page in designerStore.pages"
          :key="page.id"
          @click="selectPage(page.id)"
          class="page-item p-2 rounded border cursor-pointer flex items-center justify-between"
          :class="
            currentPageId === page.id
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500'
              : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-400'
          "
        >
          <div class="flex items-center flex-grow overflow-hidden">
            <i class="pi pi-file-o mr-2 text-gray-500 flex-shrink-0"></i>

            <!-- 内联编辑模式 -->
            <input
              v-if="editingPageId === page.id"
              v-model="editingTitle"
              @keydown.enter="savePageTitle(page.id)"
              @blur="savePageTitle(page.id)"
              @click.stop
              :ref="
                (el) => {
                  if (el) inputElement = el as HTMLInputElement;
                }
              "
              class="w-full bg-white dark:bg-gray-700 border border-blue-400 dark:border-blue-500 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <!-- 普通显示模式 -->
            <span
              v-else
              class="text-gray-800 dark:text-gray-200 truncate"
              @dblclick.stop="startEditingPage(page)"
            >
              {{ page.title || "未命名页面" }}
            </span>
          </div>

          <div class="flex space-x-1 flex-shrink-0 ml-2">
            <button
              class="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              @click.stop="startEditingPage(page)"
            >
              <i class="pi pi-pencil text-xs"></i>
            </button>
            <button
              class="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              @click.stop="deletePage(page.id)"
            >
              <i class="pi pi-trash text-xs"></i>
            </button>
          </div>
        </div>

        <div
          v-if="designerStore.pages.length === 0"
          class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm italic"
        >
          暂无页面，请点击上方"+"创建
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useDesignerStore } from "@/stores/designerStore";
import { allComponents, componentCategories } from "@/data/componentLibrary";
import BaseButton from "@/components/Form/Buttons/BaseButton.vue";

const designerStore = useDesignerStore();

// 状态
const activeTab = ref("components");
const activeCategory = ref("basic"); // 默认显示基础组件

// 页面编辑相关状态
const editingPageId = ref("");
const editingTitle = ref("");
const inputElement = ref<HTMLInputElement | null>(null);

// 计算属性
const currentPageId = computed(() => designerStore.currentPageId);

const filteredComponents = computed(() => {
  return allComponents.filter((comp) => comp.category === activeCategory.value);
});

// 方法
const onDragStart = (event: DragEvent, component: any) => {
  console.log("开始拖拽组件:", component.id);
  // 设置拖动数据
  if (event.dataTransfer) {
    event.dataTransfer.setData("componentId", component.id);
    event.dataTransfer.effectAllowed = "copy";
  }
};

const selectPage = (pageId: string) => {
  // 如果正在编辑，先保存
  if (editingPageId.value) {
    savePageTitle(editingPageId.value);
  }

  designerStore.currentPageId = pageId;
  designerStore.selectedComponentId = "";
  designerStore.selectedRegionId = "";
};

const createNewPage = () => {
  designerStore.createPage();
};

// 开始编辑页面标题
const startEditingPage = (page: any) => {
  // 如果已经在编辑，先保存当前编辑
  if (editingPageId.value) {
    savePageTitle(editingPageId.value);
  }

  editingPageId.value = page.id;
  editingTitle.value = page.title || "";

  // 在下一个更新周期聚焦到输入框
  nextTick(() => {
    if (inputElement.value) {
      inputElement.value.focus();
      inputElement.value.select();
    }
  });
};

// 保存页面标题
const savePageTitle = (pageId: string) => {
  if (editingTitle.value.trim() !== "") {
    designerStore.updatePageTitle(pageId, editingTitle.value.trim());
  }
  editingPageId.value = "";
};

const deletePage = (pageId: string) => {
  if (confirm("确定要删除此页面吗?")) {
    designerStore.deletePage(pageId);
  }
};
</script>

<style scoped>
.left-panel {
  width: var(--designer-panel-width, 260px);
}

.component-item {
  transition: transform 0.2s;
}

.component-item:active {
  transform: scale(0.98);
}
</style>
