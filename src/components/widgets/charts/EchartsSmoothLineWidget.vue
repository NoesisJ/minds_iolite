<template>
  <div class="echarts-smooth-line-widget">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div v-if="subtitle" class="chart-subtitle">{{ subtitle }}</div>
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
  // 图表标题
  title: {
    type: String,
    default: "平滑折线图",
  },
  // 图表副标题
  subtitle: {
    type: String,
    default: "",
  },
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
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
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
    props.title,
    props.subtitle,
    props.xAxisData,
    props.seriesData,
    props.themeColor,
    props.showArea,
    props.areaColor,
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

.chart-title {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: #333;
  margin-bottom: 4px;
}

.chart-subtitle {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 8px;
}

.chart-container {
  width: 100%;
}

/* 暗色模式适配 */
:deep(.dark) .chart-title {
  color: #e5e7eb;
}

:deep(.dark) .chart-subtitle {
  color: #9ca3af;
}
</style>
