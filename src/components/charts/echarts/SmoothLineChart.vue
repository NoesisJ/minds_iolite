<!--
  SmoothLineChart - 平滑折线图组件
  
  【数据修改】
  - :xAxisData - 修改X轴数据，如['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  - :seriesData - 修改Y轴数据，如[820, 932, 901, 934, 1290, 1330, 1320]
  - :legendData - 添加图例数据（可选）

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'400px'
  - themeColor - 主题颜色，默认'#5470c6'
  - darkMode - 是否使用暗色主题，默认true
  - fontColor - 字体颜色，默认'#fff'
  - fontSize - 字体大小，默认12px
  - title - 图表标题

  【高级自定义】
  - :customOptions - 传入echarts配置对象，会与默认配置合并

  【使用示例】
  <SmoothLineChart 
    height="300px"
    title="每周访问量"
    :xAxisData="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
    :seriesData="[320, 532, 801, 934, 1290, 1330, 820]"
    themeColor="#6366f1"
  />
-->

<template>
  <div :id="chartId" :class="customClass" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed, PropType } from "vue";
import * as echarts from "echarts/core";
import { GridComponent, GridComponentOption } from "echarts/components";
import { LineChart, LineSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption
>;

// Define OrdinalRawValue type to match ECharts expectations
type OrdinalRawValue = string | number;

// Props 定义
const props = defineProps({
  // 图表ID，用于唯一标识图表容器
  chartId: {
    type: String,
    default: () => `smooth-line-chart-${Date.now()}`,
  },
  // 图表宽度
  width: {
    type: String,
    default: "100%",
  },
  // 图表高度
  height: {
    type: String,
    default: "400px",
  },
  // 自定义CSS类名
  customClass: {
    type: String,
    default: "",
  },
  // X轴数据
  xAxisData: {
    type: Array as PropType<OrdinalRawValue[]>,
    default: () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  // Y轴数据
  seriesData: {
    type: Array as PropType<(number | { value: number; [key: string]: any })[]>,
    default: () => [820, 932, 901, 934, 1290, 1330, 1320],
  },
  // 主题色
  themeColor: {
    type: String,
    default: "#5470c6",
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
    default: "",
  },
  // 图例
  legendData: {
    type: Array,
    default: () => [],
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
    title: props.title
      ? {
          text: props.title,
          left: "center",
          textStyle: {
            color: props.fontColor,
            fontSize: props.fontSize + 4,
          },
        }
      : undefined,
    legend:
      props.legendData.length > 0
        ? {
            data: props.legendData,
            textStyle: {
              color: props.fontColor,
              fontSize: props.fontSize,
            },
          }
        : undefined,
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: props.xAxisData,
      axisLabel: {
        color: props.fontColor,
        fontSize: props.fontSize,
      },
      axisLine: {
        lineStyle: {
          color: props.darkMode ? "#555" : "#ccc",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: props.fontColor,
        fontSize: props.fontSize,
      },
      axisLine: {
        lineStyle: {
          color: props.darkMode ? "#555" : "#ccc",
        },
      },
      splitLine: {
        lineStyle: {
          color: props.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
    },
    series: [
      {
        data: props.seriesData,
        type: "line",
        smooth: true,
        lineStyle: {
          color: props.themeColor,
          width: 3,
        },
        itemStyle: {
          color: props.themeColor,
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
    props.xAxisData,
    props.seriesData,
    props.themeColor,
    props.darkMode,
    props.fontSize,
    props.fontColor,
    props.title,
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
