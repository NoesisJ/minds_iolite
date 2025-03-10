<template>
  <div
    class="h-full w-full flex flex-col items-center justify-center py-4 gap-4"
  >
    <div class="pieCharts w-full h-1/2 flex justify-around">
      <div class="w-[60%]" ref="subjectChartRef"></div>
      <div
        class="w-[40%] flex items-center justify-center"
        ref="campusChartRef"
      ></div>
    </div>
    <div class="barCharts w-full h-1/2 flex justify-around gap-4">
      <div class="w-[50%]" ref="groupChartRef"></div>
      <div class="w-[50%]" ref="divisionChartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import type { EChartsOption, PieSeriesOption, BarSeriesOption } from "echarts";
import { dataApi } from "../api/data";
import { DataItem } from "@/types/information";

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

// 莫奈风格配色方案
const monetColors = [
  "#8CB4D2", // 淡蓝色
  "#A6C9E2", // 浅蓝色
  "#D4C1E0", // 淡紫色
  "#BBD7E7", // 天蓝色
  "#AED2CD", // 青色
  "#C7DDE8", // 浅灰蓝色
  "#E0C8D3", // 浅粉色
  "#D8E8F2", // 极淡的蓝色
  "#C5DCDB", // 浅绿蓝色
  "#DBDFEA", // 淡蓝灰色
];

// 基础配置
const baseChartConfig = {
  backgroundColor: "#f8f8fa", // 使用应用的背景色
  title: {
    fontFamily: "'Noto Serif', serif", // 更典雅的字体
    fontSize: 18,
    fontWeight: "normal",
    color: "#114b79", // 莫奈风格的深蓝色
    left: "center",
    top: "5%",
  },
  tooltip: {
    trigger: "item" as const,
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderColor: "#b8d0df",
    borderWidth: 1,
    textStyle: {
      color: "#114b79",
    },
    shadowBlur: 15,
    shadowColor: "rgba(184, 208, 223, 0.2)",
  },
};

// 标签样式配置
const labelStyle = {
  show: true,
  fontFamily: "'Noto Sans', sans-serif",
  fontSize: 13,
  color: "#114b79", // 深蓝灰色
  formatter: "{b}: {d}%",
};

// 坐标轴标签样式配置
const axisLabelStyle = {
  show: true,
  fontFamily: "'Noto Sans', sans-serif",
  fontSize: 13,
  color: "#114b79", // 莫奈风格的深蓝色
};

