<template>
  <div class="design-canvas h-full overflow-auto flex flex-col">
    <!-- 无页面或布局时显示提示 -->
    <div 
      v-if="!currentPage || !currentPage.layoutType" 
      class="flex-1 flex flex-col items-center justify-center text-gray-500"
    >
      <n-icon :component="AppsOutline" size="40" class="mb-4" />
      <h3 class="text-xl font-medium mb-2">请选择页面布局</h3>
      <p>从左侧面板选择一个布局模板开始设计</p>
    </div>
    
    <!-- 显示页面内容 -->
    <div 
      v-else 
      class="page-container flex-1 p-4"
      :class="'layout-' + currentPage.layoutType"
    >
      <!-- 渲染各个区域 -->
      <div class="regions-container" :class="getLayoutClass(currentPage.layoutType)">
        <div 
          v-for="region in currentPage.regions" 
          :key="region.id"
          class="region border border-dashed border-gray-300 dark:border-gray-600 p-3 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
          :class="[
            'region-' + region.name.toLowerCase(),
            selectedRegionId === region.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500' : ''
          ]"
          @click.stop="selectRegion(region.id)"
        >
          <div class="region-header mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between items-center">
            <span>{{ region.name }}</span>
            <n-tag :type="region.components.length ? 'info' : 'warning'" size="small">
              {{ region.components.length }}
            </n-tag>
          </div>
          
          <div class="region-content min-h-[50px] flex items-center justify-center">
            <template v-if="region.components.length === 0">
              <div class="empty-hint text-center text-sm text-gray-500 dark:text-gray-400">
                <n-icon :component="AddCircleOutline" size="20" class="mb-1" />
                <div>将组件拖放到此处</div>
              </div>
            </template>
            <template v-else>
              <!-- 组件渲染将在下一阶段实现 -->
              <div class="text-center text-sm text-gray-600 dark:text-gray-300">
                {{ region.components.length }} 个组件
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDesignerStore } from '@/stores/designerStore';
import { AppsOutline, AddCircleOutline } from '@vicons/ionicons5';

const designerStore = useDesignerStore();

// 计算属性
const currentPage = computed(() => designerStore.currentPage);
const selectedRegionId = computed(() => designerStore.selectedRegionId);

// 选择区域
const selectRegion = (regionId: string) => {
  designerStore.selectRegion(regionId);
};

// 获取布局类名
const getLayoutClass = (layoutType: string) => {
  switch (layoutType) {
    case 'table-layout':
      return 'grid-rows-[auto_1fr_auto]';
    case 'dashboard-layout':
      return 'grid-rows-[auto_1fr] grid-cols-2 gap-4';
    case 'form-layout':
      return 'grid-rows-[auto_1fr_auto]';
    default:
      return '';
  }
};
</script>

<style scoped>
.layout-table-layout .regions-container {
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr auto;
}

.layout-dashboard-layout .regions-container {
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.layout-dashboard-layout .region-header {
  grid-column: span 2;
}

.layout-form-layout .regions-container {
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr auto;
}

/* 修复深色模式下的标签颜色 */
:deep(.n-tag--info) {
  background-color: rgba(96, 165, 250, 0.2);
}

:deep(.n-tag--warning) {
  background-color: rgba(251, 146, 60, 0.2);
}

.dark :deep(.n-tag--info) {
  color: #93c5fd;
}

.dark :deep(.n-tag--warning) {
  color: #fdba74;
}
</style>
