<template>
  <div v-if="show" class="publish-dialog-overlay" @click="onCloseRequest">
    <div class="publish-dialog-container" @click.stop>
      <!-- 对话框标题 -->
      <div class="dialog-header">
        <h2 class="text-xl font-medium text-gray-800 dark:text-white">发布项目</h2>
        <button @click="onCloseRequest" class="close-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <!-- 步骤指示器 -->
      <div class="steps-indicator">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          :class="['step', { 'active': currentStep >= index, 'current': currentStep === index }]"
        >
          <div class="step-content">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-name">{{ step }}</div>
          </div>
        </div>
      </div>
      
      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 步骤1: 选择页面 -->
        <div v-if="currentStep === 0" class="step-page-select">
          <div class="section-title mb-4 text-lg font-medium text-gray-800 dark:text-white">选择要发布的页面</div>
          
          <div v-if="pages.length === 0" class="empty-state">
            <i class="pi pi-exclamation-circle text-3xl mb-3 text-gray-400"></i>
            <div class="text-gray-500 dark:text-gray-400">没有可用的页面</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">请先在设计器中创建页面</div>
          </div>
          
          <div v-else class="pages-list">
            <div class="select-all-row mb-2">
              <label class="flex items-center cursor-pointer py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                <input 
                  type="checkbox" 
                  :checked="isAllSelected" 
                  @change="toggleSelectAll" 
                  class="mr-2 h-4 w-4"
                >
                <span class="text-gray-700 dark:text-gray-300">全选</span>
              </label>
            </div>
            
            <div 
              v-for="page in pages" 
              :key="page.id" 
              class="page-item"
              :class="{ 'selected': selectedPages.includes(page.id) }"
              @click="togglePageSelection(page.id)"
            >
              <div class="checkbox">
                <i v-if="selectedPages.includes(page.id)" class="pi pi-check"></i>
              </div>
              <div class="page-info">
                <div class="page-title">{{ page.title }}</div>
                <div class="page-type">{{ getLayoutName(page.layoutType) }}</div>
              </div>
              <div class="page-preview">
                <i class="pi pi-file"></i>
              </div>
            </div>
          </div>
          
          <div class="selection-summary mt-4 text-sm text-gray-500 dark:text-gray-400">
            已选择 {{ selectedPages.length }} / {{ pages.length }} 个页面
          </div>
        </div>
        
        <!-- 其他步骤的占位符 -->
        <div v-if="currentStep > 0" class="placeholder">
          <div class="text-center text-gray-500 dark:text-gray-400">
            步骤 {{ currentStep + 1 }}: {{ steps[currentStep] }}
            <p class="mt-2">这部分内容将在后续步骤中实现</p>
          </div>
        </div>
      </div>
      
      <!-- 步骤控制按钮 -->
      <div class="dialog-actions">
        <button 
          v-if="currentStep > 0" 
          @click="prevStep" 
          class="btn-secondary"
        >
          上一步
        </button>
        <button 
          v-if="currentStep < steps.length - 1" 
          @click="nextStep" 
          class="btn-primary"
          :disabled="currentStep === 0 && selectedPages.length === 0"
        >
          下一步
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDesignerStore } from '@/stores/designerStore';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);
const designerStore = useDesignerStore();

// 步骤定义
const steps = ['选择页面', '项目设置', '生成配置', '下载项目'];
const currentStep = ref(0);

// 页面选择状态
const pages = computed(() => designerStore.pages);
const selectedPages = ref<string[]>([]);

// 计算属性：是否全选
const isAllSelected = computed(() => {
  return pages.value.length > 0 && selectedPages.value.length === pages.value.length;
});

// 方法：获取布局名称
const getLayoutName = (layoutType: string) => {
  const layout = designerStore.layoutTemplates.find(l => l.id === layoutType);
  return layout ? layout.name : '自定义布局';
};

// 方法：切换页面选择
const togglePageSelection = (pageId: string) => {
  const index = selectedPages.value.indexOf(pageId);
  if (index === -1) {
    selectedPages.value.push(pageId);
  } else {
    selectedPages.value.splice(index, 1);
  }
};

// 方法：切换全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedPages.value = [];
  } else {
    selectedPages.value = pages.value.map(page => page.id);
  }
};

// 关闭请求
const onCloseRequest = () => {
  emit('close');
  // 重置状态
  currentStep.value = 0;
  selectedPages.value = [];
};

// 步骤导航
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 初始化时预选当前页面
onMounted(() => {
  if (designerStore.currentPageId && pages.value.some(p => p.id === designerStore.currentPageId)) {
    selectedPages.value = [designerStore.currentPageId];
  }
});
</script>

<style scoped>
.publish-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.publish-dialog-container {
  width: 90%;
  max-width: 800px;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.dark .publish-dialog-container {
  background-color: #1f2937;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .dialog-header {
  border-color: #4b5563;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
}

.steps-indicator {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .steps-indicator {
  border-color: #4b5563;
}

.step {
  display: flex;
  flex: 1;
  position: relative;
  justify-content: center;
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 1rem;
  left: 60%;
  right: 0;
  height: 2px;
  background-color: #e5e7eb;
  z-index: 1;
}

.dark .step:not(:last-child)::after {
  background-color: #4b5563;
}

.step.active:not(:last-child)::after {
  background-color: #3b82f6;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.dark .step-number {
  background-color: #4b5563;
  color: #e5e7eb;
}

.step.active .step-number {
  background-color: #3b82f6;
  color: white;
}

.step-name {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  white-space: nowrap;
}

.dark .step-name {
  color: #9ca3af;
}

.step.current .step-name {
  color: #111827;
  font-weight: 500;
}

.dark .step.current .step-name {
  color: #f9fafb;
}

.step-content {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
}

.dark .placeholder {
  border-color: #4b5563;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.dark .dialog-actions {
  border-color: #4b5563;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
  margin-right: 0.5rem;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.dark .btn-secondary {
  background-color: #374151;
  color: #e5e7eb;
  border-color: #4b5563;
}

.dark .btn-secondary:hover {
  background-color: #4b5563;
}

/* 添加页面选择相关样式 */
.section-title {
  margin-bottom: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.pages-list {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.dark .pages-list {
  border-color: #4b5563;
}

.select-all-row {
  border-bottom: 1px solid #e5e7eb;
}

.dark .select-all-row {
  border-color: #4b5563;
}

.page-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dark .page-item {
  border-color: #4b5563;
}

.page-item:last-child {
  border-bottom: none;
}

.page-item:hover {
  background-color: #f9fafb;
}

.dark .page-item:hover {
  background-color: #374151;
}

.page-item.selected {
  background-color: #eff6ff;
}

.dark .page-item.selected {
  background-color: #1e3a8a;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dark .checkbox {
  border-color: #6b7280;
}

.page-item.selected .checkbox {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.page-info {
  flex: 1;
}

.page-title {
  font-weight: 500;
  color: #111827;
}

.dark .page-title {
  color: #f9fafb;
}

.page-type {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.dark .page-type {
  color: #9ca3af;
}

.page-preview {
  color: #6b7280;
  font-size: 1.25rem;
}

.dark .page-preview {
  color: #9ca3af;
}

.selection-summary {
  text-align: right;
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.dark .btn-primary:disabled {
  background-color: #1e40af;
  opacity: 0.5;
}
</style> 