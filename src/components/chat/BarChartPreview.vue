<template>
  <div :id="chartId" :style="{ width: '100%', height: '400px' }"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed, PropType } from "vue";
import * as echarts from "echarts/core";
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

const props = defineProps({
  // 唯一ID
  chartId: {
    type: String,
    default: () => `bar-chart-${Math.random().toString(36).substring(2, 9)}`,
  },
  // X轴数据 (必传)
  xAxisData: {
    type: Array as PropType<string[]>,
    required: true,
    validator: (val: string[]) => val.length > 0,
  },
  // 柱状图数据 (必传，支持多组数据)
  barData: {
    type: Array as PropType<number[][]>,
    required: true,
    validator: (val: number[][]) =>
      val.length > 0 && val.every((arr) => arr.length === val[0].length),
  },
  // 系列名称 (可选)
  seriesNames: {
    type: Array as PropType<string[]>,
    default: () => ["数据系列1", "数据系列2"],
  },
  // 图表标题 (可选)
  title: {
    type: String,
    default: "柱状图分析",
  },
  // Y轴单位 (可选)
  yAxisUnit: {
    type: String,
    default: "",
  },
});

let chartInstance: echarts.ECharts | null = null;

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
    formatter: (params: any) => {
      let result = params[0].axisValue + "<br/>";
      params.forEach((item: any) => {
        result += `${item.marker} ${item.seriesName}: ${item.value}${props.yAxisUnit}<br/>`;
      });
      return result;
    },
  },
  legend: {
    data: props.seriesNames.slice(0, props.barData.length),
    bottom: 10,
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "15%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: props.xAxisData,
    axisLabel: {
      rotate: props.xAxisData.length > 6 ? 30 : 0,
    },
  },
  yAxis: {
    type: "value",
    name: props.yAxisUnit,
    nameTextStyle: {
      padding: [0, 0, 0, 30],
    },
  },
  series: props.barData.map((data: number[], index: number) => ({
    name: props.seriesNames[index] || `系列${index + 1}`,
    type: "bar",
    barWidth: "60%",
    data: data,
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  })),
  color: ["#4E9BFF", "#FF7B92", "#4DE6A8", "#FFC233", "#9A60B4", "#38BFFF"],
}));

// 初始化图表
const initChart = () => {
  const chartDom = document.getElementById(props.chartId);
  if (!chartDom) return;

  chartInstance = echarts.init(chartDom);
  updateChart();
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
  () => [props.xAxisData, props.barData, props.title, props.yAxisUnit],
  () => updateChart(),
  { deep: true }
);

// 暴露实例方法
defineExpose({
  getInstance: () => chartInstance,
  resize: () => handleResize(),
});
</script>
