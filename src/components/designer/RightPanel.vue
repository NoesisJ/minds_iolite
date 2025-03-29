<template>
  <div class="right-panel h-full overflow-auto p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
    <!-- 页面属性 -->
    <div v-if="currentPage && !selectedRegionId && !selectedComponentId">
      <h3 class="text-lg font-medium mb-3">页面属性</h3>
      
      <div class="form-group mb-3">
        <n-form-item label="页面标题">
          <n-input v-model:value="pageTitle" />
        </n-form-item>
      </div>
      
      <div class="form-group mb-3">
        <n-form-item label="页面名称">
          <n-input v-model:value="pageName" disabled />
        </n-form-item>
      </div>
      
      <div class="form-group mb-3">
        <n-form-item label="布局类型">
          <n-select
            v-model:value="layoutType"
            :options="layoutOptions"
            placeholder="选择布局"
            @update:value="updateLayout"
          />
        </n-form-item>
      </div>
    </div>
    
    <!-- 区域属性 -->
    <div v-else-if="selectedRegion">
      <h3 class="text-lg font-medium mb-3">区域属性</h3>
      
      <div class="form-group mb-3">
        <n-form-item label="区域名称">
          <n-input v-model:value="regionName" disabled />
        </n-form-item>
      </div>
      
      <div class="form-group mb-3">
        <n-form-item label="组件数量">
          <n-tag type="info">{{ selectedRegion.components.length }} 个组件</n-tag>
        </n-form-item>
      </div>
      
      <div class="mt-4">
        <n-tooltip placement="top">
          <template #trigger>
            <n-button 
              disabled
              type="primary"
              size="small"
            >
              <template #icon>
                <n-icon><AddOutline /></n-icon>
              </template>
              添加组件
            </n-button>
          </template>
          在下一阶段实现
        </n-tooltip>
      </div>
    </div>
    
    <!-- 组件属性 - 下一阶段实现 -->
    <div v-else-if="selectedComponentId">
      <h3 class="text-lg font-medium mb-3">组件属性</h3>
      <p class="text-sm text-gray-500">组件属性编辑将在下一阶段实现。</p>
    </div>
    
    <!-- 未选择任何内容 -->
    <div v-else class="text-center text-gray-500 mt-8">
      <n-icon :component="ArrowBackOutline" size="30" class="mb-2" />
      <p>请从左侧选择一个页面开始设计</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDesignerStore } from '@/stores/designerStore';
import { AddOutline, ArrowBackOutline } from '@vicons/ionicons5';

const designerStore = useDesignerStore();

// 计算属性
const currentPage = computed(() => designerStore.currentPage);
const selectedComponentId = computed(() => designerStore.selectedComponentId);
const selectedRegionId = computed(() => designerStore.selectedRegionId);
const layoutTemplates = computed(() => designerStore.layoutTemplates);

// 布局下拉选项
const layoutOptions = computed(() => {
  return layoutTemplates.value.map(layout => ({
    label: layout.name,
    value: layout.id
  }));
});

// 页面属性
const pageTitle = ref('');
const pageName = ref('');
const layoutType = ref('');

// 区域属性
const regionName = ref('');
const selectedRegion = computed(() => {
  if (!currentPage.value || !selectedRegionId.value) return null;
  return currentPage.value.regions.find(r => r.id === selectedRegionId.value) || null;
});

// 监听当前页面变化
watch(() => currentPage.value, (page) => {
  if (page) {
    pageTitle.value = page.title;
    pageName.value = page.name;
    layoutType.value = page.layoutType;
  }
}, { immediate: true });

// 监听选中的区域变化
watch(() => selectedRegion.value, (region) => {
  if (region) {
    regionName.value = region.name;
  }
}, { immediate: true });

// 更新页面标题
watch(pageTitle, (title) => {
  if (currentPage.value) {
    const pageIndex = designerStore.pages.findIndex(p => p.id === currentPage.value!.id);
    if (pageIndex !== -1) {
      designerStore.pages[pageIndex].title = title;
    }
  }
});

// 更新布局
const updateLayout = () => {
  if (currentPage.value && layoutType.value) {
    designerStore.applyLayout(layoutType.value);
  }
};
</script>

<style scoped>
:deep(.n-form-item-label) {
  font-size: 14px;
  padding-bottom: 4px;
  color: #555;
}

.dark :deep(.n-form-item-label) {
  color: #ccc;
}

:deep(.n-input) {
  background-color: #f5f5f5;
}

.dark :deep(.n-input) {
  background-color: #333;
}

:deep(.n-input--disabled) {
  opacity: 0.6;
}
</style>
