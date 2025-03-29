<template>
  <div class="left-panel h-full flex flex-col overflow-hidden">
    <n-tabs type="line" class="flex-1 flex flex-col" animated>
      <!-- 页面管理选项卡 -->
      <n-tab-pane name="pages" tab="页面">
        <div class="p-3 flex-1 overflow-auto">
          <div class="mb-3 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">页面列表</h3>
            <n-button size="small" type="primary" @click="createNewPage">
              <template #icon>
                <n-icon><AddOutline /></n-icon>
              </template>
              添加
            </n-button>
          </div>
          
          <div class="pages-list">
            <div 
              v-for="page in pages" 
              :key="page.id"
              :class="['page-item p-2 rounded cursor-pointer mb-1 text-gray-700 dark:text-gray-300', 
                       currentPageId === page.id ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800']"
              @click="selectPage(page.id)"
            >
              <div class="font-medium">{{ page.title }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ page.name }}</div>
            </div>
          </div>
        </div>
      </n-tab-pane>
      
      <!-- 布局选项卡 -->
      <n-tab-pane name="layouts" tab="布局">
        <div class="p-3">
          <h3 class="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">可用布局</h3>
          
          <div class="layout-grid grid grid-cols-2 gap-2">
            <div 
              v-for="layout in layoutTemplates" 
              :key="layout.id"
              class="layout-card border border-gray-200 dark:border-gray-700 rounded overflow-hidden cursor-pointer hover:shadow-sm"
              @click="applyLayout(layout.id)"
            >
              <div class="layout-preview h-20 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <i class="pi pi-th-large text-gray-400 dark:text-gray-600 text-xl"></i>
              </div>
              <div class="layout-name p-2 text-center text-sm text-gray-700 dark:text-gray-300">
                {{ layout.name }}
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>
      
      <!-- 组件库选项卡 -->
      <n-tab-pane name="components" tab="组件">
        <div class="p-3 flex-1 overflow-auto">
          <h3 class="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">组件库</h3>
          
          <!-- 组件分类循环 -->
          <div class="mb-4" v-for="category in componentCategories" :key="category.id">
            <h4 class="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">{{ category.name }}</h4>
            
            <div class="component-grid grid grid-cols-2 gap-2">
              <div 
                v-for="component in getComponentsByCategory(category.id)" 
                :key="component.id"
                class="component-card p-2 border border-gray-200 dark:border-gray-700 rounded text-center cursor-move hover:bg-gray-50 dark:hover:bg-gray-800"
                draggable="true"
                @dragstart="onDragStart($event, component.id)"
                @dragend="onDragEnd"
              >
                <div class="component-icon mb-1">
                  <i :class="[component.icon, 'text-blue-500 text-lg']"></i>
                </div>
                <div class="component-name text-sm text-gray-700 dark:text-gray-300">
                  {{ component.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDesignerStore } from '@/stores/designerStore';
import { 
  allComponents, 
  componentCategories,
  getComponentDefinition 
} from '@/data/componentLibrary';
import { AddOutline } from '@vicons/ionicons5';

const designerStore = useDesignerStore();

// 计算属性
const pages = computed(() => designerStore.pages);
const currentPageId = computed(() => designerStore.currentPageId);
const layoutTemplates = computed(() => designerStore.layoutTemplates);

// 创建新页面
const createNewPage = () => {
  const pageName = `page-${pages.value.length + 1}`;
  const pageTitle = `新页面 ${pages.value.length + 1}`;
  designerStore.createPage(pageName, pageTitle);
};

// 选择页面
const selectPage = (pageId: string) => {
  designerStore.selectPage(pageId);
};

// 应用布局
const applyLayout = (layoutId: string) => {
  designerStore.applyLayout(layoutId);
};

// 根据分类获取组件
const getComponentsByCategory = (categoryId: string) => {
  return allComponents.filter(comp => comp.category === categoryId);
};

// 拖拽处理
const onDragStart = (event: DragEvent, componentId: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('componentId', componentId);
    event.dataTransfer.effectAllowed = 'copy';
  }
  designerStore.startDrag(componentId);
};

const onDragEnd = () => {
  designerStore.endDrag();
};
</script>

<style scoped>
:deep(.n-tabs-tab) {
  color: #555;
}

.dark :deep(.n-tabs-tab) {
  color: #aaa;
}

:deep(.n-tabs-tab.n-tabs-tab--active) {
  color: #2563eb;
}

:deep(.n-tabs-tab-wrapper) {
  justify-content: center;
}

:deep(.n-tabs-pane-wrapper) {
  flex: 1;
  overflow-y: auto;
}

:deep(.n-tabs) {
  height: 100%;
}

:deep(.n-tabs-tab) {
  padding: 12px 8px;
}

:deep(.n-tabs-tab__label) {
  font-size: 14px;
}
</style>
