<!--
  MixBarLineChart - 混合折柱图组件
  
  【数据修改】
  - :xAxisData - 修改X轴数据，如['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  - :barData1 - 第一组柱状图数据，如[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6]
  - :barData2 - 第二组柱状图数据，如[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6]
  - :lineData - 折线图数据，如[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3]
  - :seriesNames - 数据系列名称，如['蒸发量', '降水量', '温度']
  - :yAxisNames - Y轴名称，如['降水量', '温度']
  - :yAxisUnits - Y轴单位，如['ml', '°C']

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'400px'
  - :colorPalette - 颜色数组，如['#5470c6', '#91cc75', '#ee6666']
  - darkMode - 是否使用暗色主题，默认true
  - fontColor - 字体颜色，默认'#fff'
  - fontSize - 字体大小，默认12px
  - title - 图表标题

  【高级自定义】
  - :customOptions - 传入echarts配置对象，会与默认配置合并

  【使用示例】
  <MixBarLineChart 
    height="400px"
    title="气象数据统计"
    :xAxisData="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
    :barData1="[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6]"
    :barData2="[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6]"
    :lineData="[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3]"
    :seriesNames="['蒸发量', '降水量', '温度']"
    :yAxisNames="['降水量', '温度']"
    :yAxisUnits="['ml', '°C']"
    :colorPalette="['#5470c6', '#91cc75', '#ee6666']"
    :darkMode="true"
  />
-->

<template>
  <div :id="chartId" :class="customClass" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, PropType } from "vue";
import * as echarts from "echarts/core";
import {
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
} from "echarts/components";
import {
  BarChart,
  BarSeriesOption,
  LineChart,
  LineSeriesOption,
} from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

type EChartsOption = echarts.ComposeOption<
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | BarSeriesOption
  | LineSeriesOption
>;

// Define OrdinalRawValue type to match ECharts expectations
type OrdinalRawValue = string | number;

const props = defineProps({
  chartId: {
    type: String,
    default: () => `mix-bar-line-chart-${Date.now()}`,
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
  // X轴数据
  xAxisData: {
    type: Array as PropType<OrdinalRawValue[]>,
    default: () => ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  // 柱状图数据1
  barData1: {
    type: Array as PropType<number[]>,
    default: () => [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
  },
  // 柱状图数据2
  barData2: {
    type: Array as PropType<number[]>,
    default: () => [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6],
  },
  // 折线图数据
  lineData: {
    type: Array as PropType<number[]>,
    default: () => [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3],
  },
  // 系列名称
  seriesNames: {
    type: Array as PropType<string[]>,
    default: () => ["蒸发量", "降水量", "温度"],
  },
  // Y轴名称
  yAxisNames: {
    type: Array as PropType<string[]>,
    default: () => ["降水量", "温度"],
  },
  // Y轴单位
  yAxisUnits: {
    type: Array as PropType<string[]>,
    default: () => ["ml", "°C"],
  },
  // 颜色调色板
  colorPalette: {
    type: Array as PropType<string[]>,
    default: () => ["#5470c6", "#91cc75", "#ee6666"],
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
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: props.darkMode ? "#999" : "#333",
        },
      },
      textStyle: {
        color: props.darkMode ? "#fff" : "#333",
        fontSize: props.fontSize,
      },
    },
    toolbox: {
      feature: {
        dataView: {
          show: true,
          readOnly: false,
        },
        magicType: {
          show: true,
          type: ["line", "bar"],
        },
        restore: {
          show: true,
        },
        saveAsImage: {
          show: true,
        },
      },
      iconStyle: {
        borderColor: props.fontColor,
      },
    },
    legend: {
      data: props.seriesNames,
      textStyle: {
        color: props.fontColor,
        fontSize: props.fontSize,
      },
    },
    grid: {
      left: "3%",
      right: "5%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: props.xAxisData,
        axisPointer: {
          type: "shadow",
        },
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
    ],
    yAxis: [
      {
        type: "value",
        name: props.yAxisNames[0],
        axisLabel: {
          formatter: `{value} ${props.yAxisUnits[0]}`,
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
      {
        type: "value",
        name: props.yAxisNames[1],
        axisLabel: {
          formatter: `{value} ${props.yAxisUnits[1]}`,
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
    ],
    series: [
      {
        name: props.seriesNames[0],
        type: "bar",
        data: props.barData1,
        tooltip: {
          valueFormatter: function (value) {
            return value + " " + props.yAxisUnits[0];
          },
        },
      },
      {
        name: props.seriesNames[1],
        type: "bar",
        data: props.barData2,
        tooltip: {
          valueFormatter: function (value) {
            return value + " " + props.yAxisUnits[0];
          },
        },
      },
      {
        name: props.seriesNames[2],
        type: "line",
        yAxisIndex: 1,
        data: props.lineData,
        tooltip: {
          valueFormatter: function (value) {
            return value + " " + props.yAxisUnits[1];
          },
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
    props.barData1,
    props.barData2,
    props.lineData,
    props.seriesNames,
    props.yAxisNames,
    props.yAxisUnits,
    props.colorPalette,
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
