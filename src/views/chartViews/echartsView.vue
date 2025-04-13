<template>
  <div class="bg-[var(--material-bg-light)]">
    <div class="w-full h-fit p-6">
      <h1 class="text-xl font-semibold mb-6 text-white">Echarts 数据可视化</h1>
      <!-- 图表网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 平滑折线图卡片 -->
        <div class="chart-card">
          <div class="chart-header">
            <h2 class="text-lg">平滑折线图</h2>
          </div>
          <div class="chart-wrapper">
            <SmoothLineChart
              :xAxisData="barData.xAxis.data"
              :seriesData="barData.series[0].data"
              :customOptions="{
                tooltip: {
                  show: true,
                  trigger: 'axis',
                  confine: true,
                  z: 100,
                  backgroundColor: 'rgba(50,50,50,0.9)',
                  borderColor: '#666',
                  textStyle: {
                    color: '#fff',
                  },
                },
              }"
              themeColor="#4E9BFF"
              :darkMode="true"
            />
          </div>
        </div>

        <!-- 时间轴折线图卡片 -->
        <div class="chart-card">
          <div class="chart-header">
            <h2 class="text-lg">时间轴折线图</h2>
          </div>
          <div class="chart-wrapper">
            <TimeSeriesLineChart
              seriesName="趋势数据"
              :seriesData="timeSeriesData"
              themeColor="#6366f1"
              areaColor="rgba(99, 102, 241, 0.2)"
              :zoomRange="{ start: 10, end: 90 }"
              :darkMode="true"
              :customOptions="{
                tooltip: {
                  show: true,
                  trigger: 'axis',
                  confine: true,
                  z: 100,
                  backgroundColor: 'rgba(50,50,50,0.9)',
                  borderColor: '#666',
                  textStyle: {
                    color: '#fff',
                  },
                },
              }"
            />
          </div>
        </div>

        <!-- 基础饼图卡片 -->
        <div class="chart-card">
          <div class="chart-header">
            <h2 class="text-lg">基础饼图</h2>
          </div>
          <div class="chart-wrapper">
            <BasicPieChart
              title="访问来源"
              subtitle="流量分析"
              seriesName="访问来源"
              :pieData="pieData"
              :colorPalette="pieColors"
              legendPosition="right"
              :radius="'75%'"
              :customOptions="{
                series: [
                  {
                    center: ['50%', '55%'],
                  },
                ],
                tooltip: {
                  show: true,
                  trigger: 'item',
                  confine: true,
                  z: 100,
                  backgroundColor: 'rgba(50,50,50,0.9)',
                  borderColor: '#666',
                  textStyle: {
                    color: '#fff',
                  },
                },
              }"
            />
          </div>
        </div>

        <!-- 雷达图卡片 -->
        <div class="chart-card">
          <div class="chart-header">
            <h2 class="text-lg">能力雷达图</h2>
          </div>
          <div class="chart-wrapper">
            <RadarChart
              title="能力评估"
              seriesName="能力分布"
              :indicators="radarIndicators"
              :seriesData="radarData"
              :colorPalette="['#4E9BFF', '#FF7B92']"
              legendPosition="bottom"
              :customOptions="{
                tooltip: {
                  show: true,
                  trigger: 'item',
                  confine: true,
                  z: 100,
                  backgroundColor: 'rgba(50,50,50,0.9)',
                  borderColor: '#666',
                  textStyle: {
                    color: '#fff',
                  },
                },
                radar: {
                  radius: '60%',
                  center: ['50%', '45%'],
                },
                legend: {
                  bottom: '5%',
                  padding: [0, 0, 20, 0],
                  itemGap: 30,
                },
              }"
            />
          </div>
        </div>

        <!-- 联动折线饼图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h2 class="text-lg">联动折线饼图</h2>
          </div>
          <div class="chart-wrapper">
            <InteractivePieLineChart
              :pieData="productData"
              :lineData="timeSeriesData"
              :customOptions="{
                tooltip: {
                  show: true,
                  trigger: 'item',
                  confine: true,
                  z: 100,
                  backgroundColor: 'rgba(50,50,50,0.9)',
                  borderColor: '#666',
                  textStyle: {
                    color: '#fff',
                  },
                },
              }"
              :colorPalette="[
                '#6366f1',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
              ]"
              :darkMode="true"
            />
          </div>
        </div>

        <!-- 混合折柱图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h2 class="text-lg">混合折柱图</h2>
          </div>
          <div class="chart-wrapper">
            <MixBarLineChart
              title="气象数据统计"
              :xAxisData="[
                '周一',
                '周二',
                '周三',
                '周四',
                '周五',
                '周六',
                '周日',
              ]"
              :barData1="[20, 49, 70, 232, 256, 767, 1356]"
              :barData2="[26, 59, 90, 264, 287, 707, 1756]"
              :lineData="[20, 22, 33, 45, 63, 102, 203]"
              :seriesNames="['蒸发量', '降水量', '温度']"
              :yAxisNames="['水量', '温度']"
              :yAxisUnits="['ml', '°C']"
              :colorPalette="['#5470c6', '#91cc75', '#ee6666']"
              :customOptions="{
                grid: {
                  top: '80px',
                  bottom: '8%',
                  left: '3%',
                  right: '5%',
                  containLabel: true,
                },
                legend: {
                  top: '50px',
                },
                tooltip: {
                  show: true,
                  trigger: 'axis',
                  confine: true,
                  z: 100,
                  backgroundColor: 'rgba(50,50,50,0.9)',
                  borderColor: '#666',
                  textStyle: {
                    color: '#fff',
                  },
                },
              }"
            />
          </div>
        </div>

        <!-- 大数据面积图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h2 class="text-lg">大数据面积图</h2>
          </div>
          <div class="chart-wrapper">
            <AreaLineChart
              title="股票趋势"
              seriesName="股价"
              lineColor="#6366f1"
              :areaColors="[
                'rgba(99, 102, 241, 0.8)',
                'rgba(99, 102, 241, 0.1)',
              ]"
              :zoomRange="{ start: 0, end: 15 }"
              :customOptions="{
                tooltip: {
                  show: true,
                  trigger: 'axis',
                  confine: true,
                  z: 100,
                  backgroundColor: 'rgba(50,50,50,0.9)',
                  borderColor: '#666',
                  textStyle: {
                    color: '#fff',
                  },
                },
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SmoothLineChart from "@/components/charts/echarts/SmoothLineChart.vue";
import InteractivePieLineChart from "@/components/charts/echarts/InteractivePieLineChart.vue";
import TimeSeriesLineChart from "@/components/charts/echarts/TimeSeriesLineChart.vue";
import BasicPieChart from "@/components/charts/echarts/BasicPieChart.vue";
import RadarChart from "@/components/charts/echarts/RadarChart.vue";
import MixBarLineChart from "@/components/charts/echarts/MixBarLineChart.vue";
import AreaLineChart from "@/components/charts/echarts/AreaLineChart.vue";

