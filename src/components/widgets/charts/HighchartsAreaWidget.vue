<template>
  <div class="highcharts-area-widget">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div v-if="subtitle" class="chart-subtitle">{{ subtitle }}</div>
    <div ref="chartRef" :style="{ height: height || '350px' }" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Highcharts from 'highcharts';

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: '面积图示例'
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
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // 面积填充透明度
  fillOpacity: {
    type: Number,
    default: 0.5
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
  categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  series: [
    {
      name: '产品A',
      data: [5, 7, 10, 13, 15, 18, 20, 23, 18, 15, 10, 7]
    },
    {
      name: '产品B',
      data: [3, 4, 6, 8, 13, 15, 17, 18, 15, 12, 9, 6]
    }
  ]
};

// 初始化图表
function initChart() {
  if (!chartRef.value) return;
  
  // 创建图表实例
  chartInstance = Highcharts.chart(chartRef.value, getChartOptions());
  
  // 窗口大小变化时调整图表大小
  window.addEventListener('resize', resizeChart);
}

// 获取图表配置
function getChartOptions() {
  // 使用传入的数据或默认数据
  const chartData = props.data && props.data.length > 0 ? props.data : defaultData;
  
  return {
    chart: {
      type: 'area',
      backgroundColor: 'transparent'
    },
    title: {
      text: props.title,
      style: {
        fontSize: '16px'
      }
    },
    subtitle: {
      text: props.subtitle,
      style: {
        fontSize: '14px'
      }
    },
    xAxis: {
      categories: chartData.categories,
      crosshair: true
    },
    yAxis: {
      title: {
        text: '数值'
      }
    },
    tooltip: {
      shared: true,
      valueSuffix: ' 单位'
    },
    plotOptions: {
      area: {
        fillOpacity: props.fillOpacity,
        marker: {
          radius: 4,
          lineWidth: 1
        }
      }
    },
    legend: {
      enabled: props.showLegend,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    series: chartData.series.map(series => ({
      name: series.name,
      data: series.data
    })),
    credits: {
      enabled: false
    }
  };
}

// 调整图表大小
function resizeChart() {
  if (chartInstance) {
    chartInstance.reflow();
  }
}

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
});

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  window.removeEventListener('resize', resizeChart);
});

// 监听属性变化，更新图表
watch(
  () => [
    props.title,
    props.subtitle,
    props.showLegend,
    props.fillOpacity,
    props.data
  ],
  () => {
    if (chartInstance) {
      chartInstance.update(getChartOptions());
    }
  },
  { deep: true }
);
</script>

<style scoped>
.highcharts-area-widget {
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