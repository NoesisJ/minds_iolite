<!--
  RadarChart - 雷达图组件
  
  【数据修改】
  - :indicators - 雷达图指标，格式为[{name: '指标名', max: 最大值}, ...]
  - :seriesData - 雷达图数据，格式为[{name: '名称', value: [值1, 值2, ...]}, ...]

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'400px'
  - :colorPalette - 颜色数组，如['#5470c6', '#91cc75', '#fac858']
  - shape - 雷达图形状，可选'polygon'|'circle'，默认'polygon'
  - darkMode - 是否使用暗色主题，默认true
  - fontColor - 字体颜色，默认'#fff'
  - fontSize - 字体大小，默认12px
  - title - 图表标题
  - seriesName - 系列名称，显示在tooltip和图例中

  【高级自定义】
  - :customOptions - 传入echarts配置对象，会与默认配置合并

  【使用示例】
  <RadarChart 
    height="380px"
    title="预算分配与实际支出"
    seriesName="预算 vs 支出"
    :indicators="[
      { name: '销售', max: 6500 },
      { name: '管理', max: 16000 },
      { name: '信息技术', max: 30000 },
      { name: '客户支持', max: 38000 },
      { name: '研发', max: 52000 },
      { name: '市场营销', max: 25000 }
    ]"
    :seriesData="[
      { name: '预算分配', value: [4200, 3000, 20000, 35000, 50000, 18000] },
      { name: '实际支出', value: [5000, 14000, 28000, 26000, 42000, 21000] }
    ]"
    :colorPalette="['#4E9BFF', '#FF7B92']"
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
  LegendComponent,
  LegendComponentOption,
  TooltipComponent,
  TooltipComponentOption,
} from "echarts/components";
import {
  RadarChart as EChartsRadarChart,
  RadarSeriesOption,
} from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  EChartsRadarChart,
  CanvasRenderer,
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | RadarSeriesOption
>;

// 雷达图指标类型
interface RadarIndicator {
  name: string;
  max: number;
}

// 雷达图数据项类型
interface RadarDataItem {
  name: string;
  value: number[];
}

const props = defineProps({
  chartId: {
    type: String,
    default: () => `radar-chart-${Date.now()}`,
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
  // 雷达图指标
  indicators: {
    type: Array as PropType<RadarIndicator[]>,
    default: () => [
      { name: "销售", max: 6500 },
      { name: "管理", max: 16000 },
      { name: "信息技术", max: 30000 },
      { name: "客户支持", max: 38000 },
      { name: "研发", max: 52000 },
      { name: "市场营销", max: 25000 },
    ],
  },
  // 雷达图数据
  seriesData: {
    type: Array as PropType<RadarDataItem[]>,
    default: () => [
      {
        value: [4200, 3000, 20000, 35000, 50000, 18000],
        name: "预算分配",
      },
      {
        value: [5000, 14000, 28000, 26000, 42000, 21000],
        name: "实际支出",
      },
    ],
  },
  // 图形形状
  shape: {
    type: String,
    default: "polygon",
    validator: (value: string) => ["polygon", "circle"].includes(value),
  },
  // 颜色调色板
  colorPalette: {
    type: Array as PropType<string[]>,
    default: () => ["#5470c6", "#91cc75", "#fac858"],
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
    default: "基础雷达图",
  },
  // 系列名称
  seriesName: {
    type: String,
    default: "预算 vs 支出",
  },
  // 自定义配置
  customOptions: {
    type: Object,
    default: () => ({}),
  },
});

// 图表实例
let chartInstance: echarts.ECharts | null = null;

// 从seriesData提取图例数据
const legendData = computed(() => {
  return props.seriesData.map((item) => item.name);
});

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
      left: "center",
      textStyle: {
        color: props.fontColor,
        fontSize: props.fontSize + 4,
      },
    },
    tooltip: {
      trigger: "item",
      textStyle: {
        color: props.darkMode ? "#fff" : "#333",
        fontSize: props.fontSize,
      },
    },
    legend: {
      data: legendData.value,
      bottom: "5%",
      textStyle: {
        color: props.fontColor,
        fontSize: props.fontSize,
      },
    },
    radar: {
      shape: props.shape,
      indicator: props.indicators,
      splitArea: {
        areaStyle: {
          color: props.darkMode
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
        },
      },
      axisLine: {
        lineStyle: {
          color: props.darkMode
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(0, 0, 0, 0.2)",
        },
      },
      splitLine: {
        lineStyle: {
          color: props.darkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      },
      name: {
        textStyle: {
          color: props.fontColor,
          fontSize: props.fontSize,
        },
      },
    },
    series: [
      {
        name: props.seriesName,
        type: "radar",
        data: props.seriesData,
        emphasis: {
          lineStyle: {
            width: 3,
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
    props.indicators,
    props.seriesData,
    props.shape,
    props.colorPalette,
    props.darkMode,
    props.fontSize,
    props.fontColor,
    props.title,
    props.seriesName,
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
