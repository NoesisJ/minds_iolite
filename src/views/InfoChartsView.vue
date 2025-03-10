<template>
  <div
    class="chartsGroup w-full flex-grow flex flex-col items-center overflow-auto"
  >
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
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import type { EChartsOption, PieSeriesOption, BarSeriesOption } from "echarts";
import { dataApi } from "../api/data";

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
const chartInstances = ref<{ [key: string]: echarts.ECharts }>({});

// 基础配置
const baseChartConfig = {
  title: {
    fontFamily: "Arial",
    fontSize: 20,
    fontWeight: "bold",
    color: "#ebebef",
    left: "center",
    top: "10%",
  },
  tooltip: {
    trigger: "item" as const,
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
};

// 标签样式配置
const labelStyle = {
  show: true,
  fontFamily: "Arial",
  fontSize: 14,
  color: "#ee82ee",
};

// 坐标轴标签样式配置
const axisLabelStyle = {
  show: true,
  fontFamily: "Arial",
  fontSize: 14,
  color: "#fff",
};

// 生成饼图配置
const getPieOption = (title: string, data: ChartDataItem[]): EChartsOption => {
  const series: PieSeriesOption[] = [
    {
      name: title,
      type: "pie",
      radius: "55%",
      center: ["42%", "50%"],
      data: data,
      label: {
        ...labelStyle,
        formatter: "{b}: {d}%",
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ];

  return {
    title: {
      ...baseChartConfig.title,
      text: title,
    },
    tooltip: baseChartConfig.tooltip,
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 20, // 将图例靠右
      top: "center", // 垂直居中
      textStyle: {
        color: "#ebebef",
        fontSize: 14,
      },
      pageTextStyle: {
        color: "#ebebef",
      },
      data: data.map((item) => item.name),
    },
    series,
  };
};

// 生成柱状图配置
const getBarOption = (title: string, data: BarData): EChartsOption => {
  const series: BarSeriesOption[] = [
    {
      name: title,
      type: "bar",
      data: data.sums,
    },
  ];

  return {
    title: {
      ...baseChartConfig.title,
      text: title,
    },
    xAxis: [
      {
        type: "category",
        data: data.types,
        axisLabel: axisLabelStyle,
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: axisLabelStyle,
      },
    ],
    series,
  };
};



// 从后端获取数据并处理成图表所需格式
const getData = async () => {
  try {
    // 获取所有人员数据
    const allData = await dataApi.getAllData();
    
    // 处理专业(subjects)数据
    const subjectsMap = new Map<string, number>();
    allData.forEach(item => {
      if (item.subjects) {
        const count = subjectsMap.get(item.subjects) || 0;
        subjectsMap.set(item.subjects, count + 1);
      }
    });
    const subjectData: ChartDataItem[] = Array.from(subjectsMap.entries()).map(([name, value]) => ({
      value,
      name
    }));
    
    // 处理校区(school)数据 - 只统计前卫南区、南岭校区和南湖校区
    const targetCampuses = ['前卫南区', '南岭校区', '南湖校区'];
    const campusMap = new Map<string, number>();
    targetCampuses.forEach(campus => campusMap.set(campus, 0));
    
    allData.forEach(item => {
      if (item.school && targetCampuses.includes(item.school)) {
        const count = campusMap.get(item.school) || 0;
        campusMap.set(item.school, count + 1);
      }
    });
    const campusData: ChartDataItem[] = Array.from(campusMap.entries()).map(([name, value]) => ({
      value,
      name
    }));
    
    // 处理组别(jlugroup)数据
    const groupMap = new Map<string, number>();
    allData.forEach(item => {
      if (item.jlugroup) {
        const count = groupMap.get(item.jlugroup) || 0;
        groupMap.set(item.jlugroup, count + 1);
      }
    });
    const groupEntries = Array.from(groupMap.entries());
    const groupData: BarData = {
      types: groupEntries.map(([name]) => name),
      sums: groupEntries.map(([, value]) => value),
    };
    
    // 处理兵种(study)数据
    const branchMap = new Map<string, number>();
    allData.forEach(item => {
      if (item.study) {
        const count = branchMap.get(item.study) || 0;
        branchMap.set(item.study, count + 1);
      }
    });
    const branchEntries = Array.from(branchMap.entries());
    const divisionData: BarData = {
      types: branchEntries.map(([name]) => name),
      sums: branchEntries.map(([, value]) => value),
    };
    
    return {
      subjectData,
      campusData,
      groupData,
      divisionData,
    };
  } catch (error) {
    console.error('获取数据失败:', error);
    // 发生错误时返回空数据
    return {
      subjectData: [],
      campusData: [],
      groupData: { types: [], sums: [] },
      divisionData: { types: [], sums: [] },
    };
  }
};

// 处理窗口大小变化
const handleResize = () => {
  Object.values(chartInstances.value).forEach((chart) => {
    chart.resize();
  });
};

// 初始化所有图表
const initCharts = async () => {
  // 显示加载状态
  const loadingOptions = {
    text: '数据加载中...',
    color: '#ee82ee',
    textColor: '#fff',
    maskColor: 'rgba(0, 0, 0, 0.2)',
    zlevel: 0
  };
  
  // 先初始化图表实例
  const charts = {
    subject: subjectChartRef.value ? echarts.init(subjectChartRef.value) : null,
    campus: campusChartRef.value ? echarts.init(campusChartRef.value) : null,
    group: groupChartRef.value ? echarts.init(groupChartRef.value) : null,
    division: divisionChartRef.value ? echarts.init(divisionChartRef.value) : null
  };
  
  // 显示加载动画
  Object.values(charts).forEach(chart => chart?.showLoading(loadingOptions));
  
  try {
    // 获取数据
    const data = await getData();
    
    // 隐藏加载动画
    Object.values(charts).forEach(chart => chart?.hideLoading());
    
    // 设置图表数据
    if (charts.subject) {
      charts.subject.setOption(getPieOption("专业分布", data.subjectData));
      chartInstances.value["subject"] = charts.subject;
    }
    
    if (charts.campus) {
      charts.campus.setOption(getPieOption("校区分布", data.campusData));
      chartInstances.value["campus"] = charts.campus;
    }
    
    if (charts.group) {
      charts.group.setOption(getBarOption("组别分布", data.groupData));
      chartInstances.value["group"] = charts.group;
    }
    
    if (charts.division) {
      charts.division.setOption(getBarOption("兵种分布", data.divisionData));
      chartInstances.value["division"] = charts.division;
    }
  } catch (error) {
    console.error('初始化图表失败:', error);
    // 隐藏加载动画
    Object.values(charts).forEach(chart => chart?.hideLoading());
    
    // 显示错误信息
    Object.values(charts).forEach(chart => {
      if (chart) {
        chart.setOption({
          title: {
            text: '数据加载失败',
            left: 'center',
            top: 'center',
            textStyle: {
              color: '#ee82ee',
              fontSize: 20
            }
          }
        });
      }
    });
  }
};

onMounted(() => {
  initCharts();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  // 销毁图表实例
  Object.values(chartInstances.value).forEach((chart) => {
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
