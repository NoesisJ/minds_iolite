<template>
  <div :id="chartId" :style="{ width: '100%', height: '400px' }"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed, PropType } from "vue";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import { RadarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

// 注册必要的组件
echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  RadarChart,
  CanvasRenderer,
]);

interface RadarIndicator {
  name: string;
  max: number;
}

interface RadarDataItem {
  name: string;
  value: number[];
}

const props = defineProps({
  // 唯一ID
  chartId: {
    type: String,
    default: () => `radar-chart-${Math.random().toString(36).substring(2, 9)}`,
  },
  // 雷达图指标 (必传)
  indicators: {
    type: Array as PropType<RadarIndicator[]>,
    required: true,
    validator: (val: RadarIndicator[]) => val.length >= 3, // 至少3个指标
  },
  // 雷达图数据 (必传)
  seriesData: {
    type: Array as PropType<RadarDataItem[]>,
    required: true,
    validator: (val: RadarDataItem[]): boolean => val.length > 0,
  },
  // 图表标题 (可选)
  title: {
    type: String,
    default: "雷达图分析",
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
    formatter: (params: any) => {
      const { seriesName, name, value } = params;
      let str = `${seriesName}<br/>${name}: `;
      props.indicators.forEach((ind: RadarIndicator, i) => {
        str += `<br/>${ind.name}: ${value[i]}`;
      });
      return str;
    },
  },
  legend: {
    data: props.seriesData.map((item: RadarDataItem) => item.name),
    bottom: 10,
  },
  radar: {
    shape: "polygon",
    indicator: props.indicators,
    splitArea: {
      areaStyle: {
        color: ["rgba(255, 255, 255, 0.5)", "rgba(0, 0, 0, 0.05)"],
      },
    },
    axisLine: {
      lineStyle: {
        color: "rgba(0, 0, 0, 0.2)",
      },
    },
    splitLine: {
      lineStyle: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
  series: [
    {
      name: "数据对比",
      type: "radar",
      data: props.seriesData,
      areaStyle: {
        opacity: 0.3,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 6,
    },
  ],
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
  () => [props.indicators, props.seriesData, props.title],
  () => updateChart(),
  { deep: true }
);

// 暴露实例方法
defineExpose({
  getInstance: () => chartInstance,
  resize: () => handleResize(),
});
</script>
