<template>
  <div class="highcharts-column-widget">
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
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import Highcharts from "highcharts";

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: "条形图示例",
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
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: false,
  },
  // Y轴标题
  yAxisTitle: {
    type: String,
    default: "数值",
  },
  // 系列名称
  seriesName: {
    type: String,
    default: "数据",
  },
  // 图表数据 - 格式为[['名称', 数值], ['名称', 数值], ...]
  data: {
    type: Array,
    default: () => [],
  },
  // 是否按点着色
  colorByPoint: {
    type: Boolean,
    default: true,
  },
  // 数据标签是否启用
  dataLabelsEnabled: {
    type: Boolean,
    default: true,
  },
  // 数据标签旋转角度
  dataLabelsRotation: {
    type: Number,
    default: -90,
  },
  // 颜色
  colorPalette: {
    type: Array,
    default: () => [
      "#9b20d9",
      "#9215ac",
      "#861ec9",
      "#7a17e6",
      "#7010f9",
      "#691af3",
      "#6225ed",
      "#5b30e7",
      "#533be1",
      "#4c46db",
      "#4551d5",
      "#3e5ccf",
      "#3667c9",
      "#2f72c3",
      "#277dbd",
      "#1f88b7",
      "#1693b1",
      "#0a9eaa",
      "#03c69b",
      "#00f194",
    ],
  },
  // 提示框格式
  tooltipFormat: {
    type: String,
    default: "{point.y:.1f}",
  },
  // 标签后缀
  labelsSuffix: {
    type: String,
    default: "",
  },
});

// 图表DOM引用
const chartRef = ref(null);
// 图表实例
let chartInstance = null;

// 处理数据格式
const processedData = computed(() => {
  try {
    if (!props.data || !Array.isArray(props.data) || props.data.length === 0) {
      return defaultData;
    }

    // 检查数据格式，防止格式错误导致页面卡死
    const result = [];
    for (let i = 0; i < Math.min(props.data.length, 50); i++) {
      // 限制最多50个柱子
      const item = props.data[i];
      if (Array.isArray(item) && item.length >= 2) {
        result.push([String(item[0]), Number(item[1]) || 0]);
      }
    }

    return result.length > 0 ? result : defaultData;
  } catch (error) {
    console.error("图表数据处理错误:", error);
    return defaultData;
  }
});

// 示例数据 - 如果未传入数据则使用
const defaultData = [
  ["东京", 37.33],
  ["德里", 31.18],
  ["上海", 27.79],
  ["圣保罗", 22.23],
  ["墨西哥城", 21.91],
];

// 初始化图表，使用try-catch防止错误
function initChart() {
  if (!chartRef.value) return;

  try {
    // 创建图表实例
    chartInstance = Highcharts.chart(chartRef.value, getChartOptions());

    // 窗口大小变化时调整图表大小
    window.addEventListener("resize", resizeChart);
  } catch (error) {
    console.error("初始化图表失败:", error);
  }
}

// 获取图表配置
function getChartOptions() {
  // 暗模式检测
  const isDarkMode = document.documentElement.classList.contains("dark");
  const backgroundColor = isDarkMode ? "transparent" : "transparent";
  const textColor = isDarkMode ? "#e5e7eb" : "#333";
  const gridColor = isDarkMode ? "#4b5563" : "#e5e7eb";

  return {
    chart: {
      type: "column",
      backgroundColor: backgroundColor,
      animation: false, // 禁用动画提高性能
      style: {
        fontFamily: "Arial, sans-serif",
        color: textColor,
      },
    },
    title: {
      text: props.title,
      style: {
        color: textColor,
        fontWeight: "bold",
      },
    },
    subtitle: {
      text: props.subtitle,
      style: {
        color: textColor,
      },
    },
    xAxis: {
      type: "category",
      labels: {
        autoRotation: [-45, -90],
        style: {
          fontSize: "13px",
          fontFamily: "Verdana, sans-serif",
          color: textColor,
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: props.yAxisTitle,
        style: {
          color: textColor,
        },
      },
      labels: {
        style: {
          color: textColor,
        },
      },
      gridLineColor: gridColor,
    },
    legend: {
      enabled: props.showLegend,
      itemStyle: {
        color: textColor,
      },
    },
    tooltip: {
      pointFormat: props.tooltipFormat,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
      style: {
        color: textColor,
      },
    },
    plotOptions: {
      column: {
        borderRadius: 3,
        pointPadding: 0.2,
        groupPadding: 0.1,
      },
      series: {
        turboThreshold: 2000, // 增加阈值，但不要太大
      },
    },
    series: [
      {
        name: props.seriesName,
        colors: props.colorPalette,
        colorByPoint: props.colorByPoint,
        data: processedData.value,
        dataLabels: {
          enabled: props.dataLabelsEnabled,
          rotation: props.dataLabelsRotation,
          color: isDarkMode ? "#e5e7eb" : "#333",
          inside: true,
          verticalAlign: "top",
          format: `{point.y:.1f}${props.labelsSuffix}`, // 格式化，带后缀
          y: 10, // 从顶部向下10像素
          style: {
            fontSize: "13px",
            fontFamily: "Verdana, sans-serif",
            textOutline: "1px contrast", // 提高文字可见度
          },
        },
      },
    ],
    credits: {
      enabled: false,
    },
    // 使用boost模块处理大量数据点
    boost: {
      useGPUTranslations: true,
      seriesThreshold: 1,
    },
  };
}

// 调整图表大小
function resizeChart() {
  try {
    if (chartInstance) {
      // 使用requestAnimationFrame减少重绘频率
      requestAnimationFrame(() => {
        chartInstance.reflow();
      });
    }
  } catch (error) {
    console.error("调整图表大小失败:", error);
  }
}

// 组件挂载时初始化图表
onMounted(() => {
  // 使用setTimeout确保DOM已完全渲染
  setTimeout(() => {
    initChart();
  }, 0);
});

// 组件卸载时销毁图表
onUnmounted(() => {
  try {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    window.removeEventListener("resize", resizeChart);
  } catch (error) {
    console.error("销毁图表失败:", error);
  }
});

// 监听属性变化，更新图表
watch(
  () => [
    props.title,
    props.subtitle,
    props.showLegend,
    props.yAxisTitle,
    props.colorByPoint,
    props.dataLabelsEnabled,
    props.dataLabelsRotation,
    props.labelsSuffix,
    props.tooltipFormat,
    props.seriesName,
  ],
  () => {
    try {
      if (chartInstance) {
        chartInstance.update(getChartOptions());
      }
    } catch (error) {
      console.error("更新图表失败:", error);
    }
  }
);

// 单独监听数据变化，使用防抖处理
let updateTimeout = null;
watch(
  () => props.data,
  () => {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    updateTimeout = setTimeout(() => {
      try {
        if (chartInstance) {
          chartInstance.update(getChartOptions(), true, true);
        }
      } catch (error) {
        console.error("更新图表数据失败:", error);
      }
    }, 200); // 200ms防抖延迟
  },
  { deep: true }
);
</script>

<style scoped>
.highcharts-column-widget {
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
