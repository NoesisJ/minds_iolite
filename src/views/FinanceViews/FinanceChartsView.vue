<template>
  <div class="chartsGroup">
    <div ref="monthChartContainer" style="width: 50%; height: 100vh "></div>
    <div ref="pieChartContainer" style="width: 50%; height: 100vh"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const monthChartContainer = ref<HTMLDivElement | null>(null); // 第一个图表容器的引用
const pieChartContainer = ref<HTMLDivElement | null>(null); // 第二个图表容器的引用

onMounted(() => {
  // 第一个图表：折线图
  if (monthChartContainer.value) {
    const myChart = echarts.init(monthChartContainer.value); // 初始化 ECharts 实例

    const option = {
      legend: {
        top: '2%',          // 设置图例距顶部的距离
        left: 'center',    // 设置图例居中
        textStyle: {
        fontFamily: 'Arial',  // 设置字体
        fontSize: 14,         // 设置字体大小
        fontWeight: 'normal', // 设置字体粗细
        color: '#fff',        // 设置字体颜色
    },
      },
      tooltip: {
        trigger: "axis",
        showContent: false,
      },
      dataset: {
        source: [
          ["product", "2012", "2013", "2014", "2015", "2016", "2017"],
          ["软件", 56.5, 82.1, 88.7, 70.1, 53.4, 1],
          ["电控", 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
          ["视觉", 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
          ["AI", 251.2, 373.1, 4.2, 14, 33.9, 9.1],
          ["机械", 25.2, 37.1, 41.2, 18, 353.9, 49],
          ["运营", 5.2, 31.1, 41.2, 13, 33.9, 59.1],
        ],
      },
      xAxis: { type: "category" },
      yAxis: { gridIndex: 0 },
      // 设置曲线图的位置
      grid: { 
        top: "45%",
        bottom: "15%", 
        
      },
      series: [
        {
          type: "line",
          smooth: true,
          seriesLayoutBy: "row",
          emphasis: { focus: "series" },
        },
        {
          type: "line",
          smooth: true,
          seriesLayoutBy: "row",
          emphasis: { focus: "series" },
        },
        {
          type: "line",
          smooth: true,
          seriesLayoutBy: "row",
          emphasis: { focus: "series" },
        },
        {
          type: "line",
          smooth: true,
          seriesLayoutBy: "row",
          emphasis: { focus: "series" },
        },
        {
          type: "line",
          smooth: true,
          seriesLayoutBy: "row",
          emphasis: { focus: "series" },
        },
        {
          type: "line",
          smooth: true,
          seriesLayoutBy: "row",
          emphasis: { focus: "series" },
        },
        {
          type: "pie",
          id: "pie",
          radius: "25%",
          // 设置饼图的位置
          center: ["50%", "25%"],
          emphasis: { focus: "self" },
          label: {
            formatter: "{b}: {@2012} ({d}%)",
            // 以下设置字体样式
            fontFamily: "Arial",
            fontSize: 15,
            fontWeight: "normal",
            color: "#fff",
          },
          // 设置数据
          encode: {
            itemName: "product",
            value: "2012",
            tooltip: "2012",
          },
        },
      ],
    };

    // 绑定更新轴指针的事件
    myChart.on("updateAxisPointer", (event: any) => {
      const xAxisInfo = event.axesInfo[0];
      if (xAxisInfo) {
        const dimension = xAxisInfo.value + 1;
        myChart.setOption({
          series: {
            id: "pie",
            label: {
              formatter: `{b}: {@[${dimension}]} ({d}%)`,
            },
            encode: {
              value: dimension,
              tooltip: dimension,
            },
          },
        });
      }
    });

    // 设置图表配置
    myChart.setOption(option);
  }

  // 第二个图表：饼图
  if (pieChartContainer.value) {
    const myChart = echarts.init(pieChartContainer.value); // 初始化第二个图表的实例

    const option = {
      title: {
        text: "Referer of a Website",
        subtext: "Fake Data",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    // 设置图表配置
    myChart.setOption(option);
  }
});
</script>

<style scoped>
.chartsGroup {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
