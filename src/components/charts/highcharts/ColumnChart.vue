<!--
  ColumnChart - 条形图组件
  
  【数据修改】
  - :data - 条形图数据，格式为[['名称', 数值], ['名称', 数值], ...]
  - seriesName - 系列名称，显示在tooltip中

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'400px'
  - :colors - 颜色数组，如['#9b20d9', '#9215ac', '#861ec9', ...]
  - colorByPoint - 是否按点着色，默认true
  - title - 标题文本
  - subtitle - 副标题文本
  - yAxisTitle - Y轴标题
  - dataLabelsEnabled - 是否显示数据标签，默认true
  - dataLabelsRotation - 数据标签旋转角度，默认-90
  - tooltipFormat - 提示框格式，默认'{point.y:.1f}'
  - labelsSuffix - 标签后缀，如'万人'
  - darkMode - 是否启用暗色模式，默认true

  【高级自定义】
  - :customOptions - 传入highcharts配置对象，会与默认配置合并

  【使用示例】
  <ColumnChart 
    title="2021年世界最大城市"
    subtitle="数据来源: World Population Review"
    yAxisTitle="人口 (百万)"
    height="500px"
    seriesName="人口"
    :data="[
      ['东京', 37.33],
      ['德里', 31.18],
      ['上海', 27.79],
      ['圣保罗', 22.23],
      ['墨西哥城', 21.91]
    ]"
    tooltipFormat="2021年人口: <b>{point.y:.1f} 百万</b>"
    labelsSuffix="百万"
    :colorByPoint="true"
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
    default: () => `column-chart-${Date.now()}`
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
  // 数据
  data: {
    type: Array,
    default: () => [
      ['东京', 37.33],
      ['德里', 31.18],
      ['上海', 27.79],
      ['圣保罗', 22.23],
      ['墨西哥城', 21.91]
    ]
  },
  // 系列名称
  seriesName: {
    type: String,
    default: '数据'
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
  // 颜色
  colors: {
    type: Array,
    default: () => [
      '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
      '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
      '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
      '#03c69b', '#00f194'
    ]
  },
  // 按点着色
  colorByPoint: {
    type: Boolean,
    default: true
  },
  // 数据标签是否启用
  dataLabelsEnabled: {
    type: Boolean,
    default: true
  },
  // 数据标签旋转角度
  dataLabelsRotation: {
    type: Number,
    default: -90
  },
  // 提示框格式
  tooltipFormat: {
    type: String,
    default: '{point.y:.1f}'
  },
  // 标签后缀
  labelsSuffix: {
    type: String,
    default: ''
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
  // 背景色和文字色
  const backgroundColor = props.darkMode ? '#333' : '#fff';
  const textColor = props.darkMode ? '#fff' : '#333';
  const gridColor = props.darkMode ? '#444' : '#e6e6e6';

  // 基础配置
  const baseOptions = {
    chart: {
      type: 'column',
      backgroundColor: backgroundColor,
      style: {
        fontFamily: 'Arial, sans-serif',
        color: textColor
      }
    },
    title: {
      text: props.title,
      style: {
        color: textColor,
        fontWeight: 'bold'
      }
    },
    subtitle: {
      text: props.subtitle,
      style: {
        color: textColor
      }
    },
    xAxis: {
      type: 'category',
      labels: {
        autoRotation: [-45, -90],
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif',
          color: textColor
        }
      }
    },
    yAxis: {
      min: 0,
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
    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: props.tooltipFormat,
      backgroundColor: props.darkMode ? '#1a1a1a' : '#ffffff',
      style: {
        color: textColor
      }
    },
    series: [{
      name: props.seriesName,
      colors: props.colors,
      colorByPoint: props.colorByPoint,
      groupPadding: 0,
      data: props.data,
      dataLabels: {
        enabled: props.dataLabelsEnabled,
        rotation: props.dataLabelsRotation,
        color: '#FFFFFF',
        inside: true,
        verticalAlign: 'top',
        format: `{point.y:.1f}${props.labelsSuffix}`, // 格式化，带后缀
        y: 10, // 从顶部向下10像素
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    }],
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
    props.data,
    props.seriesName,
    props.colors,
    props.colorByPoint,
    props.darkMode,
    props.title,
    props.subtitle,
    props.yAxisTitle,
    props.dataLabelsEnabled,
    props.dataLabelsRotation,
    props.tooltipFormat,
    props.labelsSuffix,
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