<template>
  <div class="highcharts-pie-widget">
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
    default: '饼图示例'
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
  // 是否启用数据标签
  enableDataLabels: {
    type: Boolean,
    default: true
  },
  // 系列名称
  seriesName: {
    type: String,
    default: '数据占比'
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
const defaultData = [
  { name: '浏览器', y: 62.74, sliced: true, selected: true },
  { name: '移动端', y: 30.57 },
  { name: '平板', y: 5.68 },
  { name: '其他', y: 1.01 }
];

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
      type: 'pie',
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
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: props.enableDataLabels,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        },
        showInLegend: props.showLegend
      }
    },
    legend: {
      enabled: props.showLegend,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    series: [{
      name: props.seriesName,
      colorByPoint: true,
      data: chartData
    }],
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
    props.enableDataLabels,
    props.seriesName,
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
.highcharts-pie-widget {
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