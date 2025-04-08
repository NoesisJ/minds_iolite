<template>
  <div class="echarts-interactive-pie-line-widget">
    <div
      ref="chartRef"
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

  // 图表高度
  height: {
    type: String,
    default: "600px",
  },
  // 联动数据，需要是二维数组格式，如:
  // [['产品', '2020', '2021', '2022', '2023'],
  //  ['产品A', 43.3, 85.8, 93.7, 50.2],
  //  ['产品B', 83.1, 73.4, 55.1, 66.3]]
  chartData: {
    type: Array,
    default: () => [],
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
    color: props.colorPalette,
    legend: {
      top: '42%',
      left: 'center',
      textStyle: {
        color: '#ffffff'
      },
      show: true,
      orient: 'horizontal',
      data: data.slice(1).map(item => item[0]) // 从数据中提取图例项
    },
    tooltip: {
      trigger: "axis",
      showContent: false,
    },
    dataset: {
      source: data,
    },
    xAxis: { 
      type: "category",
      gridIndex: 0,
      axisLabel: {
        color: '#ffffff'
      }
    },
    yAxis: { 
      gridIndex: 0,
      axisLabel: {
        color: '#ffffff'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255, 255, 255, 0.2)'
        }
      }
    },
    grid: { 
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: '55%',
      containLabel: true
    },
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
        radius: '28%',
        center: ['50%', '25%'],
        emphasis: {
          focus: "self",
        },
        label: {
          formatter: "{b}: {c} ({d}%)",
          color: '#ffffff',
          show: true,
          position: 'outside',
          distanceToLabelLine: 5
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
          smooth: false
        },
        encode: {
          itemName: data[0][0],    // 使用数据中的第一列名称
          value: data[0][1],       // 默认使用第二列作为初始值
          tooltip: data[0][1]
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
    props.chartData,
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
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止内容溢出 */
}

.chart-container {
  width: 100%;
  flex: 1;
  min-height: 350px; /* 减小最小高度 */
  position: relative; /* 确保内容不会溢出 */
}

/* 暗色模式适配 */
:deep(.dark) .chart-title {
  color: #e5e7eb;
}

:deep(.dark) .chart-subtitle {
  color: #9ca3af;
}
</style>
