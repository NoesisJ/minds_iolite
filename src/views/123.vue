<template>
  <div class="p-6 gap-6">
    <SimpleAreaChart
      :data="[120, 200, 150, 80, 70, 110, 130]"
      title="销售趋势"
    />
    <SimpleRadarChart
      :indicators="[
        { name: '销售', max: 6500 },
        { name: '管理', max: 16000 },
        { name: '研发', max: 52000 },
      ]"
      :seriesData="[
        { name: '预算', value: [4200, 3000, 50000] },
        { name: '实际', value: [5000, 14000, 42000] },
      ]"
      title="预算执行情况"
    />
    <SimpleBarChart
      :xAxisData="['周一', '周二', '周三', '周四', '周五']"
      :barData="[
        [120, 200, 150, 80, 70],
        [140, 180, 130, 90, 60],
      ]"
      :seriesNames="['销量', '库存']"
      title="商品数据统计"
      yAxisUnit="件"
    />
  </div>
</template>

<script setup lang="ts">
import SimpleAreaChart from "@/components/chat/AreaLineChartPreview.vue";
import SimpleRadarChart from "@/components/chat/RadarChartPreview.vue";
import SimpleBarChart from "@/components/chat/BarChartPreview.vue";
</script>
