<!--
  InteractivePieLineChart - 联动折线饼图组件
  
  【数据修改】
  - :chartData - 修改数据源，需传入二维数组，如:
    [
      ['产品', '2020', '2021', '2022', '2023'],
      ['笔记本电脑', 156.5, 182.1, 188.7, 170.1],
      ['智能手机', 251.1, 251.4, 205.1, 253.3], 
      ['平板电脑', 140.1, 162.2, 169.5, 136.4]
    ]

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'500px'
  - :pieConfig - 配置饼图位置和大小，如{radius: '40%', center: ['50%', '25%']}
  - :colorPalette - 配置颜色系列，如['#6366f1', '#10b981', '#f59e0b', '#ef4444']
  - darkMode - 是否使用暗色主题，默认true
  - fontColor - 字体颜色，默认'#fff'
  - fontSize - 字体大小，默认12px
  - title - 图表标题

  【高级自定义】
  - :customOptions - 传入echarts配置对象，会与默认配置合并

  【使用示例】
  <InteractivePieLineChart 
    height="450px"
    title="产品销售数据"
    :chartData="productData"
    :colorPalette="['#6366f1', '#10b981', '#f59e0b', '#ef4444']"
  />
-->

<template>
  <div :id="chartId" :class="customClass" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed, PropType } from "vue";
import * as echarts from "echarts/core";
import {
  DatasetComponent,
  DatasetComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
} from "echarts/components";
import {
  LineChart,
  LineSeriesOption,
  PieChart,
  PieSeriesOption,
} from "echarts/charts";
import { UniversalTransition, LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  UniversalTransition,
  LabelLayout,
]);

// Define a more specific type for the chart data
type ChartDataItem = (string | number)[];
type ChartDataSource = ChartDataItem[];

type EChartsOption = echarts.ComposeOption<
  | DatasetComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
  | PieSeriesOption
>;

const props = defineProps({
  chartId: {
    type: String,
    default: () => `interactive-chart-${Date.now()}`,
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "500px",
  },
  customClass: {
    type: String,
    default: "",
  },
  // 数据源
  chartData: {
    type: Array as PropType<ChartDataSource>,
    default: () => [
      ["product", "2012", "2013", "2014", "2015", "2016", "2017"],
      ["Milk Tea", 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
      ["Matcha Latte", 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
      ["Cheese Cocoa", 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
      ["Walnut Brownie", 25.2, 37.1, 41.2, 18, 33.9, 49.1],
    ],
  },
  // 饼图位置和大小
  pieConfig: {
    type: Object,
    default: () => ({
      radius: "30%",
      center: ["50%", "25%"],
    }),
  },
  // 主题色数组
  colorPalette: {
    type: Array,
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
    legend: {
      textStyle: {
        color: props.fontColor,
        fontSize: props.fontSize,
      },
    },
    tooltip: {
      trigger: "axis",
      showContent: false,
      textStyle: {
        color: props.darkMode ? "#fff" : "#333",
        fontSize: props.fontSize,
      },
    },
    dataset: {
      source: props.chartData,
    },
    xAxis: {
      type: "category",
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
      gridIndex: 0,
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
    grid: { top: "55%" },
    series: [
      {
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
      {
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
      {
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
      {
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
      {
        type: "pie",
        id: "pie",
        radius: props.pieConfig.radius,
        center: props.pieConfig.center,
        emphasis: {
          focus: "self",
        },
        label: {
          formatter: "{b}: {@2012} ({d}%)",
          color: props.fontColor,
          fontSize: props.fontSize,
        },
        encode: {
          itemName: "product",
          value: "2012",
          tooltip: "2012",
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

  // 设置updateAxisPointer事件
  chartInstance.on("updateAxisPointer", function (event: any) {
    const xAxisInfo = event.axesInfo[0];
    if (xAxisInfo) {
      const dimension = xAxisInfo.value + 1;
      chartInstance?.setOption<echarts.EChartsCoreOption>({
        series: {
          id: "pie",
          label: {
            formatter: "{b}: {@[" + dimension + "]} ({d}%)",
          },
          encode: {
            value: dimension,
            tooltip: dimension,
          },
        },
      });
    }
  });

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
    props.chartData,
    props.pieConfig,
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
