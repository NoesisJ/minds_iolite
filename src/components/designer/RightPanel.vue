<template>
  <div class="right-panel h-full overflow-auto p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
    <!-- 调试信息 - 临时启用以查看问题 -->
    <!-- <div class="mb-4 p-2 bg-gray-100 dark:bg-gray-700 text-xs rounded border">
      <div>当前页面ID: {{ currentPageId || '无' }}</div>
      <div>有页面: {{ !!currentPage }}</div>
      <div>选中区域: {{ selectedRegionId || '无' }}</div>
      <div>选中组件: {{ selectedComponentId || '无' }}</div>
      <div>应显示页面属性: {{ showPageProperties }}</div>
    </div> -->

    <!-- 页面属性面板 -->
    <div v-if="showPageProperties">
      <h3 class="text-lg font-medium mb-3">页面属性</h3>
      
      <div class="form-group mb-3">
        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">页面标题</label>
        <base-input 
          v-model="pageTitle" 
          @update:modelValue="updatePageTitle" 
          class="w-full"
          placeholder="请输入页面标题"
        />
      </div>
      
      <div class="form-group mb-3">
        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">页面名称</label>
        <base-input 
          v-model="pageName" 
          @update:modelValue="updatePageName"
          class="w-full" 
          placeholder="请输入页面名称"
        />
      </div>
      
      <div class="form-group mb-3">
        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">布局类型</label>
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
        <div class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">布局预览</div>
        <div class="border rounded p-3 bg-gray-50 dark:bg-gray-800">
          <div class="text-sm mb-2 text-center text-blue-500">{{ currentLayout.name }}</div>
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
        <n-form-item label="区域名称">
          <n-input v-model:value="regionName" disabled />
        </n-form-item>
      </div>
      
      <div class="form-group mb-3">
        <n-form-item label="组件数量">
          <n-input v-model:value="componentCount" disabled />
        </n-form-item>
      </div>
    </div>
    
    <!-- 组件属性 -->
    <div v-else-if="selectedComponent">
      <h3 class="text-lg font-medium mb-3">
        <span>{{ componentDefinition?.name || '组件' }}属性</span>
      </h3>
      
      <!-- 通用属性 -->
      <div class="common-props mb-4">
        <n-form-item label="组件ID">
          <n-input v-model:value="componentId" disabled />
        </n-form-item>
      </div>
      
      <!-- 组件特定属性 -->
      <div class="specific-props mb-4">
        <h4 class="font-medium mb-2 text-sm">内容属性</h4>
        
        <!-- 文本组件属性 -->
        <template v-if="componentType === 'text'">
          <n-form-item label="文本内容">
            <n-input 
              v-model:value="props.content" 
              type="textarea" 
              @update:value="updateProp('content', $event)" 
            />
          </n-form-item>
          
          <n-form-item label="字体大小">
            <n-input v-model:value="props.fontSize" @update:value="updateProp('fontSize', $event)" />
          </n-form-item>
          
          <n-form-item label="对齐方式">
            <n-select 
              v-model:value="props.textAlign" 
              :options="[
                { label: '左对齐', value: 'left' },
                { label: '居中', value: 'center' },
                { label: '右对齐', value: 'right' }
              ]"
              @update:value="updateProp('textAlign', $event)"
            />
          </n-form-item>
          
          <n-form-item label="文本颜色">
            <div class="color-picker-container">
              <n-input 
                v-model:value="props.color" 
                @update:value="updateProp('color', $event)" 
                class="color-input"
              />
              <span 
                class="color-preview-wrapper"
                :style="{backgroundColor: props.color || '#ffffff'}"
              ></span>
            </div>
          </n-form-item>
        </template>
        
        <!-- 按钮组件属性 -->
        <template v-else-if="componentType === 'button'">
          <n-form-item label="按钮文本">
            <n-input v-model:value="props.label" @update:value="updateProp('label', $event)" />
          </n-form-item>
          
          <n-form-item label="按钮类型">
            <n-select 
              v-model:value="props.type" 
              :options="[
                { label: '主要', value: 'primary' },
                { label: '默认', value: 'default' },
                { label: '信息', value: 'info' },
                { label: '成功', value: 'success' },
                { label: '警告', value: 'warning' },
                { label: '危险', value: 'error' }
              ]"
              @update:value="updateProp('type', $event)"
            />
          </n-form-item>
          
          <n-form-item label="按钮大小">
            <n-select 
              v-model:value="props.size" 
              :options="[
                { label: '小型', value: 'small' },
                { label: '中等', value: 'medium' },
                { label: '大型', value: 'large' }
              ]"
              @update:value="updateProp('size', $event)"
            />
          </n-form-item>
        </template>
        
        <!-- 图片组件属性 -->
        <template v-else-if="componentType === 'image'">
          <n-form-item label="图片来源">
            <n-radio-group v-model:value="imageSourceType" @update:value="updateImageSourceType">
              <n-space class="w-full">
                <n-radio value="local">本地图片</n-radio>
                <n-radio value="remote">远程URL</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          
          <template v-if="imageSourceType === 'local'">
            <n-form-item label="图片名称">
              <n-input 
                v-model:value="localImageName" 
                placeholder="例如: jlu.jpg" 
                @update:value="updateLocalImageName"
              />
              <div class="text-xs text-gray-500 mt-1">
                (存放在 src/assets/imgs/ 目录下)
              </div>
              <div class="available-images mt-2">
                <div class="text-xs text-gray-600">可用图片:</div>
                <div class="image-chips">
                  <span 
                    v-for="imageName in availableImages" 
                    :key="imageName"
                    class="image-chip" 
                    @click="selectImage(imageName)"
                  >
                    {{ imageName }}
                  </span>
                </div>
              </div>
            </n-form-item>
            
            <n-form-item>
              <n-button 
                type="primary" 
                block 
                @click="applyLocalImage"
              >
                应用图片
              </n-button>
            </n-form-item>
            
            <n-form-item label="预览">
              <div class="local-image-preview p-2 border border-gray-200 dark:border-gray-700 rounded">
                <img 
                  v-if="localImageName" 
                  :src="getLocalImageSrc(localImageName)" 
                  alt="图片预览"
                  class="max-w-full h-auto max-h-40 mx-auto"
                  @error="handleImageError"
                />
                <div v-else class="text-center p-4 text-gray-400">
                  请输入图片名称并应用
                </div>
              </div>
            </n-form-item>
          </template>
          
          <template v-else>
            <n-form-item label="图片URL">
              <n-input v-model:value="props.src" @update:value="updateProp('src', $event)" />
            </n-form-item>
          </template>
          
          <n-form-item label="替代文本">
            <n-input v-model:value="props.alt" @update:value="updateProp('alt', $event)" />
          </n-form-item>
          
          <n-form-item label="宽度">
            <n-input v-model:value="props.width" @update:value="updateProp('width', $event)" />
          </n-form-item>
          
          <n-form-item label="高度">
            <n-input v-model:value="props.height" @update:value="updateProp('height', $event)" />
          </n-form-item>
        </template>
        
        <!-- 输入框组件属性 -->
        <template v-else-if="componentType === 'input'">
          <n-form-item label="标签文本">
            <n-input v-model:value="props.label" @update:value="updateProp('label', $event)" />
          </n-form-item>
          
          <n-form-item label="占位文本">
            <n-input v-model:value="props.placeholder" @update:value="updateProp('placeholder', $event)" />
          </n-form-item>
          
          <n-form-item label="是否必填">
            <n-switch 
              v-model:value="props.required" 
              @update:value="updateProp('required', $event)" 
            />
          </n-form-item>
        </template>
        
        <!-- 添加其他组件类型的属性编辑器... -->
      </div>
      
      <!-- 样式属性 -->
      <div class="style-props">
        <h4 class="font-medium mb-2 text-sm">样式属性</h4>
        
        <n-form-item label="外边距">
          <n-input v-model:value="styles.margin" @update:value="updateStyle('margin', $event)" />
        </n-form-item>
        
        <n-form-item label="内边距">
          <n-input v-model:value="styles.padding" @update:value="updateStyle('padding', $event)" />
        </n-form-item>
        
        <n-form-item label="文本颜色">
          <n-input v-model:value="styles.color" @update:value="updateStyle('color', $event)" />
        </n-form-item>
      </div>
    </div>
    
    <!-- 未选择任何内容 -->
    <div v-else class="h-full flex items-center justify-center">
      <div class="text-center text-gray-500 dark:text-gray-400">
        <i class="pi pi-arrow-left text-2xl mb-2"></i>
        <p>请从左侧选择页面<br>或从画布选择组件</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDesignerStore } from '@/stores/designerStore';
