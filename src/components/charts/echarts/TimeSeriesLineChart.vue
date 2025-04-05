<!--
  TimeSeriesLineChart - 时间轴折线图组件
  
  【数据修改】
  - :seriesData - 修改时间序列数据，格式为[[时间戳, 数值], [时间戳, 数值], ...]
  - seriesName - 数据系列名称，显示在tooltip和图例中

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'500px'
  - themeColor - 线条颜色，默认'#5470c6'
  - areaColor - 面积填充颜色，默认'rgba(84, 112, 198, 0.5)'
  - :zoomRange - 数据缩放初始范围，如{start: 0, end: 20}
  - darkMode - 是否使用暗色主题，默认true
  - fontColor - 字体颜色，默认'#fff'
  - fontSize - 字体大小，默认12px
  - title - 图表标题

  【高级自定义】
  - :customOptions - 传入echarts配置对象，会与默认配置合并

  【使用示例】
  <TimeSeriesLineChart 
    height="400px"
    title="两年股价走势"
    seriesName="股价"
    themeColor="#6366f1"
    areaColor="rgba(99, 102, 241, 0.3)"
    :zoomRange="{ start: 20, end: 70 }"
  />
-->

<template>
  <div :id="chartId" :class="customClass" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, PropType } from "vue";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  DataZoomComponent,
  DataZoomComponentOption,
} from "echarts/components";
import { LineChart, LineSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DataZoomComponentOption
  | LineSeriesOption
>;

// Define type for time series data point
type TimeSeriesDataPoint = [number, number]; // [timestamp, value]

const props = defineProps({
  chartId: {
    type: String,
    default: () => `time-series-chart-${Date.now()}`,
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
  // 时间序列数据
  seriesData: {
    type: Array as PropType<TimeSeriesDataPoint[]>,
    default: () => {
      let base = +new Date(1988, 9, 3);
      let oneDay = 24 * 3600 * 1000;
      let data: TimeSeriesDataPoint[] = [[base, Math.random() * 300]];

      for (let i = 1; i < 1000; i++) {
        let now = new Date((base += oneDay));
        data.push([
          +now,
          Math.round((Math.random() - 0.5) * 20 + data[i - 1][1]),
        ]);
      }

      return data;
    },
  },
  // 主题色
  themeColor: {
    type: String,
    default: "#5470c6",
  },
  // 面积图填充色
  areaColor: {
    type: String,
    default: "rgba(84, 112, 198, 0.5)",
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
    default: "时间序列数据",
  },
  // 系列名称
  seriesName: {
    type: String,
    default: "数据",
  },
  // 数据缩放初始范围
  zoomRange: {
    type: Object,
    default: () => ({
      start: 0,
      end: 20,
    }),
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
    title: {
      left: "center",
      text: props.title,
      textStyle: {
        color: props.fontColor,
        fontSize: props.fontSize + 4,
      },
    },
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], "10%"];
      },
      textStyle: {
        fontSize: props.fontSize,
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
          iconStyle: {
            borderColor: props.fontColor,
          },
          emphasis: {
            iconStyle: {
              borderColor: props.themeColor,
            },
          },
        },
        restore: {
          iconStyle: {
            borderColor: props.fontColor,
          },
          emphasis: {
            iconStyle: {
              borderColor: props.themeColor,
            },
          },
        },
        saveAsImage: {
          iconStyle: {
            borderColor: props.fontColor,
          },
          emphasis: {
            iconStyle: {
              borderColor: props.themeColor,
            },
          },
        },
      },
      right: "10%",
      top: "3%",
    },
    xAxis: {
      type: "time",
      boundaryGap: [0, 0],
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
        show: false,
      },
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"],
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
    dataZoom: [
      {
        type: "inside",
        start: props.zoomRange.start,
        end: props.zoomRange.end,
      },
      {
        start: props.zoomRange.start,
        end: props.zoomRange.end,
        textStyle: {
          color: props.fontColor,
        },
        borderColor: props.darkMode ? "#777" : "#ddd",
        dataBackground: {
          lineStyle: {
            color: props.themeColor,
            opacity: 0.5,
          },
          areaStyle: {
            color: props.areaColor,
            opacity: 0.2,
          },
        },
        fillerColor: props.areaColor,
        handleStyle: {
          color: props.themeColor,
          borderColor: props.themeColor,
        },
      },
    ],
    series: [
      {
        name: props.seriesName,
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: {
          color: props.themeColor,
          width: 2,
        },
        areaStyle: {
          color: props.areaColor,
        },
        data: props.seriesData,
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
    props.seriesData,
    props.themeColor,
    props.areaColor,
    props.darkMode,
    props.fontSize,
    props.fontColor,
    props.title,
    props.seriesName,
    props.zoomRange,
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
