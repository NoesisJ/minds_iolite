<template>
  <div class="echarts-smooth-line-widget">
    <div
      ref="chartRef"
      :style="{ height: height || '350px' }"
      class="chart-container"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { UniversalTransition } from "echarts/features";

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const props = defineProps({
  // 图表高度
  height: {
    type: String,
    default: "350px",
  },
  // X轴数据
  xAxisData: {
    type: Array,
    default: () => [],
  },
  // Y轴数据
  seriesData: {
    type: Array,
    default: () => [],
  },
  // 主题色
  themeColor: {
    type: String,
    default: "#5470c6",
  },
  // 是否显示面积填充
  showArea: {
    type: Boolean,
    default: false,
  },
  // 面积填充颜色（渐变起始色）
  areaColor: {
    type: String,
    default: "rgba(84, 112, 198, 0.2)",
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true,
  },
});

// 图表DOM引用
const chartRef = ref(null);
// 图表实例
let chartInstance = null;

// 示例数据 - 如果未传入数据则使用
const defaultData = {
  xAxisData: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  seriesData: [820, 932, 901, 934, 1290, 1330, 1320],
};

// 初始化图表
function initChart() {
  if (!chartRef.value) return;

  // 创建图表实例
  chartInstance = echarts.init(chartRef.value);

  // 更新图表配置
  updateChartOption();

  // 窗口大小变化时调整图表大小
  window.addEventListener("resize", resizeChart);
}

// 更新图表配置
function updateChartOption() {
  if (!chartInstance) return;

  // 使用传入的数据或默认数据
  const xData =
    props.xAxisData && props.xAxisData.length > 0
      ? props.xAxisData
      : defaultData.xAxisData;

  const yData =
    props.seriesData && props.seriesData.length > 0
      ? props.seriesData
      : defaultData.seriesData;

  // 图表配置
  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      show: props.showLegend,
      top: "bottom",
      data: ["Line 1"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xData,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Line 1",
        data: yData,
        type: "line",
        smooth: true,
        lineStyle: {
          color: props.themeColor,
          width: 3,
        },
        itemStyle: {
          color: props.themeColor,
        },
        areaStyle: props.showArea
          ? {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: props.themeColor,
                },
                {
                  offset: 1,
                  color: props.areaColor,
                },
              ]),
            }
          : undefined,
      },
    ],
  };

  // 设置图表配置
  chartInstance.setOption(option);
}

// 调整图表大小
function resizeChart() {
  if (chartInstance) {
    chartInstance.resize();
  }
}

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
});

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener("resize", resizeChart);
});

// 监听属性变化，更新图表
watch(
  () => [
    props.xAxisData,
    props.seriesData,
    props.themeColor,
    props.showArea,
    props.areaColor,
    props.showLegend,
  ],
  () => {
    updateChartOption();
  },
  { deep: true }
);
</script>

<style scoped>
.echarts-smooth-line-widget {
  width: 100%;
}

.chart-container {
  width: 100%;
}
</style>
