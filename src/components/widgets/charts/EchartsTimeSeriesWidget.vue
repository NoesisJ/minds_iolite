<template>
  <div class="echarts-time-series-widget">
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
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { UniversalTransition } from "echarts/features";

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: "时间序列图",
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
  // 时间序列数据 [[timestamp, value], ...]
  seriesData: {
    type: Array,
    default: () => [],
  },
  // 系列名称
  seriesName: {
    type: String,
    default: "数据趋势",
  },
  // 线条颜色
  lineColor: {
    type: String,
    default: "#5470c6",
  },
  // 面积填充颜色
  areaColor: {
    type: String,
    default: "rgba(84, 112, 198, 0.3)",
  },
  // 是否显示数据缩放
  showZoom: {
    type: Boolean,
    default: true,
  },
  // 缩放范围
  zoomRange: {
    type: Object,
    default: () => ({ start: 0, end: 20 }),
  },
});

// 图表DOM引用
const chartRef = ref(null);
// 图表实例
let chartInstance = null;

// 生成示例时间序列数据
function generateDefaultData() {
  const data = [];
  let base = +new Date(2020, 0, 1);
  let oneDay = 24 * 3600 * 1000;
  let value = Math.random() * 1000;

  for (let i = 0; i < 365; i++) {
    const now = new Date((base += oneDay));
    value = value + Math.random() * 21 - 10;
    data.push([+now, Math.round(value)]);
  }

  return data;
}

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

  // 使用传入的数据或生成默认数据
  const data =
    props.seriesData && props.seriesData.length > 0
      ? props.seriesData
      : generateDefaultData();

  // 图表配置
  const option = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        const date = new Date(params[0].value[0]);
        return (
          date.getFullYear() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getDate() +
          " : " +
          params[0].value[1]
        );
      },
      axisPointer: {
        animation: false,
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "time",
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
      },
    },
    dataZoom: props.showZoom
      ? [
          {
            type: "inside",
            start: props.zoomRange.start,
            end: props.zoomRange.end,
          },
          {
            start: props.zoomRange.start,
            end: props.zoomRange.end,
          },
        ]
      : [],
    series: [
      {
        name: props.seriesName,
        type: "line",
        showSymbol: false,
        data: data,
        lineStyle: {
          color: props.lineColor,
          width: 2,
        },
        areaStyle: {
          color: props.areaColor,
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
    props.seriesData,
    props.seriesName,
    props.lineColor,
    props.areaColor,
    props.showZoom,
    props.zoomRange,
  ],
  () => {
    updateChartOption();
  },
  { deep: true }
);
</script>

<style scoped>
.echarts-time-series-widget {
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
