<template>
  <div :id="chartId" :style="{ width: '100%', height: '400px' }"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed, PropType } from "vue";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
]);

interface PieDataItem {
  value: number;
  name: string;
}

const props = defineProps({
  // 唯一ID
  chartId: {
    type: String,
    default: () => `pie-chart-${Math.random().toString(36).substring(2, 9)}`,
  },
  // 饼图数据 (必传)
  pieData: {
    type: Array as PropType<PieDataItem[]>,
    required: true,
    validator: (val: PieDataItem[]) => val.length > 0,
  },
  // 图表标题 (可选)
  title: {
    type: String,
    default: "数据分布",
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
    trigger: "item",
    formatter: "{b}: {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    textStyle: {
      color: "#fff",
    },
  },
  series: [
    {
      name: "数据分布",
      type: "pie",
      radius: "60%",
      data: props.pieData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      label: {
        color: "#fff",
        fontSize: 12,
      },
      itemStyle: {
        borderRadius: 5,
        borderColor: "#fff",
        borderWidth: 2,
      },
    },
  ],
  color: [
    "#4E9BFF",
    "#FFC233",
    "#38BFFF",
    "#FF7B92",
    "#4DE6A8",
    "#9A60B4",
    "#EA7CCC",
    "#FF9F7F",
    "#8378EA",
  ],
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
  () => [props.pieData, props.title],
  () => updateChart(),
  { deep: true }
);

// 暴露实例方法
defineExpose({
  getInstance: () => chartInstance,
  resize: () => handleResize(),
});
</script>
