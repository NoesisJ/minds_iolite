<template>
  <div class="charts-demo p-4">
    <h1 class="text-2xl font-bold mb-6">ECharts 组件演示</h1>
    
    <!-- 折线图 -->
    <div class="chart-card mb-8">
      <h2 class="text-xl mb-2">平滑折线图</h2>
      <SmoothLineChart 
        height="300px"
        title="每周访问量"
        :xAxisData="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
        :seriesData="[320, 532, 801, 934, 1290, 1330, 820]"
        themeColor="#6366f1"
      />
    </div>
    
    <!-- 联动图表 -->
    <div class="chart-card mb-8">
      <h2 class="text-xl mb-2">联动折线图</h2>
      <InteractivePieLineChart 
        height="450px"
        title="产品销售数据"
        :chartData="productData"
        :colorPalette="['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']"
      />
    </div>
    
    <!-- 时间序列图 -->
    <div class="chart-card">
      <h2 class="text-xl mb-2">时间轴折线图</h2>
      <TimeSeriesLineChart 
        height="400px"
        title="两年股价走势"
        seriesName="股价"
        themeColor="#6366f1"
        areaColor="rgba(99, 102, 241, 0.3)"
        :seriesData="stockData"
        :zoomRange="{ start: 20, end: 70 }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SmoothLineChart from '@/components/charts/SmoothLineChart.vue';
import InteractivePieLineChart from '@/components/charts/InteractivePieLineChart.vue';
import TimeSeriesLineChart from '@/components/charts/TimeSeriesLineChart.vue';

// 示例数据 - 产品销售
const productData = ref([
  ['产品', '2020', '2021', '2022', '2023'],
  ['笔记本电脑', 156.5, 182.1, 188.7, 170.1],
  ['智能手机', 251.1, 251.4, 205.1, 253.3],
  ['平板电脑', 140.1, 162.2, 169.5, 136.4],
  ['智能手表', 85.2, 97.1, 141.2, 168.0]
]);

// 生成股票数据
const generateStockData = () => {
  let base = +new Date(2021, 0, 1);
  let oneDay = 24 * 3600 * 1000;
  let data = [[base, 50]];
  
  for (let i = 1; i < 730; i++) {
    let now = new Date(base += oneDay);
    let change = (Math.random() - 0.5) * 5;
    // 添加一些趋势和周期性
    let trend = Math.sin(i / 100) * 10;
    let value = Math.max(5, Math.round(data[i-1][1] + change + trend * 0.05));
    data.push([+now, value]);
  }
  
  return data;
};

const stockData = ref(generateStockData());
</script>

<style scoped>
.chart-card {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style> 