// 饼图数据和颜色
const pieColors = ["#4E9BFF", "#FFC233", "#38BFFF", "#FF7B92", "#4DE6A8"];
const pieData = [
  { value: 1048, name: "搜索引擎" },
  { value: 735, name: "直接访问" },
  { value: 580, name: "邮件营销" },
  { value: 484, name: "联盟广告" },
  { value: 300, name: "视频广告" },
];

// 饼图配置
const pieOptions = {
  series: [
    {
      name: "访问来源",
      type: "pie",
      radius: "70%",
      data: pieData,
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

// 柱状图数据
const barData = {
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
    },
  ],
};

// 柱状图配置
const barOptions = {
  xAxis: {
    axisLabel: {
      rotate: 0,
    },
  },
};

// 雷达图数据
const radarIndicators = [
  { name: "技术能力", max: 100 },
  { name: "团队协作", max: 100 },
  { name: "问题解决", max: 100 },
  { name: "沟通能力", max: 100 },
  { name: "创新思维", max: 100 },
  { name: "项目管理", max: 100 },
];

const radarData = [
  {
    name: "个人评估",
    value: [80, 90, 85, 70, 75, 65],
  },
  {
    name: "团队平均",
    value: [70, 80, 75, 85, 65, 75],
  },
];

// 生成时间序列数据
const generateTimeData = () => {
  const data = [];
  const now = new Date();
  const oneDay = 24 * 3600 * 1000;
  let start = now.getTime() - 90 * oneDay;

  for (let i = 0; i < 90; i++) {
    let time = start + i * oneDay;
    // 添加季节性和随机波动
    const seasonal = Math.sin((i / 30) * Math.PI) * 100;
    const random = (Math.random() - 0.5) * 50;
    const trend = i * 0.5;
    const value = Math.max(0, Math.round(150 + trend + seasonal + random));

    data.push([time, value]);
  }

  return data;
};

// 联动折线图数据
const productData = ref([
  ["产品", "2020", "2021", "2022", "2023"],
  ["笔记本电脑", 156.5, 182.1, 188.7, 170.1],
  ["智能手机", 251.1, 251.4, 205.1, 253.3],
  ["平板电脑", 140.1, 162.2, 169.5, 136.4],
  ["智能手表", 85.2, 97.1, 141.2, 168.0],
]);

// 时间序列数据
const timeSeriesData = ref(generateTimeData());
</script>

<style scoped>
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

.legend-container {
  padding: 0 1.5rem;
  padding-top: 1rem;
}

.legend-color {
  border-radius: 3px;
}

.legend-label {
  color: #fff;
}
</style>