import { getComponentDefinition } from '@/data/componentLibrary';
import { availableImages, getImageUrl } from '@/assets/imageImports';
import BaseInput from '@/components/Form/Inputs/BaseInput.vue';
import BaseSelect from '@/components/Form/Inputs/BaseSelect.vue';

// 调试模式开关
const debug = false;

const designerStore = useDesignerStore();

// 页面属性相关
const pageTitle = ref('');
const pageName = ref('');
const layoutType = ref('');

// 计算属性
const currentPageId = computed(() => designerStore.currentPageId);
const currentPage = computed(() => designerStore.currentPage);
const selectedRegionId = computed(() => designerStore.selectedRegionId);
const selectedRegion = computed(() => designerStore.selectedRegion);
const selectedComponentId = computed(() => designerStore.selectedComponentId);
const selectedComponent = computed(() => designerStore.selectedComponent);

// 组件属性
const componentId = ref('');
const componentType = ref('');
const props = ref<any>({});
const styles = ref<any>({});
const componentDefinition = computed(() => {
  if (!selectedComponent.value) return null;
  return getComponentDefinition(selectedComponent.value.componentId);
});

// 区域属性
const regionName = ref('');
const componentCount = ref(0);

// 布局选项
const layoutOptions = computed(() => {
  return designerStore.layoutTemplates.map(layout => ({
    label: layout.name,
    value: layout.id
  }));
});

