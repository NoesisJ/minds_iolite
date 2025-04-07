<!--
  BasicPieChart - 基础饼图组件
  
  【数据修改】
  - :pieData - 饼图数据，格式为[{value: 数值, name: '名称'}, ...]
  - seriesName - 系列名称，显示在tooltip中

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'400px'
  - :colorPalette - 颜色数组，如['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
  - :radius - 饼图半径，默认'50%'
  - legendPosition - 图例位置，可选'left'|'right'|'top'|'bottom'，默认'left'
  - darkMode - 是否使用暗色主题，默认true
  - fontColor - 字体颜色，默认'#fff'
  - fontSize - 字体大小，默认12px
  - title - 图表标题
  - subtitle - 图表副标题

  【高级自定义】
  - :customOptions - 传入echarts配置对象，会与默认配置合并

  【使用示例】
  <BasicPieChart 
    height="350px"
    title="访问来源"
    subtitle="虚拟数据"
    seriesName="访问来源"
    :pieData="[
      { value: 1048, name: '搜索引擎' },
      { value: 735, name: '直接访问' },
      { value: 580, name: '邮件营销' },
      { value: 484, name: '联盟广告' },
      { value: 300, name: '视频广告' }
    ]"
    :colorPalette="['#4E9BFF', '#FFC233', '#38BFFF', '#FF7B92', '#4DE6A8']"
    legendPosition="right"
  />
-->

<template>
  <div :id="chartId" :class="customClass" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed, PropType } from "vue";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from "echarts/components";
import { PieChart, PieSeriesOption } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;

// 饼图数据项类型
interface PieDataItem {
  value: number;
  name: string;
}

const props = defineProps({
  chartId: {
    type: String,
    default: () => `basic-pie-chart-${Date.now()}`,
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "400px",
  },
  customClass: {
    type: String,
    default: "",
  },
  // 饼图数据
  pieData: {
    type: Array as PropType<PieDataItem[]>,
    default: () => [
      { value: 1048, name: "搜索引擎" },
      { value: 735, name: "直接访问" },
      { value: 580, name: "邮件营销" },
      { value: 484, name: "联盟广告" },
      { value: 300, name: "视频广告" },
    ],
  },
  // 系列名称
  seriesName: {
    type: String,
    default: "访问来源",
  },
  // 饼图半径
  radius: {
    type: String,
    default: "50%",
  },
  // 图例位置
  legendPosition: {
    type: String,
    default: "left",
    validator: (value: string) =>
      ["left", "right", "top", "bottom"].includes(value),
  },
  // 颜色调色板
  colorPalette: {
    type: Array as PropType<string[]>,
    default: () => ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de"],
  },
  // 是否启用暗色模式
  darkMode: {
    type: Boolean,
    default: true,
  },
  // 字体大小
  fontSize: {
    type: Number,
    default: 12,
  },
  // 字体颜色
  fontColor: {
    type: String,
    default: "#fff",
  },
  // 标题
  title: {
    type: String,
    default: "基础饼图",
  },
  // 副标题
  subtitle: {
    type: String,
    default: "",
  },
  // 自定义配置
  customOptions: {
    type: Object,
    default: () => ({}),
  },
});

// 图表实例
let chartInstance: echarts.ECharts | null = null;

// 配置对象
const chartOptions = computed((): EChartsOption => {
  // 基础配置
  const baseOptions: EChartsOption = {
    backgroundColor: props.darkMode ? "#333" : "#fff",
    textStyle: {
      color: props.fontColor,
      fontSize: props.fontSize,
    },
    color: props.colorPalette,
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "center",
      textStyle: {
        color: props.fontColor,
        fontSize: props.fontSize + 4,
      },
      subtextStyle: {
        color: props.darkMode
          ? "rgba(255, 255, 255, 0.7)"
          : "rgba(0, 0, 0, 0.7)",
        fontSize: props.fontSize,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      textStyle: {
        color: props.darkMode ? "#fff" : "#333",
        fontSize: props.fontSize,
      },
    },
    legend: {
      orient:
        props.legendPosition === "left" || props.legendPosition === "right"
          ? "vertical"
          : "horizontal",
      [props.legendPosition]: "5%",
      textStyle: {
        color: props.fontColor,
        fontSize: props.fontSize,
      },
    },
    series: [
      {
        name: props.seriesName,
        type: "pie",
        radius: props.radius,
        data: props.pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          color: props.fontColor,
          fontSize: props.fontSize,
        },
      },
    ],
  };

  // 合并自定义配置
  return echarts.util.merge(baseOptions, props.customOptions);
});

// 初始化图表
const initChart = () => {
  const chartDom = document.getElementById(props.chartId);
  if (!chartDom) return;

  chartInstance = echarts.init(chartDom, props.darkMode ? "dark" : "light");
  updateChart();
};

// 更新图表
const updateChart = () => {
  if (!chartInstance) return;
  chartInstance.setOption(chartOptions.value);
};

// 窗口大小变化时调整图表
const handleResize = () => {
  chartInstance?.resize();
};

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

// 组件卸载时销毁图表
onUnmounted(() => {
  chartInstance?.dispose();
  window.removeEventListener("resize", handleResize);
});

// 监听数据变化，更新图表
watch(
  () => [
    props.pieData,
    props.seriesName,
    props.radius,
    props.legendPosition,
    props.colorPalette,
    props.darkMode,
    props.fontSize,
    props.fontColor,
    props.title,
    props.subtitle,
    props.customOptions,
  ],
  () => updateChart(),
  { deep: true }
);

// 对外暴露的方法
defineExpose({
  getChartInstance: () => chartInstance,
  updateOptions: (options: any) => {
    chartInstance?.setOption(options);
  },
});
</script>
