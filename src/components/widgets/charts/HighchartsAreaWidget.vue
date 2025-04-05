<template>
  <div class="highcharts-area-widget">
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
    default: "面积图示例",
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
    default: true,
  },
  // 面积填充透明度
  fillOpacity: {
    type: Number,
    default: 0.5,
  },
  // 图表数据
  data: {
    type: Array,
    default: () => [],
  },
  // X轴数据
  xAxisData: {
    type: Array,
    default: () => [],
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
      return defaultData.series;
    }

    // 检查数据格式，防止格式错误导致页面卡死
    return props.data.map((series) => {
      // 确保data是数组
      const seriesData = Array.isArray(series.data) ? series.data : [];
      // 限制数据点数量，防止过多数据点导致卡顿
      const limitedData = seriesData.slice(0, 500);

      return {
        name: series.name || "未命名系列",
        data: limitedData,
      };
    });
  } catch (error) {
    console.error("图表数据处理错误:", error);
    return defaultData.series;
  }
});

// 处理X轴数据
const categories = computed(() => {
  try {
    if (
      props.xAxisData &&
      Array.isArray(props.xAxisData) &&
      props.xAxisData.length > 0
    ) {
      // 限制X轴标签数量
      return props.xAxisData.slice(0, 500);
    }
    return defaultData.categories;
  } catch (error) {
    console.error("X轴数据处理错误:", error);
    return defaultData.categories;
  }
});

// 示例数据 - 如果未传入数据则使用
const defaultData = {
  categories: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ],
  series: [
    {
      name: "产品A",
      data: [5, 7, 10, 13, 15, 18, 20, 23, 18, 15, 10, 7],
    },
    {
      name: "产品B",
      data: [3, 4, 6, 8, 13, 15, 17, 18, 15, 12, 9, 6],
    },
  ],
};

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
  return {
    chart: {
      type: "area",
      backgroundColor: "transparent",
      animation: false, // 禁用动画可以提高性能
      zoomType: "x", // 允许用户放大查看细节
      panning: true, // 启用平移
      panKey: "shift", // 按下shift键时可以平移
    },
    title: {
      text: props.title,
      style: {
        fontSize: "16px",
      },
    },
    subtitle: {
      text: props.subtitle,
      style: {
        fontSize: "14px",
      },
    },
    xAxis: {
      categories: categories.value,
      crosshair: true,
      labels: {
        // 如果有很多标签，只显示部分
        step: Math.max(1, Math.floor(categories.value.length / 20)),
      },
    },
    yAxis: {
      title: {
        text: "数值",
      },
    },
    tooltip: {
      shared: true,
      valueSuffix: " 单位",
    },
    plotOptions: {
      area: {
        fillOpacity: props.fillOpacity,
        marker: {
          radius: 4,
          lineWidth: 1,
          // 大数据集时，只在鼠标悬停时显示点标记
          enabled: processedData.value[0]?.data.length < 30,
        },
        // 优化大数据集的性能
        threshold: null,
      },
      series: {
        turboThreshold: 2000, // 增加阈值，但不要太大
      },
    },
    legend: {
      enabled: props.showLegend,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    series: processedData.value,
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
  () => [props.title, props.subtitle, props.showLegend, props.fillOpacity],
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
  () => [props.data, props.xAxisData],
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
.highcharts-area-widget {
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
