<template>
  <div class="echarts-bar-widget">
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
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: "柱状图示例",
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
  // X轴类型: 'category'类别轴, 'value'数值轴, 'time'时间轴
  xAxisType: {
    type: String,
    default: "category",
  },
  // Y轴标题
  yAxisTitle: {
    type: String,
    default: "数值",
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true,
  },
  // 图表数据
  data: {
    type: Array,
    default: () => [],
  },
});

// 图表DOM引用
const chartRef = ref(null);
// 图表实例
let chartInstance = null;

// 示例数据 - 如果未传入数据则使用
const defaultData = {
  xAxisData: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  series: [
    {
      name: "销售额",
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "利润",
      data: [60, 72, 71, 74, 60, 130, 110],
    },
  ],
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

  let chartData;

  // 检查数据格式并进行适配
  if (props.data && props.data.length > 0) {
    // 检查数据格式：如果是简单数组，转换为需要的格式
    if (Array.isArray(props.data) && typeof props.data[0] !== 'object') {
      // 简单数组格式 [1, 2, 3, 4, 5]
      chartData = {
        xAxisData: Array.from({ length: props.data.length }, (_, i) => `项目${i+1}`),
        series: [{
          name: '数值',
          data: props.data
        }]
      };
    } 
    // 检查是否是series数组格式 [{name:'系列1',data:[...]}, {name:'系列2',data:[...]}]
    else if (Array.isArray(props.data) && props.data[0] && 'data' in props.data[0]) {
      chartData = {
        xAxisData: Array.from({ length: props.data[0].data.length }, (_, i) => `项目${i+1}`),
        series: props.data
      };
    }
    // 标准格式 {xAxisData: [...], series: [...]}
    else if (props.data.xAxisData || props.data.series) {
      chartData = props.data;
    }
    // 无法识别的格式，使用默认数据
    else {
      console.warn('无法识别的数据格式，使用默认数据', props.data);
      chartData = defaultData;
    }
  } else {
    // 没有数据，使用默认数据
    chartData = defaultData;
  }

  // 确保chartData.series存在
  if (!chartData.series || !Array.isArray(chartData.series)) {
    console.error("Chart data format error: series array is missing or invalid", chartData);
    // 使用默认数据
    chartData.series = defaultData.series;
  }

  // 确保chartData.xAxisData存在
  if (!chartData.xAxisData || !Array.isArray(chartData.xAxisData)) {
    console.error("Chart data format error: xAxisData array is missing or invalid", chartData);
    // 使用默认数据
    chartData.xAxisData = defaultData.xAxisData;
  }

  // 图表配置
  const option = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      show: props.showLegend,
      top: "bottom",
      data: chartData.series.map((item) => item.name),
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: props.subtitle ? "15%" : "10%",
      containLabel: true,
    },
    xAxis: {
      type: props.xAxisType,
      data: chartData.xAxisData,
    },
    yAxis: {
      type: "value",
      name: props.yAxisTitle,
    },
    series: chartData.series.map((item) => ({
      name: item.name,
      type: "bar",
      barWidth: "40%",
      data: item.data,
    })),
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
    props.showLegend,
    props.xAxisType,
    props.yAxisTitle,
    props.data,
  ],
  () => {
    updateChartOption();
  },
  { deep: true }
);
</script>

<style scoped>
.echarts-bar-widget {
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