// 生成饼图配置
const getPieOption = (title: string, data: ChartDataItem[]): EChartsOption => {
  const series: PieSeriesOption[] = [
    {
      name: title,
      type: "pie",
      radius: ["40%", "65%"], // 改为环形图
      center: ["42%", "55%"],
      data: data,
      label: labelStyle,
      labelLine: {
        smooth: true,
        lineStyle: {
          color: "#b8d0df", // 标签线颜色
          width: 1,
        },
      },
      itemStyle: {
        borderRadius: 4, // 饼图边缘圆角
        borderColor: "#f8f8fa",
        borderWidth: 2,
        shadowBlur: 8,
        shadowColor: "rgba(184, 208, 223, 0.3)",
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowColor: "rgba(184, 208, 223, 0.5)",
        },
        labelLine: {
          lineStyle: {
            width: 2,
          },
        },
      },
    },
  ];

  return {
    backgroundColor: baseChartConfig.backgroundColor,
    color: monetColors,
    title: {
      ...baseChartConfig.title,
      text: title,
    },
    tooltip: baseChartConfig.tooltip,
    legend: {
      type: "scroll",
      orient: "vertical",
      right: "5%",
      top: "center",
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 12,
      textStyle: {
        color: "#114b79",
        fontSize: 13,
        fontFamily: "'Noto Sans', sans-serif",
      },
      pageTextStyle: {
        color: "#6B8EAE",
      },
      pageIconColor: "#b8d0df",
      pageIconInactiveColor: "#D9E5EF",
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
      barWidth: "40%",
      itemStyle: {
        borderRadius: [4, 4, 0, 0], // 柱状图顶部圆角
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#8CB4D2" },
          { offset: 1, color: "#b8d0df" },
        ]),
        shadowBlur: 8,
        shadowColor: "rgba(184, 208, 223, 0.3)",
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#79A6C8" },
            { offset: 1, color: "#9BB8D0" },
          ]),
        },
      },
    },
  ];

  return {
    backgroundColor: baseChartConfig.backgroundColor,
    title: {
      ...baseChartConfig.title,
      text: title,
    },
    tooltip: {
      ...baseChartConfig.tooltip,
      formatter: "{b}: {c}",
    },
    grid: {
      left: "10%",
      right: "5%",
      bottom: "15%",
      top: "20%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: data.types,
        axisLabel: {
          ...axisLabelStyle,
          interval: 0,
          rotate: data.types.length > 6 ? 30 : 0,
        },
        axisLine: {
          lineStyle: {
            color: "#D9E5EF",
          },
        },
        axisTick: {
          alignWithLabel: true,
          lineStyle: {
            color: "#D9E5EF",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: axisLabelStyle,
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#E6EEF5",
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
    ],
    series,
  };
};

// 从后端获取数据并处理成图表所需格式
const getData = async () => {
  try {
    const allData = await dataApi.getAllData();

    const processData = <K extends keyof DataItem>(
      key: K,
      filter?: (item: DataItem) => boolean
    ) => {
      const map = new Map<string, number>();
      allData.forEach((item: DataItem) => {
        if (item[key] && (!filter || filter(item))) {
          const count = map.get(item[key] as string) || 0;
          map.set(item[key] as string, count + 1);
        }
      });
      return Array.from(map.entries()).map(([name, value]) => ({
        value,
        name,
      }));
    };

    const subjectData = processData("subjects");
    const campusData = processData("school", (item) =>
      ["前卫南区", "南岭校区", "南湖校区"].includes(item.school)
    );
    const groupData = processData("jlugroup");
    const divisionData = processData("study");

    return {
      subjectData,
      campusData,
      groupData: {
        types: groupData.map((item) => item.name),
        sums: groupData.map((item) => item.value),
      },
      divisionData: {
        types: divisionData.map((item) => item.name),
        sums: divisionData.map((item) => item.value),
      },
    };
  } catch (error) {
    console.error("获取数据失败:", error);
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
  Object.values(chartInstances.value).forEach((chart) => chart.resize());
};

// 初始化所有图表
const initCharts = async () => {
  // 显示加载状态
  const loadingOptions = {
    text: "数据加载中...",
    color: "#8CB4D2",
    textColor: "#6B8EAE",
    maskColor: "rgba(248, 248, 250, 0.85)",
    zlevel: 0,
    fontFamily: "'Noto Sans', sans-serif",
    fontSize: 14,
  };

  // 先初始化图表实例
  const charts = {
    subject: subjectChartRef.value ? echarts.init(subjectChartRef.value) : null,
    campus: campusChartRef.value ? echarts.init(campusChartRef.value) : null,
    group: groupChartRef.value ? echarts.init(groupChartRef.value) : null,
    division: divisionChartRef.value
      ? echarts.init(divisionChartRef.value)
      : null,
  };

  // 显示加载动画
  Object.values(charts).forEach((chart) => chart?.showLoading(loadingOptions));

  try {
    // 获取数据
    const data = await getData();

    // 隐藏加载动画
    Object.values(charts).forEach((chart) => chart?.hideLoading());

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
    console.error("初始化图表失败:", error);
    Object.values(charts).forEach((chart) => {
      if (chart) {
        chart.hideLoading();
        chart.setOption({
          backgroundColor: "#f8f8fa",
          title: {
            text: "数据加载失败",
            left: "center",
            top: "center",
            textStyle: {
              color: "#6B8EAE",
              fontSize: 16,
              fontFamily: "'Noto Sans', sans-serif",
            },
          },
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
  Object.values(chartInstances.value).forEach((chart) => chart.dispose());
});
</script>
