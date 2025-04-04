<template>
  <div class="component-preview" :style="styles">
    <!-- 文本组件 -->
    <template v-if="componentType === 'text'">
      <div 
        class="text-component" 
        :style="{ 
          fontSize: componentProps.fontSize, 
          textAlign: componentProps.textAlign,
          color: componentProps.color || '#333333'
        }"
      >
        {{ componentProps.content }}
      </div>
    </template>
    
    <!-- 图片组件 -->
    <template v-else-if="componentType === 'image'">
      <div class="image-preview flex items-center justify-center bg-gray-100 dark:bg-gray-800 min-h-[100px]">
        <img 
          v-if="componentProps.src" 
          :src="getImageSrc(componentProps.src)"
          :alt="componentProps.alt" 
          :style="{ 
            width: componentProps.width || '100%', 
            height: componentProps.height || 'auto',
            maxHeight: '200px',
            objectFit: 'contain'
          }"
          @error="handleImageError"
        />
        <div v-else class="text-gray-400 p-4 text-center">
          <i class="pi pi-image text-2xl"></i>
          <div class="text-sm mt-1">图片预览</div>
        </div>
      </div>
    </template>
    
    <!-- 按钮组件 -->
    <template v-else-if="componentType === 'button'">
      <n-button :type="componentProps.type" :size="componentProps.size">
        {{ componentProps.label }}
      </n-button>
    </template>
    
    <!-- 输入框组件 -->
    <template v-else-if="componentType === 'input'">
      <div class="form-field">
        <div v-if="componentProps.label" class="field-label mb-1 text-sm">
          {{ componentProps.label }}
          <span v-if="componentProps.required" class="text-red-500">*</span>
        </div>
        <n-input :placeholder="componentProps.placeholder" disabled />
      </div>
    </template>
    
    <!-- 下拉框组件 -->
    <template v-else-if="componentType === 'select'">
      <div class="form-field">
        <div v-if="componentProps.label" class="field-label mb-1 text-sm">
          {{ componentProps.label }}
          <span v-if="componentProps.required" class="text-red-500">*</span>
        </div>
        <n-select :options="componentProps.options" :placeholder="componentProps.placeholder" disabled />
      </div>
    </template>
    
    <!-- 表格组件 -->
    <template v-else-if="componentType === 'table'">
      <div class="table-preview border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
        <div class="table-header bg-gray-100 dark:bg-gray-800 p-2 text-sm">
          <div class="grid" :style="{ gridTemplateColumns: `repeat(${componentProps.columns.length}, 1fr)` }">
            <div v-for="column in componentProps.columns" :key="column.field" class="font-medium">
              {{ column.header }}
            </div>
          </div>
        </div>
        <div class="table-body p-2 text-sm">
          <div class="text-gray-500 dark:text-gray-400 text-center py-2">
            表格数据将在运行时显示
          </div>
        </div>
      </div>
    </template>
    
    <!-- 图表组件 -->
    <template v-else-if="componentType === 'chart'">
      <div class="chart-preview" :style="componentStyles">
        <div class="chart-placeholder flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded border border-dashed border-gray-300 dark:border-gray-600" :style="{height: componentProps.height || '300px'}">
          <div class="text-3xl mb-2">
            <i :class="getChartIcon(componentProps.chartType)"></i>
          </div>
          <div class="text-lg font-medium">{{ componentProps.title || '图表组件' }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ getChartDescription(componentProps.chartType) }}</div>
        </div>
      </div>
    </template>
    
    <!-- 未知组件 -->
    <template v-else>
      <div class="unknown-component p-2 bg-gray-100 dark:bg-gray-800 text-center text-sm">
        未知组件类型：{{ componentType }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getComponentDefinition } from '@/data/componentLibrary';
import { getImageUrl } from '@/assets/imageImports';

// 组件实例属性
const props = defineProps({
  component: {
    type: Object,
    required: true
  }
});

// 组件类型
const componentType = computed(() => {
  const definition = getComponentDefinition(props.component.componentId);
  return definition?.type || 'unknown';
});

// 组件属性
const componentProps = computed(() => {
  return props.component.props || {};
});

// 组件样式
const styles = computed(() => {
  return props.component.styles || {};
});

// 获取图片源路径 - 使用Vite的资源导入
const getImageSrc = (src: string) => {
  if (!src) return '';
  
  // 判断是否为完整URL
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // 使用资源导入
  return getImageUrl(src);
};

// 改进错误处理
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  console.error('图片加载失败:', target.src);
  
  // 添加错误样式
  target.classList.add('error');
  target.parentElement?.classList.add('error-container');
  
  // 改变alt文本提供反馈
  target.alt = '图片未找到';
  
  // 错误信息
  const errorText = document.createElement('div');
  errorText.className = 'error-text';
  errorText.textContent = '无法加载图片';
  
  // 确保只添加一次错误信息
  if (!target.parentElement?.querySelector('.error-text')) {
    target.parentElement?.appendChild(errorText);
  }
};

function getChartIcon(chartType) {
  switch(chartType) {
    case 'area-line': return 'pi pi-chart-line';
    case 'basic-pie': return 'pi pi-chart-pie';
    case 'interactive-pie-line': return 'pi pi-chart-bar';
    case 'mix-bar-line': return 'pi pi-chart-bar';
    case 'radar': return 'pi pi-chart-line';
    case 'smooth-line': return 'pi pi-chart-line';
    case 'time-series': return 'pi pi-chart-line';
    default: return 'pi pi-chart-bar';
  }
}

function getChartDescription(chartType) {
  switch(chartType) {
    case 'area-line': return '大数据面积图';
    case 'basic-pie': return '基础饼图';
    case 'interactive-pie-line': return '联动折线饼图';
    case 'mix-bar-line': return '混合折柱图';
    case 'radar': return '雷达图';
    case 'smooth-line': return '平滑折线图';
    case 'time-series': return '时间轴折线图';
    default: return '图表组件';
  }
}
</script>

<style scoped>
.component-preview {
  position: relative;
}

.unknown-component {
  border-radius: 4px;
}

.text-component {
  word-break: break-word;
  min-height: 24px;
  background: transparent;
}

/* 添加图片错误样式 */
.image-preview.error-container {
  border: 1px dashed #f56c6c;
  position: relative;
  padding-bottom: 30px;
}

.error-text {
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  text-align: center;
  color: #f56c6c;
  font-size: 12px;
}

.image-preview img.error {
  opacity: 0.5;
}

.image-preview img {
  max-width: 100%;
  transition: all 0.3s;
}
</style> 