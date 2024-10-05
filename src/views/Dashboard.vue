<!-- Placeholder -->
<template>
  <div ref="chartDom" style="width: 600px; height: 400px"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

// 使用 ref 来获取 DOM 元素
const chartDom = ref<HTMLElement | null>(null);

onMounted(() => {
  if (chartDom.value) {
    // 初始化 ECharts 实例
    const myChart = echarts.init(chartDom.value);

    // 设置图表配置项和数据
    const option = {
      title: {
        text: "Nostalgia",
      },
      tooltip: {},
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    };

    // 使用设置的配置项显示图表
    myChart.setOption(option);
  }
});
</script>

<style scoped>
div {
  width: 600px;
  height: 400px;
}
</style>
