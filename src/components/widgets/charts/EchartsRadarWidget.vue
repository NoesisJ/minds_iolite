<template>
  <div class="echarts-radar-widget">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div v-if="subtitle" class="chart-subtitle">{{ subtitle }}</div>
    <div
      ref="chartRef"
      :style="{ height: height || '350px' }"
      class="chart-container"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts/core";
import { RadarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer,
]);

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: "雷达图示例",
  },
  // 图表副标题
  subtitle: {
    type: String,
    default: "",
  },
  // 图表高度
  height: {
    type: String,
    default: "350px",
  },
  // 雷达图形状: 'polygon'多边形, 'circle'圆形
  shape: {
    type: String,
    default: "polygon",
  },
  // 指标数据
  indicators: {
    type: Array,
    default: () => [],
  },
  // 系列数据
  data: {
    type: Array,
    default: () => [],
  },
  // 颜色调色板
  colorPalette: {
    type: Array,
    default: () => ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de"],
  },
});

// 图表DOM引用
const chartRef = ref(null);
// 图表实例
let chartInstance = null;

// 示例指标数据 - 如果未传入则使用
const defaultIndicators = [
  { name: "销售", max: 6500 },
  { name: "管理", max: 16000 },
  { name: "信息技术", max: 30000 },
  { name: "客户支持", max: 38000 },
  { name: "研发", max: 52000 },
  { name: "市场营销", max: 25000 },
];

// 示例系列数据 - 如果未传入则使用
const defaultData = [
  {
    name: "预算分配",
    value: [4200, 3000, 20000, 35000, 50000, 18000],
  },
  {
    name: "实际支出",
    value: [5000, 14000, 28000, 26000, 42000, 21000],
  },
];

// 初始化图表
function initChart() {
  if (!chartRef.value) return;

  // 创建图表实例
  chartInstance = echarts.init(chartRef.value);

  // 更新图表配置
  updateChartOption();

  // 窗口大小变化时调整图表大小
  window.addEventListener("resize", resizeChart);
}

// 更新图表配置
function updateChartOption() {
  if (!chartInstance) return;

  // 使用传入的数据或默认数据
  const indicatorsData =
    props.indicators && props.indicators.length > 0
      ? props.indicators
      : defaultIndicators;

  const seriesData =
    props.data && props.data.length > 0 ? props.data : defaultData;

  // 图表配置
  const option = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      data: seriesData.map((item) => item.name),
    },
    color: props.colorPalette,
    radar: {
      shape: props.shape,
      indicator: indicatorsData,
    },
    series: [
      {
        name: props.title,
        type: "radar",
        data: seriesData,
        emphasis: {
          lineStyle: {
            width: 3,
          },
        },
      },
    ],
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
  window.removeEventListener("resize", resizeChart);
});

// 监听属性变化，更新图表
watch(
  () => [
    props.title,
    props.subtitle,
    props.shape,
    props.indicators,
    props.data,
    props.colorPalette,
  ],
  () => {
    updateChartOption();
  },
  { deep: true }
);
</script>

<style scoped>
.echarts-radar-widget {
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
