<template>
  <div :id="chartId" :style="{ width: '100%', height: '500px' }"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed, PropType } from "vue";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const props = defineProps({
  // 唯一ID，防止重复
  chartId: {
    type: String,
    default: () => `area-chart-${Math.random().toString(36).substring(2, 9)}`,
  },
  // 面积图数据 (必传)
  data: {
    type: Array as PropType<number[]>,
    required: true,
    validator: (val: number[]) => val.length > 0,
  },
  // X轴标签 (可选)
  xAxisLabels: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  // 图表标题 (可选)
  title: {
    type: String,
    default: "数据趋势图",
  },
});

const emit = defineEmits(["chart-mounted"]);

let chartInstance: echarts.ECharts | null = null;

// 自动生成X轴标签（如果未提供）
const generateXAxisLabels = () => {
  if (props.xAxisLabels.length > 0) return props.xAxisLabels;
  return props.data.map((_: number, i: number) => `第${i + 1}天`);
};

// 默认配置
const chartOptions = computed(() => ({
  title: {
    text: props.title,
    left: "center",
    textStyle: {
      fontSize: 16,
      color: "#fff",
    },
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: generateXAxisLabels(),
    axisLine: {
      lineStyle: {
        color: "#ccc",
      },
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        type: "dashed",
        color: "rgba(0,0,0,0.1)",
      },
    },
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 100,
    },
    {
      start: 0,
      end: 100,
    },
  ],
  series: [
    {
      name: "数据值",
      type: "line",
      smooth: true,
      symbol: "none",
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(58, 77, 233, 0.8)" },
          { offset: 1, color: "rgba(58, 77, 233, 0.1)" },
        ]),
      },
      lineStyle: {
        width: 2,
        color: "rgba(58, 77, 233, 1)",
      },
      emphasis: {
        focus: "series",
      },
      data: props.data,
    },
  ],
}));

// 初始化图表
const initChart = () => {
  const chartDom = document.getElementById(props.chartId);
  if (!chartDom) return;

  chartInstance = echarts.init(chartDom);
  updateChart();
  emit("chart-mounted", chartInstance);
};

// 更新图表
const updateChart = () => {
  if (!chartInstance) return;
  chartInstance.setOption(chartOptions.value);
};

// 响应式调整
const handleResize = () => {
  chartInstance?.resize();
};

// 生命周期
onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  chartInstance?.dispose();
});

// 监听数据变化
watch(
  () => [props.data, props.xAxisLabels, props.title],
  () => updateChart(),
  { deep: true }
);

// 暴露实例方法
defineExpose({
  getInstance: () => chartInstance,
  resize: () => handleResize(),
});
</script>
