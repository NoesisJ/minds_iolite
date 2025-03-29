<template>
  <div class="toolbar p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
    <div class="left-section flex items-center space-x-4">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white">页面设计器</h1>
      
      <n-button type="primary" size="small" @click="createNewPage">
        <template #icon>
          <n-icon><AddOutline /></n-icon>
        </template>
        新页面
      </n-button>
      
    </div>
    
    <div class="right-section flex items-center space-x-2">
      <n-button type="default" size="small" class="designer-btn">
        <template #icon>
          <n-icon><SaveOutline /></n-icon>
        </template>
        保存
      </n-button>
      <n-button type="info" size="small" class="designer-btn">
        <template #icon>
          <n-icon><EyeOutline /></n-icon>
        </template>
        预览
      </n-button>
      <n-button type="success" size="small" class="designer-btn">
        <template #icon>
          <n-icon><CheckmarkOutline /></n-icon>
        </template>
        发布
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDesignerStore } from '@/stores/designerStore';
import { SaveOutline, EyeOutline, CheckmarkOutline, AddOutline } from '@vicons/ionicons5';

const designerStore = useDesignerStore();
const currentPage = computed(() => designerStore.currentPage);
const pageTitle = ref('');

// 监听当前页面变化，更新标题
watch(() => currentPage.value, (page) => {
  if (page) {
    pageTitle.value = page.title;
  }
}, { immediate: true });

// 监听标题变化，更新页面
watch(pageTitle, (title) => {
  if (currentPage.value) {
    const pageIndex = designerStore.pages.findIndex(p => p.id === currentPage.value!.id);
    if (pageIndex !== -1) {
      designerStore.pages[pageIndex].title = title;
    }
  }
});

// 创建新页面
const createNewPage = () => {
  const pageName = `page-${designerStore.pages.length + 1}`;
  const pageTitle = `新页面 ${designerStore.pages.length + 1}`;
  designerStore.createPage(pageName, pageTitle);
};
</script>

<style scoped>
.designer-btn {
  padding: 0.25rem 0.75rem;
}

:deep(.n-button) {
  font-size: 0.875rem;
}

:deep(.n-input) {
  background-color: #f5f5f5;
  border-color: #e5e7eb;
}

.dark :deep(.n-input) {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}
</style>
