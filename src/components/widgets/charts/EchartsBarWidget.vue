<template>
  <div class="echarts-bar-widget">
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

  try {
    let processedData = { xAxisData: [], series: [] };

    // 处理不同格式的数据
    if (props.data && props.data.length > 0) {
      // 检查数据格式
      if (Array.isArray(props.data[0]) || typeof props.data[0] === "number") {
        // 简单数组格式 [1, 2, 3, 4, 5]
        processedData = {
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
      } else if (
        props.data[0] &&
        typeof props.data[0] === "object" &&
        "name" in props.data[0] &&
        "data" in props.data[0]
      ) {
        // 系列数组格式 [{name: '系列1', data: [...]}, {name: '系列2', data: [...]}]
        const firstSeriesLength = props.data[0].data.length;
        processedData = {
          xAxisData: Array.from(
            { length: firstSeriesLength },
            (_, i) => `项目${i + 1}`
          ),
          series: props.data,
        };
      } else if (props.data.xAxisData && props.data.series) {
        // 标准对象格式 {xAxisData: [...], series: [...]}
        processedData = props.data;
      } else {
        console.warn("无法识别的数据格式，使用默认数据");
        processedData = defaultData;
      }
    } else {
      processedData = defaultData;
    }

    // 确保 xAxisData 和 series 都存在
    if (!processedData.xAxisData) {
      processedData.xAxisData = [];
    }

    if (!Array.isArray(processedData.series)) {
      processedData.series = [];
    }

    // 图表配置
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: "#364153",
        textStyle: {
          color: "#ffffff"
        },
        borderColor: "#555",
        borderWidth: 1
      },
      legend: {
        show: props.showLegend,
        top: "bottom",
        data: processedData.series.map((item) => item.name),
        textStyle: {
          color: "#ffffff"
        },
        backgroundColor: "#364153",
        padding: 10,
        borderRadius: 5
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
        data: processedData.xAxisData,
        axisLine: {
          lineStyle: {
            color: "#555"
          }
        },
        axisLabel: {
          color: "#ffffff"
        }
      },
      yAxis: {
        type: "value",
        name: props.yAxisTitle,
        nameTextStyle: {
          color: "#ffffff"
        },
        axisLine: {
          lineStyle: {
            color: "#555"
          }
        },
        axisLabel: {
          color: "#ffffff"
        },
        splitLine: {
          lineStyle: {
            color: "#333"
          }
        }
      },
      series: processedData.series.map((item) => ({
        name: item.name,
        type: "bar",
        barWidth: "40%",
        data: item.data,
      })),
    };

    // 设置图表配置
    chartInstance.setOption(option);
  } catch (error) {
    console.error("更新图表配置时出错:", error);
  }
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

.chart-container {
  width: 100%;
}
</style>
