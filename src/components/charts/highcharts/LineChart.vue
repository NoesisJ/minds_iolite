<!--
  LineChart - 聚点折线图组件
  
  【数据修改】
  - :seriesData - 系列数据，格式为[{name: '名称', data: [值1, 值2, ...]}, ...]
  - :categories - X轴分类，如果不设置则默认从 pointStart 开始的数字
  - :pointStart - 起始点，默认2010

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'400px'
  - :colors - 颜色数组，如['#4E9BFF', '#FF7B92', '#FFC233', '#38BFFF']
  - title - 标题文本
  - subtitle - 副标题文本
  - yAxisTitle - Y轴标题
  - legendLayout - 图例布局，可选'vertical'|'horizontal'，默认'vertical'
  - legendAlign - 图例水平对齐，可选'left'|'center'|'right'，默认'right'
  - legendVerticalAlign - 图例垂直对齐，可选'top'|'middle'|'bottom'，默认'middle'
  - darkMode - 是否启用暗色模式，默认true

  【高级自定义】
  - :customOptions - 传入highcharts配置对象，会与默认配置合并

  【使用示例】
  <LineChart 
    title="美国太阳能就业增长"
    subtitle="按职位类别划分"
    yAxisTitle="员工数量"
    height="400px"
    :seriesData="[
      {
        name: '安装与开发',
        data: [43934, 48656, 65165, 81827, 112143, 142383, 171533]
      },
      {
        name: '制造业',
        data: [24916, 37941, 29742, 29851, 32490, 30282, 38121]
      }
    ]"
    :pointStart="2010"
    :colors="['#4E9BFF', '#FF7B92', '#FFC233', '#38BFFF', '#4DE6A8']"
  />
-->

<template>
  <div :id="chartId" :class="customClass" :style="{ width, height }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import Highcharts from 'highcharts';

const props = defineProps({
  // 容器ID
  chartId: {
    type: String,
    default: () => `line-chart-${Date.now()}`
  },
  // 自定义类名
  customClass: {
    type: String,
    default: ''
  },
  // 宽度
  width: {
    type: String,
    default: '100%'
  },
  // 高度
  height: {
    type: String,
    default: '400px'
  },
  // 系列数据
  seriesData: {
    type: Array,
    default: () => [
      {
        name: '安装与开发',
        data: [43934, 48656, 65165, 81827, 112143, 142383, 171533]
      },
      {
        name: '制造业',
        data: [24916, 37941, 29742, 29851, 32490, 30282, 38121]
      }
    ]
  },
  // X轴分类
  categories: {
    type: Array,
    default: null
  },
  // 起始点
  pointStart: {
    type: Number,
    default: 2010
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 副标题
  subtitle: {
    type: String,
    default: ''
  },
  // Y轴标题
  yAxisTitle: {
    type: String,
    default: ''
  },
  // 图例布局
  legendLayout: {
    type: String,
    default: 'vertical' // 'vertical', 'horizontal'
  },
  // 图例水平对齐
  legendAlign: {
    type: String,
    default: 'right' // 'left', 'center', 'right'
  },
  // 图例垂直对齐
  legendVerticalAlign: {
    type: String,
    default: 'middle' // 'top', 'middle', 'bottom'
  },
  // 颜色
  colors: {
    type: Array,
    default: () => ['#4E9BFF', '#FF7B92', '#FFC233', '#38BFFF', '#4DE6A8']
  },
  // 暗色模式
  darkMode: {
    type: Boolean,
    default: true
  },
  // 自定义配置
  customOptions: {
    type: Object,
    default: () => ({})
  }
});

// 图表实例
let chartInstance = null;

// 图表配置
const chartOptions = computed(() => {
  // 主题色配置
  const colors = props.colors;

  // 背景色和文字色
  const backgroundColor = props.darkMode ? '#333' : '#fff';
  const textColor = props.darkMode ? '#fff' : '#333';
  const gridColor = props.darkMode ? '#444' : '#e6e6e6';

  // 基础配置
  const baseOptions = {
    chart: {
      backgroundColor: backgroundColor,
      style: {
        fontFamily: 'Arial, sans-serif',
        color: textColor
      }
    },
    colors: colors,
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
      categories: props.categories,
      labels: {
        style: {
          color: textColor
        }
      },
      accessibility: {
        rangeDescription: `Range: ${props.pointStart} to ${props.pointStart + Math.max(...props.seriesData.map(s => s.data.length)) - 1}`
      }
    },
    legend: {
      layout: props.legendLayout,
      align: props.legendAlign,
      verticalAlign: props.legendVerticalAlign,
      itemStyle: {
        color: textColor
      }
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: props.pointStart
      }
    },
    series: props.seriesData,
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
    }
  };

  // 合并自定义配置
  return { ...baseOptions, ...props.customOptions };
});

// 初始化图表
const initChart = () => {
  chartInstance = Highcharts.chart(props.chartId, chartOptions.value);
};

// 更新图表
const updateChart = () => {
  if (chartInstance) {
    chartInstance.update(chartOptions.value);
  } else {
    initChart();
  }
};

// 窗口大小变化时调整图表
const handleResize = () => {
  chartInstance?.reflow();
};

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  window.removeEventListener('resize', handleResize);
});

// 监听数据变化，更新图表
watch(
  () => [
    props.seriesData,
    props.categories,
    props.pointStart,
    props.colors,
    props.darkMode,
    props.title,
    props.subtitle,
    props.yAxisTitle,
    props.legendLayout,
    props.legendAlign,
    props.legendVerticalAlign,
    props.customOptions
  ],
  () => updateChart(),
  { deep: true }
);

// 对外暴露的方法
defineExpose({
  getChartInstance: () => chartInstance,
  updateOptions: (options) => {
    if (chartInstance) {
      chartInstance.update(options);
    }
  }
});
</script> 