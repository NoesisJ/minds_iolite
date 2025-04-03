<template>
  <div class="design-canvas h-full w-full bg-gray-100 dark:bg-gray-900 overflow-auto">
    <!-- 选择布局提示 -->
    <div 
      v-if="!currentPage || !currentPage.layoutType || !currentLayout"
      class="h-full flex items-center justify-center text-center"
    >
      <div class="text-gray-500 dark:text-gray-400 max-w-md p-6">
        <div class="text-5xl mb-4"><i class="pi pi-columns"></i></div>
        <h3 class="text-xl font-medium mb-2">请选择页面布局</h3>
        <p class="mb-4">在右侧面板中选择一个布局模板开始设计</p>
        <base-button 
          status="primary" 
          @click="openLayoutSelector"
          size="medium"
        >
          选择布局
        </base-button>
      </div>
    </div>
    
    <!-- 页面布局渲染 -->
    <div 
      v-else
      class="page-container min-h-full p-4"
    >
      <div 
        class="layout-container bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
      >
        <h2 class="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
          {{ currentPage.title }}
        </h2>
        
        <!-- 动态渲染区域 -->
        <div class="regions-container">
          <div 
            v-for="region in currentPage.regions" 
            :key="region.id"
            class="region mb-4 p-3 border border-dashed rounded"
            :class="[
              getRegionClass(region.id),
              selectedRegionId === region.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
            ]"
            @click="selectRegion(region.id)"
            @dragover.prevent="onDragOver($event, region.id)"
            @drop="onDrop($event, region.id)"
          >
            <div class="region-header mb-2 flex justify-between items-center">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ region.name }}</span>
              <span class="text-xs text-gray-400 dark:text-gray-500">{{ region.components.length }}个组件</span>
            </div>
            
            <!-- 组件渲染 -->
            <div class="components-container">
              <div
                v-for="component in region.components"
                :key="component.id"
                class="component-wrapper mb-2 relative group"
                :class="{'border-2 border-blue-500 rounded': selectedComponentId === component.id}"
                @click.stop="handleComponentClick($event, component.id)"
              >
                <!-- 组件控制按钮 -->
                <div class="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    class="p-1 bg-white dark:bg-gray-800 rounded-full shadow text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                    @click.stop="openComponentSettings(component.id)"
                  >
                    <i class="pi pi-cog text-xs"></i>
                  </button>
                  <button 
                    class="p-1 bg-white dark:bg-gray-800 rounded-full shadow text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    @click.stop="removeComponent(component.id)"
                  >
                    <i class="pi pi-times text-xs"></i>
                  </button>
                </div>
                
                <!-- 动态组件 -->
                <component 
                  :is="getComponentType(component.type)"
                  v-bind="component.props"
                  :style="component.styles"
                  class="border border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded p-1"
                />
              </div>
              
              <!-- 空区域提示 -->
              <div 
                v-if="region.components.length === 0" 
                class="empty-region py-6 text-center text-gray-400 dark:text-gray-500 text-sm bg-gray-50 dark:bg-gray-900/30 rounded border border-dashed border-gray-300 dark:border-gray-700"
              >
                <div class="mb-2"><i class="pi pi-arrow-down text-lg"></i></div>
                <div>将组件拖放到此区域</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDesignerStore } from '@/stores/designerStore';
import { getComponentType } from '@/utils/componentUtils';
import BaseButton from '@/components/Form/Buttons/BaseButton.vue';

const designerStore = useDesignerStore();

// 计算属性
const currentPage = computed(() => designerStore.currentPage);
const currentLayout = computed(() => {
  if (!currentPage.value || !currentPage.value.layoutType) return null;
  return designerStore.layoutTemplates.find(t => t.id === currentPage.value?.layoutType);
});
const selectedRegionId = computed(() => designerStore.selectedRegionId);
const selectedComponentId = computed(() => designerStore.selectedComponentId);

// 根据区域ID获取样式类名
const getRegionClass = (regionId: string) => {
  if (!currentLayout.value) return '';
  
  const regionDef = currentLayout.value.regions.find(r => r.id === regionId);
  if (!regionDef) return '';
  
  // 根据区域类型返回不同的类名
  switch (regionDef.id) {
    case 'header':
      return 'bg-gray-50 dark:bg-gray-900/30';
    case 'footer':
      return 'bg-gray-50 dark:bg-gray-900/30';
    case 'sidebar':
      return 'bg-gray-50 dark:bg-gray-900/20';
    case 'left':
      return 'bg-gray-50 dark:bg-gray-900/20';
    case 'right':
      return 'bg-gray-50 dark:bg-gray-900/20';
    default:
      return 'bg-white dark:bg-gray-800';
  }
};

// 方法
const selectRegion = (regionId: string) => {
  designerStore.selectedRegionId = regionId;
  designerStore.selectedComponentId = '';
};

const selectComponent = (componentId: string) => {
  designerStore.selectedComponentId = componentId;
  designerStore.selectedRegionId = '';
};

const openComponentSettings = (componentId: string) => {
  designerStore.selectedComponentId = componentId;
  // 可以在此处添加打开右侧面板的逻辑
};

const removeComponent = (componentId: string) => {
  if (confirm('确定要删除此组件吗？')) {
    designerStore.deleteComponent(componentId);
  }
};

// 打开布局选择器
const openLayoutSelector = () => {
  // 可以弹出布局选择对话框，或者自动切换到右侧面板
};

// 处理拖拽事件
const onDragOver = (event: DragEvent, regionId: string) => {
  event.preventDefault();
  // 可以添加视觉反馈
  const target = event.currentTarget as HTMLElement;
  target.classList.add('bg-blue-50', 'dark:bg-blue-900/10');
};

// 处理放置事件
const onDrop = (event: DragEvent, regionId: string) => {
  event.preventDefault();
  
  // 移除视觉反馈
  const target = event.currentTarget as HTMLElement;
  target.classList.remove('bg-blue-50', 'dark:bg-blue-900/10');
  
  try {
    const componentId = event.dataTransfer?.getData('componentId');
    
    if (componentId) {
      console.log('放置组件:', componentId, '到区域:', regionId);
      designerStore.addComponentToRegion(componentId, regionId);
    }
  } catch (error) {
    console.error('放置组件失败:', error);
  }
};

// 在组件点击事件中
const handleComponentClick = (event, componentId) => {
  event.stopPropagation(); // 阻止事件冒泡
  designerStore.selectComponent(componentId);
  console.log('组件点击:', componentId);
};

// 初始化
onMounted(() => {
  // 可以在此处添加初始化逻辑
  console.log('设计画布已挂载');
});
</script>

<style scoped>
.design-canvas {
  height: calc(100vh - var(--designer-header-height, 56px));
}
</style>
