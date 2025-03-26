<!--
  HighlightPieChart - 突出饼图组件
  
  【数据修改】
  - :data - 饼图数据，格式为[{name: '名称', y: 数值, sliced: 是否突出, selected: 是否选中}, ...]
  - seriesName - 系列名称，显示在tooltip中

  【样式修改】
  - width - 图表宽度，默认'100%'
  - height - 图表高度，默认'400px'
  - :colors - 颜色数组，如['#4E9BFF', '#FFC233', '#38BFFF', '#FF7B92', '#4DE6A8']
  - title - 标题文本
  - allowPointSelect - 是否允许选择点，默认true
  - showInLegend - 是否显示图例，默认true
  - enableDataLabels - 是否显示数据标签，默认false
  - tooltipFormat - 提示框格式，默认'{series.name}: <b>{point.percentage:.1f}%</b>'
  - darkMode - 是否启用暗色模式，默认true

  【高级自定义】
  - :customOptions - 传入highcharts配置对象，会与默认配置合并

  【使用示例】
  <HighlightPieChart 
    title="2022年3月浏览器市场份额"
    seriesName="市场份额"
    height="350px"
    :data="[
      {
        name: 'Chrome',
        y: 74.77,
        sliced: true,
        selected: true
      },
      {
        name: 'Edge',
        y: 12.82
      },
      {
        name: 'Firefox',
        y: 4.63
      }
    ]"
    tooltipFormat="{series.name}: <b>{point.percentage:.1f}%</b>"
    :colors="['#4E9BFF', '#FFC233', '#38BFFF', '#FF7B92', '#4DE6A8']"
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
    default: () => `pie-chart-${Date.now()}`
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
      {
        name: 'Chrome',
        y: 74.77,
        sliced: true,
        selected: true
      },
      {
        name: 'Edge',
        y: 12.82
      },
      {
        name: 'Firefox',
        y: 4.63
      },
      {
        name: 'Safari',
        y: 2.44
      },
      {
        name: 'Internet Explorer',
        y: 2.02
      },
      {
        name: 'Other',
        y: 3.28
      }
    ]
  },
  // 系列名称
  seriesName: {
    type: String,
    default: '市场份额'
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 允许选择点
  allowPointSelect: {
    type: Boolean,
    default: true
  },
  // 显示图例
  showInLegend: {
    type: Boolean,
    default: true
  },
  // 启用数据标签
  enableDataLabels: {
    type: Boolean,
    default: false
  },
  // 提示框格式
  tooltipFormat: {
    type: String,
    default: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  // 颜色
  colors: {
    type: Array,
    default: () => ['#4E9BFF', '#FFC233', '#38BFFF', '#FF7B92', '#4DE6A8']
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

  // 基础配置
  const baseOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      backgroundColor: backgroundColor,
      style: {
        fontFamily: 'Arial, sans-serif',
        color: textColor
      }
    },
    colors: props.colors,
    title: {
      text: props.title,
      style: {
        color: textColor,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      pointFormat: props.tooltipFormat,
      backgroundColor: props.darkMode ? '#1a1a1a' : '#ffffff',
      style: {
        color: textColor
      }
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: props.allowPointSelect,
        cursor: 'pointer',
        dataLabels: {
          enabled: props.enableDataLabels,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: textColor
          }
        },
        showInLegend: props.showInLegend
      }
    },
    legend: {
      itemStyle: {
        color: textColor
      }
    },
    series: [{
      name: props.seriesName,
      colorByPoint: true,
      data: props.data
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
    props.darkMode,
    props.title,
    props.allowPointSelect,
    props.showInLegend,
    props.enableDataLabels,
    props.tooltipFormat,
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