// 图片组件属性
const imageSourceType = ref('local');
const localImageName = ref('');

// 强制渲染页面属性面板
const forceShowPageProperties = true;

// 是否显示页面属性面板 - 修改逻辑
const showPageProperties = computed(() => {
  const shouldShow = currentPageId.value && 
                     currentPage.value && 
                     !selectedRegionId.value && 
                     !selectedComponentId.value;
  
  console.log('页面属性面板显示状态:', {
    当前页面ID: currentPageId.value,
    有当前页面: !!currentPage.value,
    选中区域ID: selectedRegionId.value,
    选中组件ID: selectedComponentId.value,
    应显示: shouldShow
  });
  
  return shouldShow || forceShowPageProperties; // 临时使用强制显示选项
});

// 获取当前选中的布局
const currentLayout = computed(() => {
  if (!layoutType.value) return null;
  return designerStore.layoutTemplates.find(t => t.id === layoutType.value);
});

// 监听页面变化
watch(currentPage, (page) => {
  if (page) {
    pageTitle.value = page.title || '';
    pageName.value = page.name || '';
    layoutType.value = page.layoutType || '';
    console.log('页面已加载:', page);
  } else {
    pageTitle.value = '';
    pageName.value = '';
    layoutType.value = '';
    console.log('无当前页面');
  }
}, { immediate: true });

// 监听区域变化
watch(selectedRegion, (region) => {
  if (region) {
    regionName.value = region.name;
    componentCount.value = region.components.length;
  }
}, { immediate: true });

