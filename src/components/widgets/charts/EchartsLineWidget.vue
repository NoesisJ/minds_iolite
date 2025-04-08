<template>
  <div class="echarts-line-widget">
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

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

const props = defineProps({

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
  // 是否平滑曲线
  smooth: {
    type: Boolean,
    default: true,
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
      name: "访问量",
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
    {
      name: "点击量",
      data: [420, 532, 501, 534, 690, 730, 820],
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
    if (Array.isArray(props.data) && typeof props.data[0] !== "object") {
      // 简单数组格式 [1, 2, 3, 4, 5]
      chartData = {
        xAxisData: Array.from(
          { length: props.data.length },
          (_, i) => `项目${i + 1}`
        ),
        series: [
          {
            name: "数值",
            data: props.data,
          },
        ],
      };
    }
    // 检查是否是series数组格式 [{name:'系列1',data:[...]}, {name:'系列2',data:[...]}]
    else if (
      Array.isArray(props.data) &&
      props.data[0] &&
      "data" in props.data[0]
    ) {
      chartData = {
        xAxisData: Array.from(
          { length: props.data[0].data.length },
          (_, i) => `项目${i + 1}`
        ),
        series: props.data,
      };
    }
    // 标准格式 {xAxisData: [...], series: [...]}
    else if (props.data.xAxisData || props.data.series) {
      chartData = props.data;
    }
    // 无法识别的格式，使用默认数据
    else {
      console.warn("无法识别的数据格式，使用默认数据", props.data);
      chartData = defaultData;
    }
  } else {
    // 没有数据，使用默认数据
    chartData = defaultData;
  }

  // 确保chartData.series存在
  if (!chartData.series || !Array.isArray(chartData.series)) {
    console.error(
      "Chart data format error: series array is missing or invalid",
      chartData
    );
    // 使用默认数据
    chartData.series = defaultData.series;
  }

  // 确保chartData.xAxisData存在
  if (!chartData.xAxisData || !Array.isArray(chartData.xAxisData)) {
    console.error(
      "Chart data format error: xAxisData array is missing or invalid",
      chartData
    );
    // 使用默认数据
    chartData.xAxisData = defaultData.xAxisData;
  }

  // 图表配置
  const option = {
    tooltip: {
      trigger: "axis",
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
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: props.xAxisType,
      data: chartData.xAxisData,
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
      name: props.yAxisTitle,
    },
    series: chartData.series.map((item) => ({
      name: item.name,
      type: "line",
      smooth: props.smooth,
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
    props.smooth,
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
.echarts-line-widget {
  width: 100%;
}

.chart-container {
  width: 100%;
}
</style>
