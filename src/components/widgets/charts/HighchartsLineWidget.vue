<template>
  <div class="highcharts-line-widget">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div v-if="subtitle" class="chart-subtitle">{{ subtitle }}</div>
    <div ref="chartRef" :style="{ height: height || '350px' }" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import Highcharts from 'highcharts';

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: '折线图示例'
  },
  // 图表副标题
  subtitle: {
    type: String,
    default: ''
  },
  // 图表高度
  height: {
    type: String,
    default: '350px'
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // Y轴标题
  yAxisTitle: {
    type: String,
    default: '数值'
  },
  // 图表数据
  data: {
    type: Array,
    default: () => []
  },
  // X轴数据
  xAxisData: {
    type: Array,
    default: () => []
  },
  // 起始点 - 用于数字X轴
  pointStart: {
    type: Number,
    default: 2010
  },
  // 颜色
  colorPalette: {
    type: Array,
    default: () => ['#4E9BFF', '#FF7B92', '#FFC233', '#38BFFF', '#4DE6A8']
  }
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
    return props.data.map(series => {
      // 确保data是数组
      const seriesData = Array.isArray(series.data) ? series.data : [];
      // 限制数据点数量，防止过多数据点导致卡顿
      const limitedData = seriesData.slice(0, 500);
      
      return {
        name: series.name || '未命名系列',
        data: limitedData
      };
    });
  } catch (error) {
    console.error('图表数据处理错误:', error);
    return defaultData.series;
  }
});

// 处理X轴数据
const categories = computed(() => {
  try {
    if (props.xAxisData && Array.isArray(props.xAxisData) && props.xAxisData.length > 0) {
      // 限制X轴标签数量
      return props.xAxisData.slice(0, 500);
    }
    return null; // 返回null将使用pointStart
  } catch (error) {
    console.error('X轴数据处理错误:', error);
    return null;
  }
});

// 示例数据 - 如果未传入数据则使用
const defaultData = {
  series: [
    {
      name: '安装与开发',
      data: [43934, 48656, 65165, 81827, 112143, 142383, 171533]
    },
    {
      name: '制造业',
      data: [24916, 37941, 29742, 29851, 32490, 30282, 38121]
    }
  ]
};

// 初始化图表，使用try-catch防止错误
function initChart() {
  if (!chartRef.value) return;
  
  try {
    // 创建图表实例
    chartInstance = Highcharts.chart(chartRef.value, getChartOptions());
    
    // 窗口大小变化时调整图表大小
    window.addEventListener('resize', resizeChart);
  } catch (error) {
    console.error('初始化图表失败:', error);
  }
}

// 获取图表配置
function getChartOptions() {
  // 暗模式检测
  const isDarkMode = document.documentElement.classList.contains('dark');
  const backgroundColor = isDarkMode ? 'transparent' : 'transparent';
  const textColor = isDarkMode ? '#e5e7eb' : '#333';
  const gridColor = isDarkMode ? '#4b5563' : '#e5e7eb';

  return {
    chart: {
      type: 'line',
      backgroundColor: backgroundColor,
      animation: false, // 禁用动画提高性能
      zoomType: 'x',    // 允许用户放大查看细节
      style: {
        fontFamily: 'Arial, sans-serif',
        color: textColor
      }
    },
    colors: props.colorPalette,
    title: {
      text: props.title,
      align: 'left',
      style: {
        color: textColor,
        fontWeight: 'bold'
      }
    },
    subtitle: {
      text: props.subtitle,
      align: 'left',
      style: {
        color: textColor
      }
    },
    yAxis: {
      title: {
        text: props.yAxisTitle,
        style: {
          color: textColor
        }
      },
      labels: {
        style: {
          color: textColor
        }
      },
      gridLineColor: gridColor
    },
    xAxis: {
      categories: categories.value,
      labels: {
        style: {
          color: textColor
        },
        // 如果有很多标签，只显示部分
        step: categories.value ? Math.max(1, Math.floor(categories.value.length / 20)) : 1
      }
    },
    legend: {
      enabled: props.showLegend,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        color: textColor
      }
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: props.pointStart,
        marker: {
          // 大数据集时，只在鼠标悬停时显示点标记
          enabled: processedData.value[0]?.data.length < 30
        }
      }
    },
    series: processedData.value,
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    },
    credits: {
      enabled: false
    },
    // 使用boost模块处理大量数据点
    boost: {
      useGPUTranslations: true,
      seriesThreshold: 1
    }
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
    console.error('调整图表大小失败:', error);
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
    window.removeEventListener('resize', resizeChart);
  } catch (error) {
    console.error('销毁图表失败:', error);
  }
});

// 监听属性变化，更新图表
watch(
  () => [
    props.title,
    props.subtitle,
    props.showLegend,
    props.yAxisTitle,
    props.colorPalette
  ],
  () => {
    try {
      if (chartInstance) {
        chartInstance.update(getChartOptions());
      }
    } catch (error) {
      console.error('更新图表失败:', error);
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
        console.error('更新图表数据失败:', error);
      }
    }, 200); // 200ms防抖延迟
  },
  { deep: true }
);
</script>

<style scoped>
.highcharts-line-widget {
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