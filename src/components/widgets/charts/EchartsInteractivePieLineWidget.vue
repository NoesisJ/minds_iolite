<template>
  <div class="echarts-interactive-pie-line-widget">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div v-if="subtitle" class="chart-subtitle">{{ subtitle }}</div>
    <div
      ref="chartRef"
      :style="{ height: height || '450px' }"
      class="chart-container"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts/core";
import { LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { UniversalTransition, LabelLayout } from "echarts/features";

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  UniversalTransition,
  LabelLayout,
]);

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: "饼图折线联动",
  },
  // 图表副标题
  subtitle: {
    type: String,
    default: "",
  },
  // 图表高度
  height: {
    type: String,
    default: "450px",
  },
  // 联动数据，需要是二维数组格式，如:
  // [['产品', '2020', '2021', '2022', '2023'],
  //  ['产品A', 43.3, 85.8, 93.7, 50.2],
  //  ['产品B', 83.1, 73.4, 55.1, 66.3]]
  chartData: {
    type: Array,
    default: () => [],
  },
  // 饼图配置
  pieConfig: {
    type: Object,
    default: () => ({
      radius: "30%",
      center: ["50%", "25%"],
    }),
  },
  // 颜色调色板
  colorPalette: {
    type: Array,
    default: () => ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de"],
  },
});

// 图表DOM引用
const chartRef = ref(null);
// 图表实例
let chartInstance = null;

// 示例数据 - 如果未传入数据则使用
const defaultData = [
  ["产品", "2018", "2019", "2020", "2021", "2022"],
  ["笔记本电脑", 56.5, 82.1, 88.7, 70.1, 53.4],
  ["智能手机", 51.1, 51.4, 55.1, 53.3, 73.8],
  ["平板电脑", 40.1, 62.2, 69.5, 36.4, 45.2],
  ["智能手表", 25.2, 37.1, 41.2, 18, 33.9],
];

// 初始化图表
function initChart() {
  if (!chartRef.value) return;

  // 创建图表实例
  chartInstance = echarts.init(chartRef.value);

  // 添加updateAxisPointer事件
  chartInstance.on("updateAxisPointer", function (event) {
    const xAxisInfo = event.axesInfo[0];
    if (xAxisInfo) {
      const dimension = xAxisInfo.value + 1;
      chartInstance.setOption({
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

  // 更新图表配置
  updateChartOption();

  // 窗口大小变化时调整图表大小
  window.addEventListener("resize", resizeChart);
}

// 更新图表配置
function updateChartOption() {
  if (!chartInstance) return;

  // 使用传入的数据或默认数据
  const data =
    props.chartData && props.chartData.length > 0
      ? props.chartData
      : defaultData;

  // 图表配置
  const option = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "center",
    },
    color: props.colorPalette,
    legend: {},
    tooltip: {
      trigger: "axis",
      showContent: false,
    },
    dataset: {
      source: data,
    },
    xAxis: { type: "category" },
    yAxis: { gridIndex: 0 },
    grid: { top: "55%" },
    series: [
      // 这里需要根据数据源动态创建折线系列
      ...Array(data.length - 1)
        .fill(null)
        .map(() => ({
          type: "line",
          smooth: true,
          seriesLayoutBy: "row",
          emphasis: { focus: "series" },
        })),
      {
        type: "pie",
        id: "pie",
        radius: props.pieConfig.radius,
        center: props.pieConfig.center,
        emphasis: {
          focus: "self",
        },
        label: {
          formatter: "{b}: {@2018} ({d}%)",
        },
        encode: {
          itemName: "product",
          value: "2018",
          tooltip: "2018",
        },
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
    props.chartData,
    props.pieConfig,
    props.colorPalette,
  ],
  () => {
    updateChartOption();
  },
  { deep: true }
);
</script>

<style scoped>
.echarts-interactive-pie-line-widget {
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
