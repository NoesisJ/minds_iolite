<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  subtitle: String,
  data: {
    type: Array,
    required: true,
  },
  colors: {
    type: Array,
    default: () => [
      "#2ec7c9",
      "#b6a2de",
      "rgb(245, 203, 156)",
      "rgb(80, 227, 194)",
      "rgb(255, 196, 230)",
    ],
  },
});

const maxValue = Math.max(...props.data.map((item) => item.value));

const option = computed(() => ({
  backgroundColor: "#fff",
  title: {
    text: props.title,
    subtext: props.subtitle,
    left: "center",
    top: "10px",
    textStyle: {
      fontSize: 20,
    },
    subtextStyle: {
      fontSize: 14,
    },
  },
  toolbox: {
    show: true,
    feature: {
      dataView: { show: true },
      saveAsImage: { pixelRatio: 5 },
    },
  },
  angleAxis: {
    show: false,
    min: 0,
    max: (maxValue * 4) / 3,
  },
  radiusAxis: {
    type: "category",
    axisLabel: {
      interval: 0,
      color: "#000",
      fontSize: 18,
    },
    axisLine: { show: false },
    axisTick: { show: false, alignWithLabel: true },
    splitLine: {
      show: false,
      lineStyle: {
        color: "rgba(17, 51, 68, 0.8)",
      },
    },
    data: props.data.map((item) => item.name),
  },
  polar: {
    center: ["50%", "50%"],
  },
  series: [
    {
      type: "bar",
      coordinateSystem: "polar",
      barWidth: 25,
      data: props.data.map((item, index) => ({
        value: item.value,
        name: item.name,
        itemStyle: { color: props.colors[index % props.colors.length] },
      })),
    },
    {
      type: "custom",
      coordinateSystem: "polar",
      renderItem: function (params, api) {
        const values = [api.value(0), api.value(1)];
        const coord = api.coord(values);
        return {
          type: "text",
          position: [3 * Math.sin(coord[3]), 3 * Math.cos(coord[3])],
          rotation: coord[3] + Math.PI / 2,
          origin: [coord[0], coord[1]],
          style: {
            text: api.value(1),
            fill: "#000",
            fontSize: 16,
            textAlign: "right",
            textVerticalAlign: "middle",
            x: coord[0],
            y: coord[1],
          },
        };
      },
      data: props.data.map((item) => [item.name, item.value]),
    },
  ],
}));
</script>

<style scoped>
.chart {
  width: 100%;
  height: 500px;
}
</style>
