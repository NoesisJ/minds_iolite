<template>
  <div
    class="echarts-preview h-[40rem] rounded-lg overflow-hidden shadow-sm bg-[var(--material-item-bg)]"
  >
    <!-- 标签栏 -->
    <div
      class="flex bg-[var(--material-item-header)] h-[var(--preview-header-h)] shadow-sm"
    >
      <button
        @click="activeTab = 'preview'"
        class="px-4 py-2 font-medium text-sm transition-colors duration-200"
        :class="
          activeTab === 'preview'
            ? 'text-white border-b-2 border-[var(--material-red-dark)] bg-[var(--material-item-bg-selected)] hover:bg-[var(--material-item-bg-selected-hover)]'
            : 'text-gray-400 hover:text-gray-200 hover:bg-[var(--material-item-bg-hover)]'
        "
      >
        预览
      </button>
      <button
        @click="activeTab = 'code'"
        class="px-4 py-2 font-medium text-sm transition-colors duration-200"
        :class="
          activeTab === 'code'
            ? 'text-white border-b-2 border-[var(--material-red-dark)] bg-[var(--material-item-bg-selected)] hover:bg-[var(--material-item-bg-selected-hover)]'
            : 'text-gray-400 hover:text-gray-200 hover:bg-[var(--material-item-bg-hover)]'
        "
      >
        代码
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="w-full h-[calc(100%-var(--preview-header-h))]">
      <!-- 预览标签内容 -->
      <div v-show="activeTab === 'preview'" class="w-full h-full rounded p-2">
        <div ref="echartsRef" class="w-full h-full"></div>
      </div>

      <!-- 代码标签内容 -->
      <div v-show="activeTab === 'code'" class="h-full">
        <pre
          class="text-sm px-4 py-6 bg-gray-900 text-gray-100 rounded overflow-auto h-full"
        ><code>{{ formattedCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";

interface Props {
  // 图表配置选项
  options?: EChartsOption;
  // 需要展示的代码（可选，如果不提供则自动生成）
  code?: string;
  // 图表主题（可选）
  theme?: string | object;
  // 是否启用图表动画（默认true）
  animation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
  code: "",
  theme: "",
  animation: true,
});

const emit = defineEmits(["chart-mounted", "chart-updated"]);

// 状态变量
const activeTab = ref<"preview" | "code">("preview");
const echartsRef = ref<HTMLElement | null>(null);
const chartInstance = ref<ECharts | null>(null);

// 格式化代码
const formattedCode = computed(() => {
  if (props.code) {
    return props.code;
  }

  // 自动生成使用示例代码
  return `<template>
    <div ref="chartRef" style="width: 100%; height: 400px;"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import * as echarts from 'echarts';
  
  const chartRef = ref<HTMLElement | null>(null);
  const chartInstance = ref<echarts.ECharts | null>(null);
  
  const options = ${JSON.stringify(props.options, null, 2)};
  
  onMounted(() => {
    if (chartRef.value) {
      chartInstance.value = echarts.init(chartRef.value);
      chartInstance.value.setOption(options);
      
      // 响应式调整大小
      const resizeObserver = new ResizeObserver(() => {
        chartInstance.value?.resize();
      });
      resizeObserver.observe(chartRef.value);
    }
  });
  
  onUnmounted(() => {
    chartInstance.value?.dispose();
  });
  <\/script>`;
});

// 初始化或更新图表
const initOrUpdateChart = () => {
  if (activeTab.value === "preview" && echartsRef.value) {
    nextTick(() => {
      if (!chartInstance.value) {
        // 初始化图表
        chartInstance.value = echartsRef.value
          ? echarts.init(echartsRef.value, props.theme, {
              renderer: "canvas",
              width: "auto",
              height: "auto",
            })
          : null;

        if (chartInstance.value) {
          emit("chart-mounted", chartInstance.value);
        }
      }

      if (chartInstance.value && props.options) {
        // 设置图表选项
        chartInstance.value.setOption(props.options, {
          notMerge: true,
          lazyUpdate: false,
          silent: false,
          replaceMerge: ["series"],
        });
        emit("chart-updated", chartInstance.value);
      }
    });
  }
};

// 响应式调整图表大小
const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize({
      animation: {
        duration: 300,
      },
    });
  }
};

// 监听配置变化
watch(
  () => props.options,
  () => {
    initOrUpdateChart();
  },
  { deep: true }
);

// 监听主题变化
watch(
  () => props.theme,
  (newTheme) => {
    if (chartInstance.value) {
      chartInstance.value.dispose();
      chartInstance.value = echarts.init(echartsRef.value, newTheme);
      initOrUpdateChart();
    }
  }
);

// 监听标签切换
watch(activeTab, (newTab) => {
  if (newTab === "preview") {
    nextTick(() => {
      initOrUpdateChart();
      resizeChart();
    });
  }
});

// 生命周期钩子
onMounted(() => {
  initOrUpdateChart();

  // 添加窗口大小变化监听
  window.addEventListener("resize", resizeChart);
});

onUnmounted(() => {
  // 移除事件监听器
  window.removeEventListener("resize", resizeChart);

  // 销毁图表实例
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

// 暴露方法供父组件调用
defineExpose({
  // 获取图表实例
  getInstance: () => chartInstance.value,
  // 重新渲染图表
  resize: () => resizeChart(),
  // 切换到指定标签
  switchTab: (tab: "preview" | "code") => {
    activeTab.value = tab;
  },
});
</script>

<style scoped>
.echarts-preview {
  --preview-header-h: 2.5rem; /* 标签栏高度 */
}
</style>
