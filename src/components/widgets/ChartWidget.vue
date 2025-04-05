<template>
  <div class="chart-widget" :style="styles">
    <component 
      :is="getChartComponent(chartType)" 
      v-bind="$props"
      v-if="chartType"
    />
    <div v-else class="chart-placeholder">
      <i class="pi pi-chart-bar text-4xl text-gray-400"></i>
      <p class="text-gray-500 mt-2">图表类型未指定</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import EchartsLineWidget from './charts/EchartsLineWidget.vue';
import EchartsBarWidget from './charts/EchartsBarWidget.vue';
import HighchartsPieWidget from './charts/HighchartsPieWidget.vue';
import HighchartsAreaWidget from './charts/HighchartsAreaWidget.vue';

const props = defineProps({
  // 组件实例
  component: {
    type: Object,
    required: true
  },
  // 图表类型: line, bar, pie, area 等
  chartType: {
    type: String,
    default: ''
  },
  // 图表标题
  title: {
    type: String,
    default: ''
  },
  // 图表副标题
  subtitle: {
    type: String,
    default: ''
  },
  // 图表高度
  height: {
    type: String,
    default: '350px'
  },
  // 其他图表特定属性
  // ...
  // 样式
  styles: {
    type: Object,
    default: () => ({})
  }
});

// 样式组合
const styles = computed(() => {
  // 基本样式
  const baseStyles = {
    width: '100%',
    height: props.height || '350px',
    overflow: 'hidden'
  };
  
  // 合并组件的样式
  return { ...baseStyles, ...props.styles };
});

// 获取图表组件
function getChartComponent(chartType: string) {
  if (!chartType) return null;
  
  // 根据图表类型返回对应的组件
  switch(chartType) {
    case 'line':
      return EchartsLineWidget;
    case 'bar':
      return EchartsBarWidget;
    case 'pie':
      return HighchartsPieWidget;
    case 'area':
      return HighchartsAreaWidget;
    // 更多图表类型可在此扩展
    default:
      return null;
  }
}
</script>

<style scoped>
.chart-widget {
  width: 100%;
  min-height: 200px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
</style> 