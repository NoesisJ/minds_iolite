<template>
  <div class="chartsGroup w-full flex-grow flex flex-col items-center overflow-auto">
    <div class="pieCharts w-full flex justify-around">
      <div
        class="chart"
        id="subjectChart"
        ref="subjectChart"
        :key="subjectKey"
      ></div>
      <div
        class="chart"
        id="campusChart"
        ref="campusChart"
        :key="campusKey"
      ></div>
    </div>
    <div class="barCharts w-full flex justify-around">
      <div class="chart" id="groupChart" ref="groupChart" :key="groupKey"></div>
      <div
        class="chart"
        id="divisionChart"
        ref="divisionChart"
        :key="divisionKey"
      ></div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted } from "vue";

// 定义数据和响应式变量
const subjectKey = ref(0);
const campusKey = ref(0);
const groupKey = ref(0);
const divisionKey = ref(0);

const chartData = ref({
  subjectData: [],
  campusData: [],
  groupData: { types: [], sums: [] },
  divisionData: { types: [], sums: [] },
});

// 模拟数据获取
const getData = () => {
  // 专业分布数据
  chartData.value.subjectData = [
    { value: 335, name: "Computer Science" },
    { value: 310, name: "Mechanical Engineering" },
    { value: 234, name: "Physics" },
  ];

  // 校区分布数据
  chartData.value.campusData = [
    { value: 500, name: "North Campus" },
    { value: 300, name: "South Campus" },
    { value: 200, name: "West Campus" },
  ];

  // 组别分布数据
  chartData.value.groupData.types = ["Group A", "Group B", "Group C"];
  chartData.value.groupData.sums = [120, 150, 180];

  // 兵种分布数据
  chartData.value.divisionData.types = [
    "Division 1",
    "Division 2",
    "Division 3",
  ];
  chartData.value.divisionData.sums = [75, 100, 125];
};

// 初始化图表
const initCharts = () => {
  const subjectChart = echarts.init(document.getElementById("subjectChart"));
  const campusChart = echarts.init(document.getElementById("campusChart"));
  const groupChart = echarts.init(document.getElementById("groupChart"));
  const divisionChart = echarts.init(document.getElementById("divisionChart"));

  // 专业分布图表配置
  subjectChart.setOption({
    title: {
      text: "专业分布",
      fontFamily: "Arial", // 字体
      fontSize: 20, // 字号
      fontWeight: "bold", // 字重
      color: "#ebebef", // 字体颜色
      left: "center",
    },
    tooltip: { trigger: "item", formatter: "{a} <br/>{b} : {c} ({d}%)" },
    series: [
      {
        name: "Subjects",
        type: "pie",
        radius: "58%",
        data: chartData.value.subjectData,
        label: {
          fontFamily: "Arial", // 数据标签的字体
          fontSize: 14, // 数据标签的字号
          fontWeight: "normal",
          color: "#ee82ee", // 数据标签的字体颜色
        },
      },
    ],
  });

  // 校区分布图表配置
  campusChart.setOption({
    title: {
      text: "校区分布",
      fontFamily: "Arial", // 字体
      fontSize: 20, // 字号
      fontWeight: "bold", // 字重
      color: "#ebebef", // 字体颜色
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    series: [
      {
        name: "Campuses",
        type: "pie",
        radius: "58%",
        data: chartData.value.campusData,
        label: {
          fontFamily: "Arial",
          fontSize: 14,
          fontWeight: "normal",
          color: "#ee82ee",
        },
      },
    ],
  });

  // 组别分布图表配置
  groupChart.setOption({
    title: {
      text: "组别分布",
      fontFamily: "Arial",
      fontSize: 20,
      fontWeight: "bold",
      color: "#ebebef",
    },
    xAxis: {
      data: chartData.value.groupData.types,
      axisLabel: {
        fontFamily: "Arial", // 横坐标文字的字体
        fontSize: 14, // 横坐标文字的字号
        color: "#fff", // 横坐标文字的颜色
      },
    },
    yAxis: {},
    series: [
      { name: "Members", type: "bar", data: chartData.value.groupData.sums },
    ],
  });

  // 兵种分布图表配置
  divisionChart.setOption({
    title: {
      text: "兵种分布",
      fontFamily: "Arial",
      fontSize: 20,
      fontWeight: "bold",
      color: "#ebebef",
    },
    xAxis: {
      data: chartData.value.divisionData.types,
      axisLabel: {
        fontFamily: "Arial", // 横坐标文字的字体
        fontSize: 14, // 横坐标文字的字号
        color: "#fff", // 横坐标文字的颜色
      },
    },
    yAxis: {},
    series: [
      { name: "Members", type: "bar", data: chartData.value.divisionData.sums },
    ],
  });
};

// 在组件挂载时初始化数据和图表
onMounted(() => {
  getData();
  initCharts();

  window.onresize = () => {
    echarts.getInstanceByDom(document.getElementById("subjectChart")).resize();
    echarts.getInstanceByDom(document.getElementById("campusChart")).resize();
    echarts.getInstanceByDom(document.getElementById("groupChart")).resize();
    echarts.getInstanceByDom(document.getElementById("divisionChart")).resize();
  };
});
</script>

<style scoped>
.chart {
  display: inline-block;
  width: 400px;
  height: 400px;
}
</style>
