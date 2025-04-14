<template>
  <div
    class="echarts-preview h-[40rem] rounded-lg overflow-hidden shadow-sm bg-[var(--material-item-bg)]"
  >
    <!-- 标签栏 (保持不变) -->
    <div
      class="flex bg-[var(--material-item-header)] h-[var(--preview-header-h)] shadow-sm"
    >
      <button
        @click="activeTab = 'preview'"
        class="px-4 py-2 font-medium text-sm transition-colors duration-200"
        :class="activeTab === 'preview' ? activeTabStyle : inactiveTabStyle"
      >
        预览
      </button>
      <button
        @click="activeTab = 'code'"
        class="px-4 py-2 font-medium text-sm transition-colors duration-200"
        :class="activeTab === 'code' ? activeTabStyle : inactiveTabStyle"
      >
        代码
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="w-full h-[calc(100%-var(--preview-header-h))]">
      <div v-show="activeTab === 'preview'" class="w-full h-full rounded p-2">
        <div ref="echartsRef" class="w-full h-full"></div>
      </div>

      <div v-show="activeTab === 'code'" class="h-full">
        <pre
          class="text-sm px-4 py-6 bg-gray-900 text-gray-100 rounded overflow-auto h-full"
        >
          <code>{{ formattedCode }}</code>
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";

// 1. 定义类型
interface ChartDataPayload {
  /** 图表类型 */
  chartType: "line" | "bar" | "pie" | "scatter" | "custom";
  /** 二维数据数组 */
  data: any[][];
  /** 可选的定制配置 */
  custom?: Partial<EChartsOption>;
}

interface Props {
  /** 来自后端的数据配置 */
  chartData?: ChartDataPayload;
  /** 完整配置（优先级高于chartData） */
  options?: EChartsOption;
  code?: string;
  theme?: string | object;
  animation?: boolean;
}

// 2. 默认主题配置
const DEFAULT_THEME_CONFIG = {
  common: {
    backgroundColor: "transparent",
    textStyle: {
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#333",
    },
    animationDuration: 1000,
    grid: {
      containLabel: true,
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "10%",
    },
  },
  typeStyles: {
    line: {
      color: ["#5470C6", "#91CC75", "#FAC858"],
      series: {
        symbolSize: 8,
        lineWidth: 3,
        smooth: true,
      },
    },
    bar: {
      color: ["#5470C6", "#EE6666"],
      series: {
        barWidth: "60%",
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
      },
    },
    pie: {
      color: ["#37A2FF", "#32C5E9", "#67E0E3"],
      series: {
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: "{b}: {c} ({d}%)",
        },
      },
    },
    scatter: {
      color: ["#91CC75", "#FAC858", "#EE6666"],
      series: {
        symbolSize: 10,
      },
    },
    custom: {
      color: ["#5470C6", "#91CC75", "#FAC858"],
      series: {},
    },
  },
};

const props = withDefaults(defineProps<Props>(), {
  chartData: undefined,
  options: undefined,
  code: "",
  theme: "",
  animation: true,
});

const emit = defineEmits(["chart-mounted", "chart-updated"]);

// 3. 响应式状态
const activeTab = ref<"preview" | "code">("preview");

// Define formattedCode
const formattedCode = computed(() => {
  return props.code || "No code available";
});
const echartsRef = ref<HTMLElement | null>(null);
const chartInstance = ref<ECharts | null>(null);
const activeTabStyle =
  "text-white border-b-2 border-[var(--material-red-dark)] bg-[var(--material-item-bg-selected)] hover:bg-[var(--material-item-bg-selected-hover)]";
const inactiveTabStyle =
  "text-gray-400 hover:text-gray-200 hover:bg-[var(--material-item-bg-hover)]";

// 1. 增强类型定义
interface ChartDataPayload {
  chartType: "line" | "bar" | "pie" | "scatter" | "custom";
  data: any[][];
  dimensions?: string[]; // 可选维度定义
  custom?: Partial<EChartsOption>;
}

interface Props {
  chartData?: ChartDataPayload;
  options?: EChartsOption;
  code?: string;
  theme?: string | object;
  animation?: boolean;
}

// 3. 配置合并增强
const mergedOptions = computed<EChartsOption>(() => {
  return {
    ...(props.options || {}),
    ...(props.chartData
      ? {
          dataset: { source: props.chartData.data },
          series: props.chartData.data[0].slice(1).map((_, i) => ({
            type: props.chartData?.chartType,
            ...((props.chartData?.chartType &&
              DEFAULT_THEME_CONFIG.typeStyles[props.chartData.chartType]
                ?.series) ||
              {}),
            ...(Array.isArray(props.chartData?.custom?.series)
              ? props.chartData.custom.series[i]
              : {}),
          })),
          xAxis:
            props.chartData.chartType !== "pie"
              ? {
                  type: "category" as const,
                  data: props.chartData.data[0].slice(1),
                }
              : undefined,
          yAxis:
            props.chartData.chartType !== "pie"
              ? { type: "value" as const }
              : undefined,
        }
      : {}),
  } as EChartsOption;
});

// 4. 图表初始化（增加错误处理）
const initChart = async () => {
  if (!echartsRef.value) return;

  try {
    chartInstance.value?.dispose();
    chartInstance.value = echarts.init(echartsRef.value, props.theme);

    // 确保配置有效性
    const options = mergedOptions.value;
    if (
      !options.series ||
      (Array.isArray(options.series) && options.series.length === 0)
    ) {
      throw new Error("Invalid chart configuration: missing series data");
    }

    chartInstance.value.setOption(options);
    emit("chart-mounted", chartInstance.value);
  } catch (err) {
    console.error("[ECharts Error]", err);
    // 可以在这里显示错误提示
  }
};

const resizeChart = () => {
  chartInstance.value?.resize({
    animation: { duration: props.animation ? 300 : 0 },
  });
};

// 6. 监听器
watch(
  () => [props.chartData, props.options],
  () => {
    if (chartInstance.value) {
      chartInstance.value.setOption(mergedOptions.value, {
        notMerge: true,
        replaceMerge: ["series"],
      });
      emit("chart-updated", chartInstance.value);
    }
  },
  { deep: true }
);

watch(activeTab, (newVal) => {
  if (newVal === "preview") nextTick(resizeChart);
});

watch(
  () => props.theme,
  () => {
    initChart();
  }
);

// 7. 生命周期
onMounted(() => {
  initChart();
  window.addEventListener("resize", resizeChart);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  chartInstance.value?.dispose();
});

// 8. 暴露方法
defineExpose({
  getInstance: () => chartInstance.value,
  resize: resizeChart,
  switchTab: (tab: "preview" | "code") => (activeTab.value = tab),
  getCurrentOptions: () => mergedOptions.value,
});
</script>

<style scoped>
.echarts-preview {
  --preview-header-h: 2.5rem;
}
</style>
