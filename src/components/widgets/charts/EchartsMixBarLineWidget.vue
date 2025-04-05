<template>
  <div class="echarts-mix-bar-line-widget">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div v-if="subtitle" class="chart-subtitle">{{ subtitle }}</div>
    <div ref="chartRef" :style="{ height: height || '350px' }" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: '混合柱状折线图'
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
  // X轴数据
  xAxisData: {
    type: Array,
    default: () => []
  },
  // 第一组柱状图数据
  barData1: {
    type: Array,
    default: () => []
  },
  // 第二组柱状图数据
  barData2: {
    type: Array,
    default: () => []
  },
  // 折线图数据
  lineData: {
    type: Array,
    default: () => []
  },
  // 系列名称
  seriesNames: {
    type: Array,
    default: () => ['系列1', '系列2', '系列3']
  },
  // Y轴名称
  yAxisNames: {
    type: Array,
    default: () => ['数值1', '数值2']
  },
  // 颜色调色板
  colorPalette: {
    type: Array,
    default: () => ['#5470c6', '#91cc75', '#ee6666']
  }
});

// 图表DOM引用
const chartRef = ref(null);
// 图表实例
let chartInstance = null;

// 示例数据 - 如果未传入数据则使用
const defaultData = {
  xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  barData1: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
  barData2: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6],
  lineData: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3]
};

// 初始化图表
function initChart() {
  if (!chartRef.value) return;
  
  // 创建图表实例
  chartInstance = echarts.init(chartRef.value);
  
  // 更新图表配置
  updateChartOption();
  
  // 窗口大小变化时调整图表大小
  window.addEventListener('resize', resizeChart);
}

// 更新图表配置
function updateChartOption() {
  if (!chartInstance) return;
  
  // 使用传入的数据或默认数据
  const xData = props.xAxisData && props.xAxisData.length > 0 
    ? props.xAxisData 
    : defaultData.xAxisData;
    
  const barData1 = props.barData1 && props.barData1.length > 0 
    ? props.barData1 
    : defaultData.barData1;
    
  const barData2 = props.barData2 && props.barData2.length > 0 
    ? props.barData2 
    : defaultData.barData2;
    
  const lineData = props.lineData && props.lineData.length > 0 
    ? props.lineData 
    : defaultData.lineData;
  
  // 图表配置
  const option = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: props.seriesNames,
      bottom: '0%'
    },
    color: props.colorPalette,
    xAxis: [
      {
        type: 'category',
        data: xData,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: props.yAxisNames[0]
      },
      {
        type: 'value',
        name: props.yAxisNames[1]
      }
    ],
    series: [
      {
        name: props.seriesNames[0],
        type: 'bar',
        data: barData1
      },
      {
        name: props.seriesNames[1],
        type: 'bar',
        data: barData2
      },
      {
        name: props.seriesNames[2],
        type: 'line',
        yAxisIndex: 1,
        data: lineData
      }
    ]
  };
  
  // 设置图表配置
  chartInstance.setOption(option);
}

// 调整图表大小
function resizeChart() {
  if (chartInstance) {
    chartInstance.resize();
  }
}

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
});

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', resizeChart);
});

// 监听属性变化，更新图表
watch(
  () => [
    props.title,
    props.subtitle,
    props.xAxisData,
    props.barData1,
    props.barData2,
    props.lineData,
    props.seriesNames,
    props.yAxisNames,
    props.colorPalette
  ],
  () => {
    updateChartOption();
  },
  { deep: true }
);
</script>

<style scoped>
.echarts-mix-bar-line-widget {
  width: 100%;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: #333;
  margin-bottom: 4px;
}

.chart-subtitle {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 8px;
}

.chart-container {
  width: 100%;
}

/* 暗色模式适配 */
:deep(.dark) .chart-title {
  color: #e5e7eb;
}

:deep(.dark) .chart-subtitle {
  color: #9ca3af;
}
</style> 