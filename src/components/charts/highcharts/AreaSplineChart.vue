<!--
  AreaSplineChart - 折线面积图组件
  
  【数据修改】
  - :seriesData - 系列数据，格式为[{name: '名称', data: [值1, 值2, ...]}]
  - :pointStart - 起始点，如2000
  - :plotBands - X轴高亮区域，如[{from: 2020, to: 2023, color: 'rgba(68, 170, 213, .2)'}]

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'400px'
  - :colors - 颜色数组，如['#4E9BFF', '#FF7B92', '#FFC233', '#38BFFF']
  - title - 标题文本
  - subtitle - 副标题文本，可包含HTML
  - yAxisTitle - Y轴标题
  - fillOpacity - 面积透明度，默认0.5
  - darkMode - 是否启用暗色模式，默认true
  - legendLayout - 图例布局，可选'vertical'|'horizontal'，默认'vertical'
  - legendAlign - 图例水平对齐，可选'left'|'center'|'right'，默认'left'
  - legendVerticalAlign - 图例垂直对齐，可选'top'|'middle'|'bottom'，默认'top'

  【高级自定义】
  - :customOptions - 传入highcharts配置对象，会与默认配置合并

  【使用示例】
  <AreaSplineChart 
    title="挪威驼鹿和鹿的狩猎数量，2000 - 2024"
    subtitle="数据来源: <a href='https://www.ssb.no/' target='_blank'>SSB</a>"
    yAxisTitle="数量"
    :seriesData="[
      {
        name: '驼鹿',
        data: [38000, 37300, 37892, 38564, 36770, 36026, 34978]
      },
      {
        name: '鹿',
        data: [22534, 23599, 24533, 25195, 25896, 27635, 29173]
      }
    ]"
    :pointStart="2000"
    :plotBands="[{from: 2020, to: 2023, color: 'rgba(68, 170, 213, .2)'}]"
    :colors="['#4E9BFF', '#FF7B92']"
    legendLayout="vertical"
    legendAlign="left"
    legendVerticalAlign="top"
  />
-->
<template>
  <div :id="chartId" :class="customClass" :style="{ width, height }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import Highcharts from "highcharts";

const props = defineProps({
  // 基础属性
  width: { type: String, default: "100%" },
  height: { type: String, default: "400px" },
  customClass: { type: String, default: "" },

  // 数据属性
  seriesData: { type: Array, required: true },
  pointStart: { type: Number, default: null },
  plotBands: { type: Array, default: () => [] },

  // 样式属性
  colors: {
    type: Array,
    default: () => ["#4E9BFF", "#FF7B92", "#FFC233", "#38BFFF"],
  },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  yAxisTitle: { type: String, default: "" },
  fillOpacity: { type: Number, default: 0.5 },
  darkMode: { type: Boolean, default: true },
  legendLayout: { type: String, default: "vertical" },
  legendAlign: { type: String, default: "left" },
  legendVerticalAlign: { type: String, default: "top" },

  // 图例位置
  legendX: { type: Number, default: 120 },
  legendY: { type: Number, default: 70 },
  legendFloating: { type: Boolean, default: true },

  // 高级自定义
  customOptions: { type: Object, default: () => ({}) },
});

// 生成唯一ID
const chartId = ref(`area-spline-chart-${Math.floor(Math.random() * 10000)}`);
let chartInstance = null;

// 计算配置
const chartOptions = computed(() => {
  const darkTheme = props.darkMode
    ? {
        backgroundColor: "transparent",
        colors: props.colors,
        title: { style: { color: "#ffffff" } },
        subtitle: { style: { color: "#cccccc" } },
        legend: {
          itemStyle: { color: "#cccccc" },
          itemHoverStyle: { color: "#ffffff" },
        },
        xAxis: {
          labels: { style: { color: "#cccccc" } },
          lineColor: "#555555",
        },
        yAxis: {
          labels: { style: { color: "#cccccc" } },
          gridLineColor: "#555555",
          title: { style: { color: "#cccccc" } },
        },
      }
    : {};

  // 基础配置
  const options = {
    chart: {
      type: "areaspline",
      ...darkTheme,
    },
    title: {
      text: props.title,
    },
    subtitle: {
      text: props.subtitle,
    },
    legend: {
      layout: props.legendLayout,
      align: props.legendAlign,
      verticalAlign: props.legendVerticalAlign,
      x: props.legendX,
      y: props.legendY,
      floating: props.legendFloating,
      borderWidth: 1,
      backgroundColor: props.darkMode
        ? "rgba(0, 0, 0, 0.5)"
        : Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
    },
    xAxis: {
      plotBands: props.plotBands,
    },
    yAxis: {
      title: {
        text: props.yAxisTitle,
      },
    },
    tooltip: {
      shared: true,
      headerFormat: "<b>{point.x}</b><br>",
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        ...(props.pointStart ? { pointStart: props.pointStart } : {}),
      },
      areaspline: {
        fillOpacity: props.fillOpacity,
      },
    },
    series: props.seriesData,
    ...props.customOptions,
  };

  return options;
});

// 初始化图表
const initChart = () => {
  if (document.getElementById(chartId.value)) {
    chartInstance = Highcharts.chart(chartId.value, chartOptions.value);
  }
};

// 更新图表
const updateChart = () => {
  if (chartInstance) {
    chartInstance.update(chartOptions.value);
  } else {
    initChart();
  }
};

// 窗口大小变化时调整图表
const handleResize = () => {
  chartInstance?.reflow();
};

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  window.removeEventListener("resize", handleResize);
});

// 监听数据变化，更新图表
watch(
  () => [
    props.seriesData,
    props.pointStart,
    props.plotBands,
    props.colors,
    props.darkMode,
    props.title,
    props.subtitle,
    props.yAxisTitle,
    props.fillOpacity,
    props.legendLayout,
    props.legendAlign,
    props.legendVerticalAlign,
    props.legendX,
    props.legendY,
    props.legendFloating,
    props.customOptions,
  ],
  () => updateChart(),
  { deep: true }
);

// 对外暴露的方法
defineExpose({
  getChartInstance: () => chartInstance,
  updateOptions: (options) => {
    if (chartInstance) {
      chartInstance.update(options);
    }
  },
});
</script>
