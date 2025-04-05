<template>
  <div class="echarts-area-widget">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div v-if="subtitle" class="chart-subtitle">{{ subtitle }}</div>
    <div ref="chartRef" :style="{ height: height || '350px' }" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: '面积图'
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
  // 面积图数据
  areaData: {
    type: Array,
    default: () => []
  },
  // X轴数据（可选）
  xAxisData: {
    type: Array,
    default: () => []
  },
  // 系列名称
  seriesName: {
    type: String,
    default: '数据趋势'
  },
  // 线条颜色
  lineColor: {
    type: String,
    default: '#5470c6'
  },
  // 面积填充渐变开始颜色
  areaStartColor: {
    type: String,
    default: 'rgba(84, 112, 198, 0.7)'
  },
  // 面积填充渐变结束颜色
  areaEndColor: {
    type: String,
    default: 'rgba(84, 112, 198, 0.1)'
  },
  // 是否显示数据缩放组件
  showZoom: {
    type: Boolean,
    default: true
  },
  // 数据缩放范围
  zoomRange: {
    type: Object,
    default: () => ({ start: 0, end: 100 })
  }
});

// 图表DOM引用
const chartRef = ref(null);
// 图表实例
let chartInstance = null;

// 生成示例数据
function generateDefaultData() {
  const data = [];
  let baseValue = Math.random() * 300;
  for (let i = 0; i < 100; i++) {
    baseValue = Math.max(10, baseValue + (Math.random() - 0.5) * 20);
    data.push(Math.round(baseValue));
  }
  return data;
}

// 生成示例日期
function generateDefaultDates(length) {
  const now = new Date();
  const oneDay = 24 * 3600 * 1000;
  const result = [];
  
  for (let i = 0; i < length; i++) {
    const time = new Date(now.getTime() - (length - i) * oneDay);
    result.push([time.getFullYear(), time.getMonth() + 1, time.getDate()].join('/'));
  }
  
  return result;
}

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
  
  // 使用传入的数据或生成默认数据
  const yData = props.areaData && props.areaData.length > 0 
    ? props.areaData 
    : generateDefaultData();
    
  // 根据数据长度生成或使用传入的X轴数据
  const xData = props.xAxisData && props.xAxisData.length > 0 
    ? props.xAxisData 
    : generateDefaultDates(yData.length);
  
  // 图表配置
  const option = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: props.showZoom ? [
      {
        type: 'inside',
        start: props.zoomRange.start,
        end: props.zoomRange.end
      },
      {
        start: props.zoomRange.start,
        end: props.zoomRange.end
      }
    ] : [],
    series: [
      {
        name: props.seriesName,
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: props.lineColor
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: props.areaStartColor
            },
            {
              offset: 1,
              color: props.areaEndColor
            }
          ])
        },
        data: yData
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
    props.areaData,
    props.xAxisData,
    props.seriesName,
    props.lineColor,
    props.areaStartColor,
    props.areaEndColor,
    props.showZoom,
    props.zoomRange
  ],
  () => {
    updateChartOption();
  },
  { deep: true }
);
</script>

<style scoped>
.echarts-area-widget {
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