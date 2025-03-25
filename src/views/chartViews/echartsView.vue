<template>
  <div class="charts-container p-4">

    <!-- 图表网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- 柱状图卡片 -->
      <div class="chart-card">
        <div class="chart-header">
          <h2 class="text-lg">平滑折线图</h2>
        </div>
        <!-- 柱状图 -->
        <div class="chart-wrapper">
          <SmoothLineChart 
            :xAxisData="barData.xAxis.data"
            :seriesData="barData.series[0].data"
            :customOptions="barOptions"
            themeColor="#4E9BFF"
            :darkMode="true"
          />
        </div>
      </div>
      
      <!-- 折线图卡片 -->
      <div class="chart-card">
        <div class="chart-header">
          <h2 class="text-lg">时间轴折线图</h2>
        </div>
        <!-- 折线图 -->
        <div class="chart-wrapper">
          <TimeSeriesLineChart
            seriesName="趋势数据"
            :seriesData="timeSeriesData"
            themeColor="#6366f1"
            areaColor="rgba(99, 102, 241, 0.2)"
            :zoomRange="{ start: 10, end: 90 }"
            :darkMode="true"
          />
        </div>
      </div>
      
      <!-- 联动图卡片 -->
      <div class="chart-card">
        <div class="chart-header">
          <h2 class="text-lg">联动折线饼图</h2>
        </div>
        <!-- 联动折线图 -->
        <div class="chart-wrapper">
          <InteractivePieLineChart 
            :chartData="productData"
            :colorPalette="['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']"
            :darkMode="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SmoothLineChart from '@/components/charts/SmoothLineChart.vue';
import InteractivePieLineChart from '@/components/charts/InteractivePieLineChart.vue';
import TimeSeriesLineChart from '@/components/charts/TimeSeriesLineChart.vue';

// 饼图数据和颜色
const pieColors = ['#4E9BFF', '#FFC233', '#38BFFF', '#FF7B92', '#4DE6A8'];
const pieData = [
  { value: 1048, name: '美国' },
  { value: 735, name: '德国' },
  { value: 580, name: '法国' },
  { value: 484, name: '加拿大' },
  { value: 300, name: '俄罗斯' }
];

// 饼图自定义配置
const pieOptions = ref({
  series: [{
    type: 'pie',
    radius: '70%',
    center: ['50%', '55%'],
    data: pieData,
    itemStyle: {
      borderRadius: 4,
      borderColor: '#333',
      borderWidth: 2
    },
    label: {
      show: true,
      formatter: '{b}: {d}%',
      position: 'outside',
      alignTo: 'labelLine',
      bleedMargin: 5
    },
    labelLine: {
      length: 15,
      length2: 10,
      maxSurfaceAngle: 80
    },
    emphasis: {
      focus: 'series',
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }],
  color: pieColors,
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    show: false
  }
});

// 柱状图数据
const barData = ref({
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value',
    max: 450
  },
  series: [{
    data: [10, 52, 200, 334, 390, 330, 220],
    type: 'bar'
  }]
});

// 柱状图自定义配置
const barOptions = ref({
  series: [{
    type: 'bar',
    barWidth: '60%',
    itemStyle: {
      borderRadius: [4, 4, 0, 0]
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }],
  grid: {
    left: '5%',
    right: '5%',
    top: '5%',
    bottom: '8%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  }
});

// 生成时间序列数据
const generateTimeData = () => {
  const now = new Date();
  const oneDay = 24 * 3600 * 1000;
  let data = [];
  let start = now.getTime() - 90 * oneDay;
  
  for (let i = 0; i < 90; i++) {
    let time = start + i * oneDay;
    // 添加季节性和随机波动
    const seasonal = Math.sin(i / 30 * Math.PI) * 100;
    const random = (Math.random() - 0.5) * 50;
    const trend = i * 0.5;
    const value = Math.max(0, Math.round(150 + trend + seasonal + random));
    
    data.push([time, value]);
  }
  
  return data;
};

// 联动折线图数据
const productData = ref([
  ['产品', '2020', '2021', '2022', '2023'],
  ['笔记本电脑', 156.5, 182.1, 188.7, 170.1],
  ['智能手机', 251.1, 251.4, 205.1, 253.3],
  ['平板电脑', 140.1, 162.2, 169.5, 136.4],
  ['智能手表', 85.2, 97.1, 141.2, 168.0]
]);

// 时间序列数据
const timeSeriesData = ref(generateTimeData());
</script>

<style scoped>
.charts-container {
  background-color: #1a1a1a;
  min-height: 100vh; /* 确保容器至少占满整个视口高度 */
}

.chart-card {
  background-color: #333;
  border-radius: 0.5rem;
  padding: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
  padding: 1rem;
  flex: 1;
  aspect-ratio: 4/3;
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