// 监听组件变化
watch(selectedComponent, (component) => {
  if (component) {
    componentId.value = component.id;
    const definition = getComponentDefinition(component.componentId);
    componentType.value = definition?.type || '';
    props.value = { ...component.props };
    styles.value = { ...component.styles };
  } else {
    componentId.value = '';
    componentType.value = '';
    props.value = {};
    styles.value = {};
  }
}, { immediate: true });

// 更新页面属性
const updatePageTitle = (value: string) => {
  console.log('更新页面标题:', value);
  if (currentPageId.value) {
    designerStore.updatePageTitle(currentPageId.value, value);
  } else {
    console.warn('无法更新标题: 未选中页面');
  }
};

const updatePageName = (value: string) => {
  console.log('更新页面名称:', value);
  if (currentPageId.value) {
    designerStore.updatePageProperty(currentPageId.value, 'name', value);
  } else {
    console.warn('无法更新名称: 未选中页面');
  }
};

const updateLayoutType = (value: string) => {
  console.log('更新布局类型:', value);
  if (currentPageId.value) {
    designerStore.applyLayout(value);
  } else {
    console.warn('无法更新布局: 未选中页面');
  }
};

// 更新组件属性
const updateProp = (key: string, value: any) => {
  if (!selectedComponentId.value) return;
  
  const updatedProps = {
    [key]: value
  };
  
  designerStore.updateComponentProps(selectedComponentId.value, updatedProps);
};

// 更新组件样式
const updateStyle = (key: string, value: any) => {
  if (!selectedComponentId.value) return;
  
  const updatedStyles = {
    [key]: value
  };
  
  designerStore.updateComponentStyles(selectedComponentId.value, updatedStyles);
};

// 更新图片源类型
const updateImageSourceType = (value: string) => {
  imageSourceType.value = value;
};

// 更新本地图片名称
const updateLocalImageName = (value: string) => {
  localImageName.value = value;
};

// 获取本地图片源 - 使用Vite的资源导入
const getLocalImageSrc = (name: string) => {
  if (!name) return '';
  return getImageUrl(name);
};

// 应用本地图片 - 实现真正的功能
const applyLocalImage = () => {
  if (!localImageName.value) {
    return;
  }
  
  // 更新组件的src属性
  updateProp('src', localImageName.value);
  
  // 可选：显示成功提示
  console.log('已应用图片: ' + localImageName.value);
};

// 处理图片加载错误 - 实现真正的功能
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  
  // 在控制台显示错误
  console.error('图片加载失败:', target.src);
  
  // 显示友好的错误信息
  target.alt = '图片加载失败';
  
  // 可以替换为默认错误图片
  // target.src = '/imgs/error.png';
};

// 增加选择示例图片的功能
const selectImage = (imageName: string) => {
  localImageName.value = imageName;
};
</script>

<style scoped>
/* 确保表单项独占一行 */
:deep(.n-form-item) {
  margin-bottom: 12px;
  width: 100%;
  display: block;
}

:deep(.n-form-item-label) {
  font-size: 14px;
  padding-bottom: 4px;
  color: #555;
  font-weight: 500;
  display: block;
  width: 100%;
}

:deep(.n-form-item-blank) {
  width: 100%;
  display: block;
}

.dark :deep(.n-form-item-label) {
  color: #ccc;
}

h4.font-medium {
  color: #555;
  font-weight: 500;
}

.dark h4.font-medium {
  color: #ccc;
}

:deep(.n-input) {
  background-color: #f5f5f5;
  color: #222;
}

.dark :deep(.n-input) {
  background-color: #282828;
  color: #f0f0f0;
}

:deep(.n-input--disabled) {
  opacity: 0.75;
}

:deep(.n-form-item) {
  border-radius: 4px;
  transition: all 0.2s;
}

:deep(.n-input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.specific-props, .style-props {
  padding: 0;
  background-color: transparent;
  border-radius: 0;
  margin-bottom: 16px;
}

.dark .specific-props, .dark .style-props {
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
