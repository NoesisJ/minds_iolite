<template>
  <div
    class="rounded-lg border border-gray-200 overflow-hidden shadow-sm"
  >
    <!-- 标签栏 -->
    <div class="flex bg-gray-50 border-b border-gray-200">
      <button
        @click="activeTab = 'preview'"
        class="px-4 py-2 font-medium text-sm transition-colors duration-200"
        :class="
          activeTab === 'preview'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        "
      >
        预览
      </button>
      <button
        @click="activeTab = 'code'"
        class="px-4 py-2 font-medium text-sm transition-colors duration-200"
        :class="
          activeTab === 'code'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        "
      >
        代码
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="w-full">
      <!-- 预览标签内容 -->
      <div v-if="activeTab === 'preview'" class="p-4 bg-white">
        <div class="w-full h-80 border border-gray-200 rounded p-2">
          <div ref="echartsRef" class="w-full h-full"></div>
        </div>
      </div>

      <!-- 代码标签内容 -->
      <div v-if="activeTab === 'code'" class="p-4 bg-gray-50">
        <pre
          class="text-sm p-4 bg-gray-900 text-gray-100 rounded overflow-auto max-h-80"
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
