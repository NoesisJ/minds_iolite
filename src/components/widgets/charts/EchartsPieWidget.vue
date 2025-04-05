<template>
  <div class="echarts-pie-widget">
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
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { LabelLayout } from "echarts/features";

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: "饼图示例",
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
  // 饼图半径
  radius: {
    type: String,
    default: "50%",
  },
  // 图例位置: 'left', 'right', 'top', 'bottom'
  legendPosition: {
    type: String,
    default: "bottom",
  },
  // 饼图数据
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

// 示例数据 - 如果未传入数据则使用
const defaultData = [
  { value: 1048, name: "搜索引擎" },
  { value: 735, name: "直接访问" },
  { value: 580, name: "邮件营销" },
  { value: 484, name: "联盟广告" },
  { value: 300, name: "视频广告" },
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
  const chartData =
    props.data && props.data.length > 0 ? props.data : defaultData;

  // 确定图例方向
  const legendOrient =
    props.legendPosition === "left" || props.legendPosition === "right"
      ? "vertical"
      : "horizontal";

  // 图表配置
  const option = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: legendOrient,
      [props.legendPosition]: 10,
      data: chartData.map((item) => item.name),
    },
    color: props.colorPalette,
    series: [
      {
        name: props.title,
        type: "pie",
        radius: props.radius,
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
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
    props.radius,
    props.legendPosition,
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
.echarts-pie-widget {
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
