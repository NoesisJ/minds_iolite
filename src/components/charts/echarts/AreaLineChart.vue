<!--
  AreaLineChart - 大数据面积图组件
  
  【数据修改】
  - :areaData - 面积图数据，可传入大量数据点
  - :xAxisData - X轴数据，如果不传则自动生成日期
  - seriesName - 数据系列名称，显示在tooltip和图例中

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'500px'
  - lineColor - 线条颜色，默认'rgb(255, 70, 131)'
  - :areaColors - 面积渐变颜色，格式为['开始颜色', '结束颜色']
  - :zoomRange - 数据缩放初始范围，如{start: 0, end: 10}
  - darkMode - 是否使用暗色主题，默认true
  - fontColor - 字体颜色，默认'#fff'
  - fontSize - 字体大小，默认12px
  - title - 图表标题
  - sampling - 大数据采样方式，可选'lttb'|'average'|'max'|'min'|'sum'，默认'lttb'

  【高级自定义】
  - :customOptions - 传入echarts配置对象，会与默认配置合并

  【使用示例】
  <AreaLineChart 
    height="400px"
    title="大数据面积图"
    seriesName="趋势数据"
    lineColor="#6366f1"
    :areaColors="['rgb(99, 102, 241, 0.8)', 'rgb(99, 102, 241, 0.1)']"
    :zoomRange="{ start: 0, end: 10 }"
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

const props = defineProps({
  chartId: {
    type: String,
    default: () => `area-chart-${Date.now()}`,
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
  // 面积图数据
  areaData: {
    type: Array as PropType<(number | [number, number])[]>,
    default: () => {
      // 生成示例数据
      let data = [];
      let baseValue = Math.random() * 300;
      for (let i = 0; i < 1000; i++) {
        baseValue = Math.max(10, baseValue + (Math.random() - 0.5) * 20);
        data.push(Math.round(baseValue));
      }
      return data;
    },
  },
  // X轴数据，可选
  xAxisData: {
    type: Array as PropType<string[]>,
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
    default: "rgb(255, 70, 131)",
  },
  // 面积渐变色
  areaColors: {
    type: Array as PropType<string[]>,
    default: () => ["rgb(255, 158, 68)", "rgb(255, 70, 131)"],
  },
  // 数据缩放范围
  zoomRange: {
    type: Object as PropType<{ start: number; end: number }>,
    default: () => ({ start: 0, end: 10 }),
  },
  // 采样方式
  sampling: {
    type: String as PropType<"lttb" | "average" | "max" | "min" | "sum">,
    default: "lttb",
    validator: (value: string) =>
      ["lttb", "average", "max", "min", "sum"].includes(value),
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
    default: "大数据面积图",
  },
  // 自定义配置
  customOptions: {
    type: Object,
    default: () => ({}),
  },
});

// 图表实例
let chartInstance: echarts.ECharts | null = null;

// 生成日期数据
const generateDateData = () => {
  if (props.xAxisData.length > 0) return props.xAxisData;

  let now = new Date();
  let oneDay = 24 * 3600 * 1000;
  let result = [];
  let base = now.getTime() - oneDay * props.areaData.length;

  for (let i = 0; i < props.areaData.length; i++) {
    let time = new Date(base + oneDay * i);
    result.push(
      [time.getFullYear(), time.getMonth() + 1, time.getDate()].join("/")
    );
  }

  return result;
};

// 配置对象
const chartOptions = computed((): EChartsOption => {
  // 处理数据
  const xAxisData = generateDateData();

  // 基础配置
  const baseOptions: EChartsOption = {
    backgroundColor: props.darkMode ? "#333" : "#fff",
    textStyle: {
      color: props.fontColor,
      fontSize: props.fontSize,
    },
    title: {
      text: props.title,
      left: "center",
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
        color: props.darkMode ? "#fff" : "#333",
        fontSize: props.fontSize,
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
      iconStyle: {
        borderColor: props.fontColor,
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxisData,
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
        handleIcon:
          "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        handleSize: "80%",
        handleStyle: {
          color: props.lineColor,
          shadowBlur: 3,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        textStyle: {
          color: props.fontColor,
        },
        borderColor: props.darkMode ? "#555" : "#ccc",
      },
    ],
    series: [
      {
        name: props.seriesName,
        type: "line",
        sampling: props.sampling,
        smooth: true,
        symbol: "none",
        itemStyle: {
          color: props.lineColor,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: props.areaColors[0],
            },
            {
              offset: 1,
              color: props.areaColors[1],
            },
          ]),
        },
        data: props.areaData,
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
    props.areaData,
    props.xAxisData,
    props.seriesName,
    props.lineColor,
    props.areaColors,
    props.zoomRange,
    props.sampling,
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
