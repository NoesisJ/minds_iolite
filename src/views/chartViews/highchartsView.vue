<template>
  <div class="charts-container p-4">
    <h1 class="text-xl font-semibold mb-6 text-white">Highcharts 数据可视化</h1>

    <!-- 图表网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 聚点折线图卡片 -->
      <div class="chart-card">
        <div class="chart-header">
          <h2 class="text-lg">聚点折线图</h2>
        </div>
        <div class="chart-wrapper">
          <LineChart
            title="美国太阳能就业增长"
            subtitle="按职位类别划分"
            yAxisTitle="员工数量"
            :seriesData="employmentData"
            :pointStart="2010"
            :colors="['#4E9BFF', '#FF7B92', '#FFC233', '#38BFFF', '#4DE6A8']"
            legendLayout="vertical"
            legendAlign="right"
            legendVerticalAlign="middle"
            height="100%"
          />
        </div>
      </div>

      <!-- 突出饼图卡片 -->
      <div class="chart-card">
        <div class="chart-header">
          <h2 class="text-lg">突出饼图</h2>
        </div>
        <div class="chart-wrapper">
          <HighlightPieChart
            title="2022年3月浏览器市场份额"
            seriesName="市场份额"
            :data="browserData"
            tooltipFormat="{series.name}: <b>{point.percentage:.1f}%</b>"
            :colors="[
              '#4E9BFF',
              '#FFC233',
              '#38BFFF',
              '#FF7B92',
              '#4DE6A8',
              '#9B66FF',
            ]"
            :customOptions="{
              plotOptions: {
                pie: {
                  innerSize: '30%',
                  depth: 35,
                },
              },
            }"
            height="100%"
          />
        </div>
      </div>

      <!-- 条形图卡片 -->
      <div class="chart-card">
        <div class="chart-header">
          <h2 class="text-lg">条形图</h2>
        </div>
        <div class="chart-wrapper">
          <ColumnChart
            title="2021年世界最大城市"
            subtitle="数据来源: World Population Review"
            yAxisTitle="人口 (百万)"
            seriesName="人口"
            :data="cityData"
            tooltipFormat="2021年人口: <b>{point.y:.1f} 百万</b>"
            labelsSuffix="百万"
            :colorByPoint="true"
            :dataLabelsRotation="-45"
            :customOptions="{
              plotOptions: {
                series: {
                  pointWidth: 25,
                },
              },
            }"
            height="100%"
          />
        </div>
      </div>

      <!-- 折线面积图卡片 -->
      <div class="chart-card">
        <div class="chart-header">
          <h2 class="text-lg">折线面积图</h2>
        </div>
        <div class="chart-wrapper">
          <AreaSplineChart
            title="挪威驼鹿和鹿的狩猎数量"
            subtitle="2000 - 2024年数据统计"
            yAxisTitle="数量"
            :seriesData="huntingData"
            :pointStart="2000"
            :plotBands="[
              { from: 2020, to: 2023, color: 'rgba(68, 170, 213, .2)' },
            ]"
            :colors="['#4E9BFF', '#FF7B92']"
            :fillOpacity="0.5"
            legendLayout="vertical"
            legendAlign="left"
            legendVerticalAlign="top"
            height="100%"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LineChart from "@/components/charts/highcharts/LineChart.vue";
import HighlightPieChart from "@/components/charts/highcharts/HighlightPieChart.vue";
import ColumnChart from "@/components/charts/highcharts/ColumnChart.vue";
import AreaSplineChart from "@/components/charts/highcharts/AreaSplineChart.vue";

// 聚点折线图数据
const employmentData = [
  {
    name: "安装与开发",
    data: [
      43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
      161454, 154610, 168960, 171558,
    ],
  },
  {
    name: "制造业",
    data: [
      24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243,
      31050, 33099, 33473,
    ],
  },
  {
    name: "销售与分销",
    data: [
      11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213,
      25663, 28978, 30618,
    ],
  },
  {
    name: "运维",
    data: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      11164,
      11218,
      10077,
      12530,
      16585,
    ],
  },
  {
    name: "其他",
    data: [
      21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906, 10073,
      11471, 11648,
    ],
  },
];

// 饼图数据
const browserData = [
  {
    name: "Chrome",
    y: 74.77,
    sliced: true,
    selected: true,
  },
  {
    name: "Edge",
    y: 12.82,
  },
  {
    name: "Firefox",
    y: 4.63,
  },
  {
    name: "Safari",
    y: 2.44,
  },
  {
    name: "IE",
    y: 2.02,
  },
  {
    name: "其他",
    y: 3.28,
  },
];

// 条形图数据
const cityData = [
  ["东京", 37.33],
  ["德里", 31.18],
  ["上海", 27.79],
  ["圣保罗", 22.23],
  ["墨西哥城", 21.91],
  ["达卡", 21.74],
  ["开罗", 21.32],
  ["北京", 20.89],
  ["孟买", 20.67],
  ["大阪", 19.11],
];

// 狩猎数据
const huntingData = [
  {
    name: "驼鹿",
    data: [
      38000, 37300, 37892, 38564, 36770, 36026, 34978, 35657, 35620, 35971,
      36409, 36435, 34643, 34956, 33199, 31136, 30835, 31611, 30666, 30319,
      31766, 29278, 27487, 26007,
    ],
  },
  {
    name: "鹿",
    data: [
      22534, 23599, 24533, 25195, 25896, 27635, 29173, 32646, 35686, 37709,
      39143, 36829, 35031, 36202, 35140, 33718, 37773, 42556, 43820, 46445,
      50048, 52804, 49317, 52490,
    ],
  },
];
</script>

<style scoped>
.charts-container {
  background-color: #1a1a1a;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.chart-card {
  background-color: #333;
  border-radius: 0.5rem;
  padding: 0;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chart-header {
  background-color: #252525;
  color: #fff;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #444;
}

.chart-wrapper {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 420px;
}
</style>
