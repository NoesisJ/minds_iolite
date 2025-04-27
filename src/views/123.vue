<template>
  <div class="p-6 gap-6">
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
  </div>
</template>

<script setup lang="ts">
import SimpleRadarChart from "@/components/chat/RadarChartPreview.vue";
</script>
