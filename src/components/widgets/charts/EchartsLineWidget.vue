<template>
  <div class="echarts-line-widget">
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
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
]);

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: '折线图示例'
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
  // X轴类型: 'category'类别轴, 'value'数值轴, 'time'时间轴
  xAxisType: {
    type: String,
    default: 'category'
  },
  // Y轴标题
  yAxisTitle: {
    type: String,
    default: '数值'
  },
  // 是否平滑曲线
  smooth: {
    type: Boolean,
    default: true
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // 图表数据
  data: {
    type: Array,
    default: () => []
  }
});

// 图表DOM引用
const chartRef = ref(null);
// 图表实例
let chartInstance = null;

// 示例数据 - 如果未传入数据则使用
const defaultData = {
  xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  series: [
    {
      name: '访问量',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    },
    {
      name: '点击量',
      data: [420, 532, 501, 534, 690, 730, 820]
    }
  ]
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
  const chartData = props.data && props.data.length > 0 ? props.data : defaultData;
  
  // 图表配置
  const option = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: props.showLegend,
      top: 'bottom',
      data: chartData.series.map(item => item.name)
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: props.subtitle ? '15%' : '10%',
      containLabel: true
    },
    xAxis: {
      type: props.xAxisType,
      data: chartData.xAxisData,
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: props.yAxisTitle
    },
    series: chartData.series.map(item => ({
      name: item.name,
      type: 'line',
      smooth: props.smooth,
      data: item.data
    }))
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
    props.smooth,
    props.showLegend,
    props.xAxisType,
    props.yAxisTitle,
    props.data
  ],
  () => {
    updateChartOption();
  },
  { deep: true }
);
</script>

<style scoped>
.echarts-line-widget {
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