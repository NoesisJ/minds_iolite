<template>
  <div class="left-panel h-full flex flex-col overflow-hidden">
    <n-tabs type="line" class="flex-1 flex flex-col" animated>
      <!-- 页面选项卡 -->
      <n-tab-pane name="pages" tab="页面">
        <div class="h-full flex flex-col">
          <div class="page-list flex-1 overflow-auto p-2">
            <div 
              v-for="page in pages" 
              :key="page.id"
              class="page-item p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :class="[currentPageId === page.id ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500' : '']"
              @click="selectPage(page.id)"
            >
              <div class="text-gray-800 dark:text-gray-200 font-medium">{{ page.title }}</div>
              <div class="text-gray-500 dark:text-gray-400 text-sm">{{ page.name }}</div>
            </div>
          </div>
          
          <div class="actions p-2 border-t border-gray-200 dark:border-gray-700">
            <n-button 
              type="primary" 
              size="small" 
              block
              @click="createNewPage"
            >
              <template #icon>
                <n-icon><AddOutline /></n-icon>
              </template>
              添加页面
            </n-button>
          </div>
        </div>
      </n-tab-pane>
      
      <!-- 布局选项卡 -->
      <n-tab-pane name="layouts" tab="布局">
        <div class="layout-list p-2 grid grid-cols-2 gap-2">
          <div 
            v-for="layout in layoutTemplates" 
            :key="layout.id"
            class="layout-item cursor-pointer border border-gray-200 dark:border-gray-700 rounded overflow-hidden"
            @click="applyLayout(layout.id)"
          >
            <div class="layout-preview aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <n-icon size="30"><GridOutline /></n-icon>
            </div>
            <div class="layout-name text-center py-1 text-sm text-gray-700 dark:text-gray-300">
              {{ layout.name }}
            </div>
          </div>
        </div>
      </n-tab-pane>
      
      <!-- 组件选项卡 -->
      <n-tab-pane name="components" tab="组件">
        <div class="p-4 text-center text-gray-600 dark:text-gray-400">
          <p>组件功能将在下一阶段实现</p>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDesignerStore } from '@/stores/designerStore';
import { AddOutline, GridOutline } from '@vicons/ionicons5';

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
  if (currentPageId.value) {
    designerStore.applyLayout(layoutId);
  }
};
</script>

<style scoped>
:deep(.n-tabs-nav) {
  padding: 0 1rem;
}

:deep(.n-tabs-tab) {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

:deep(.n-tabs-tab__label) {
  color: #555;
}

.dark :deep(.n-tabs-tab__label) {
  color: #ccc;
}

:deep(.n-tabs-tab--active .n-tabs-tab__label) {
  color: #2563eb;
}

:deep(.n-tabs-wrapper) {
  padding: 0;
}

:deep(.n-tab-pane) {
  padding: 0;
  height: calc(100% - 40px);
}
</style>
