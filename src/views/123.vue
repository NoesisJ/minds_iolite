<template>
  <div class="p-6">
    <!-- <EchartsPreview :options="chartOptions" :theme="'dark'" :animation="true" /> -->
  </div>
</template>

<script setup lang="ts">
import EchartsPreview from "@/components/chat/EChartsPreview.vue";
import { ref } from "vue";

const chartOptions = ref({
  title: {
    text: "示例图表",
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
});
</script>
