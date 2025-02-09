<template>
  <div class="chartsGroup w-full flex-grow flex flex-col items-center overflow-auto">
    <div class="pieCharts w-full flex justify-around">
      <div class="chart" ref="subjectChartRef"></div>
      <div class="chart" ref="campusChartRef"></div>
    </div>
    <div class="barCharts w-full flex justify-around">
      <div class="chart" ref="groupChartRef"></div>
      <div class="chart" ref="divisionChartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import type { 
  EChartsOption, 
  PieSeriesOption, 
  BarSeriesOption,
} from 'echarts';

// 类型定义
interface ChartDataItem {
  value: number;
  name: string;
}

interface BarData {
  types: string[];
  sums: number[];
}

// 图表引用
const subjectChartRef = ref<HTMLElement | null>(null);
const campusChartRef = ref<HTMLElement | null>(null);
const groupChartRef = ref<HTMLElement | null>(null);
const divisionChartRef = ref<HTMLElement | null>(null);

// 存储图表实例
const chartInstances = ref<{[key: string]: echarts.ECharts}>({});

// 基础配置
const baseChartConfig = {
  title: {
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ebebef',
    left: 'center',
    top: '10%'
  },
  tooltip: {
    trigger: 'item' as const,
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  }
};

// 标签样式配置
const labelStyle = {
  show: true,
  fontFamily: 'Arial',
  fontSize: 14,
  color: '#ee82ee'
};

// 坐标轴标签样式配置
const axisLabelStyle = {
  show: true,
  fontFamily: 'Arial',
  fontSize: 14,
  color: '#fff'
};

// 生成饼图配置
const getPieOption = (title: string, data: ChartDataItem[]): EChartsOption => {
  const series: PieSeriesOption[] = [{
    name: title,
    type: 'pie',
    radius: '55%',
    center: ['42%', '50%'], 
    data: data,
    label: {
      ...labelStyle,
      formatter: '{b}: {d}%'
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }];

  return {
    title: {
      ...baseChartConfig.title,
      text: title
    },
    tooltip: baseChartConfig.tooltip,
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 20,       // 将图例靠右
      top: 'center',  // 垂直居中
      textStyle: {
        color: '#ebebef',
        fontSize: 14
      },
      pageTextStyle: {
        color: '#ebebef'
      },
      data: data.map(item => item.name)
    },
    series
  };
};


// 生成柱状图配置
const getBarOption = (title: string, data: BarData): EChartsOption => {
  const series: BarSeriesOption[] = [{
    name: title,
    type: 'bar',
    data: data.sums
  }];

  return {
    title: {
      ...baseChartConfig.title,
      text: title
    },
    xAxis: [{
      type: 'category',
      data: data.types,
      axisLabel: axisLabelStyle
    }],
    yAxis: [{
      type: 'value',
      axisLabel: axisLabelStyle
    }],
    series
  };
};

// 初始化图表
const initChart = (
  el: HTMLElement,
  option: EChartsOption,
  key: string
) => {
  const chart = echarts.init(el);
  chart.setOption(option);
  chartInstances.value[key] = chart;
  return chart;
};

// 模拟数据获取
const getData = () => {
  const subjectData: ChartDataItem[] = [
    { value: 335, name: 'Computer Science' },
    { value: 310, name: 'Mechanical Engineering' },
    { value: 234, name: 'Physics' }
  ];

  const campusData: ChartDataItem[] = [
    { value: 500, name: 'North Campus' },
    { value: 300, name: 'South Campus' },
    { value: 200, name: 'West Campus' }
  ];

  const groupData: BarData = {
    types: ['Group A', 'Group B', 'Group C'],
    sums: [120, 150, 180]
  };

  const divisionData: BarData = {
    types: ['Division 1', 'Division 2', 'Division 3'],
    sums: [75, 100, 125]
  };

  return {
    subjectData,
    campusData,
    groupData,
    divisionData
  };
};

// 处理窗口大小变化
const handleResize = () => {
  Object.values(chartInstances.value).forEach(chart => {
    chart.resize();
  });
};

// 初始化所有图表
const initCharts = () => {
  const data = getData();

  if (subjectChartRef.value) {
    initChart(
      subjectChartRef.value,
      getPieOption('专业分布', data.subjectData),
      'subject'
    );
  }

  if (campusChartRef.value) {
    initChart(
      campusChartRef.value,
      getPieOption('校区分布', data.campusData),
      'campus'
    );
  }

  if (groupChartRef.value) {
    initChart(
      groupChartRef.value,
      getBarOption('组别分布', data.groupData),
      'group'
    );
  }

  if (divisionChartRef.value) {
    initChart(
      divisionChartRef.value,
      getBarOption('兵种分布', data.divisionData),
      'division'
    );
  }
};


onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  // 销毁图表实例
  Object.values(chartInstances.value).forEach(chart => {
    chart.dispose();
  });
});
</script>

<style scoped>
.chart {
  display: inline-block;
  width: 50%;  
  height: 380px;
}
</style>