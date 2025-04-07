<template>
  <div class="component-preview" :style="styles">
    <!-- 文本组件 -->
    <template v-if="componentType === 'text'">
      <div
        class="text-component"
        :style="{
          fontSize: componentProps.fontSize,
          textAlign: componentProps.textAlign,
          color: componentProps.color || '#333333',
        }"
      >
        {{ componentProps.content }}
      </div>
    </template>

    <!-- 图片组件 -->
    <template v-else-if="componentType === 'image'">
      <div
        class="image-preview flex items-center justify-center bg-gray-100 dark:bg-gray-800 min-h-[100px]"
      >
        <img
          v-if="componentProps.src"
          :src="getImageSrc(componentProps.src)"
          :alt="componentProps.alt"
          :style="{
            width: componentProps.width || '100%',
            height: componentProps.height || 'auto',
            maxHeight: '200px',
            objectFit: 'contain',
          }"
          @error="handleImageError"
        />
        <div v-else class="text-gray-400 p-4 text-center">
          <i class="pi pi-image text-2xl"></i>
          <div class="text-sm mt-1">图片预览</div>
        </div>
      </div>
    </template>

    <!-- 按钮组件 -->
    <template v-else-if="componentType === 'button'">
      <n-button :type="componentProps.type" :size="componentProps.size">
        {{ componentProps.label }}
      </n-button>
    </template>

    <!-- 输入框组件 -->
    <template v-else-if="componentType === 'input'">
      <div class="form-field">
        <div v-if="componentProps.label" class="field-label mb-1 text-sm">
          {{ componentProps.label }}
          <span v-if="componentProps.required" class="text-red-500">*</span>
        </div>
        <n-input :placeholder="componentProps.placeholder" disabled />
      </div>
    </template>

    <!-- 下拉框组件 -->
    <template v-else-if="componentType === 'select'">
      <div class="form-field">
        <div v-if="componentProps.label" class="field-label mb-1 text-sm">
          {{ componentProps.label }}
          <span v-if="componentProps.required" class="text-red-500">*</span>
        </div>
        <n-select
          :options="componentProps.options"
          :placeholder="componentProps.placeholder"
          disabled
        />
      </div>
    </template>

    <!-- 表格组件 -->
    <template v-else-if="componentType === 'table'">
      <div
        class="table-preview border border-gray-200 dark:border-gray-700 rounded overflow-hidden"
      >
        <div class="table-header bg-gray-100 dark:bg-gray-800 p-2 text-sm">
          <div
            class="grid"
            :style="{
              gridTemplateColumns: `repeat(${componentProps.columns.length}, 1fr)`,
            }"
          >
            <div
              v-for="column in componentProps.columns"
              :key="column.field"
              class="font-medium"
            >
              {{ column.header }}
            </div>
          </div>
        </div>
        <div class="table-body p-2 text-sm">
          <div class="text-gray-500 dark:text-gray-400 text-center py-2">
            表格数据将在运行时显示
          </div>
        </div>
      </div>
    </template>

    <!-- 图表组件 -->
    <template v-else-if="componentType === 'chart'">
      <div class="chart-preview" :style="componentStyles">
        <div
          v-if="chartLoaded"
          class="chart-container"
          style="width: 100%; height: 100%"
        >
          <!-- 实际图表容器，动态加载图表组件 -->
          <component
            :is="getChartComponent(componentProps.chartType)"
            v-bind="componentProps"
          />
        </div>
        <div
          v-else
          class="chart-placeholder flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded border border-dashed border-gray-300 dark:border-gray-600"
          :style="{ height: componentProps.height || '300px' }"
        >
          <div class="text-3xl mb-2">
            <i :class="getChartIcon(componentProps.chartType)"></i>
          </div>
          <div class="text-gray-500 dark:text-gray-400 text-center">
            <div class="font-medium">
              {{ getChartName(componentProps.chartType) }}
            </div>
            <div class="text-sm mt-1">
              {{ getChartDescription(componentProps.chartType) }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 未知组件类型 -->
    <template v-else>
      <div
        class="unknown-component p-4 bg-gray-100 dark:bg-gray-800 rounded border border-dashed border-gray-300 dark:border-gray-600"
      >
        <div class="text-center text-gray-500 dark:text-gray-400">
          <i class="pi pi-question-circle text-2xl mb-2"></i>
          <div>未知组件类型: {{ componentType }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import { getComponentDefinition } from "@/data/componentLibrary";
import { getImageUrl } from "@/assets/imageImports";
// 导入图表组件
import EchartsLineWidget from "@/components/widgets/charts/EchartsLineWidget.vue";
import EchartsBarWidget from "@/components/widgets/charts/EchartsBarWidget.vue";
import EchartsPieWidget from "@/components/widgets/charts/EchartsPieWidget.vue";
import EchartsRadarWidget from "@/components/widgets/charts/EchartsRadarWidget.vue";
import EchartsSmoothLineWidget from "@/components/widgets/charts/EchartsSmoothLineWidget.vue";
import EchartsMixBarLineWidget from "@/components/widgets/charts/EchartsMixBarLineWidget.vue";
import EchartsInteractivePieLineWidget from "@/components/widgets/charts/EchartsInteractivePieLineWidget.vue";
import HighchartsPieWidget from "@/components/widgets/charts/HighchartsPieWidget.vue";
import HighchartsAreaWidget from "@/components/widgets/charts/HighchartsAreaWidget.vue";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

// 图表加载状态
const chartLoaded = ref(true);

// 组件类型
const componentType = computed(() => {
  const definition = getComponentDefinition(props.component.componentId);
  return definition?.type || "unknown";
});

// 组件属性
const componentProps = computed(() => {
  return props.component.props || {};
});

// 组件样式
const styles = computed(() => {
  return props.component.styles || {};
});

// 组件样式 - 添加这个计算属性
const componentStyles = computed(() => {
  return props.component.styles || {};
});

// 获取图片源路径 - 使用Vite的资源导入
const getImageSrc = (src: string) => {
  if (!src) return "";

  // 判断是否为完整URL
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // 使用资源导入
  return getImageUrl(src);
};

// 改进错误处理
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  console.error("图片加载失败:", target.src);

  // 添加错误样式
  target.classList.add("error");
  target.parentElement?.classList.add("error-container");

  // 改变alt文本提供反馈
  target.alt = "图片未找到";

  // 错误信息
  const errorText = document.createElement("div");
  errorText.className = "error-text";
  errorText.textContent = "无法加载图片";

  // 确保只添加一次错误信息
  if (!target.parentElement?.querySelector(".error-text")) {
    target.parentElement?.appendChild(errorText);
  }
};

// 获取图表组件
function getChartComponent(chartType: string) {
  if (!chartType) return null;

  // 根据图表类型返回对应的组件
  switch (chartType) {
    case "line":
      return EchartsLineWidget;
    case "bar":
      return EchartsBarWidget;
    case "pie":
      return EchartsPieWidget;
    case "radar":
      return EchartsRadarWidget;
    case "smoothLine":
      return EchartsSmoothLineWidget;
    case "mixBarLine":
      return EchartsMixBarLineWidget;
    case "interactivePieLine":
      return EchartsInteractivePieLineWidget;
    case "highchartsPie":
      return HighchartsPieWidget;
    case "area":
      return HighchartsAreaWidget;
    default:
      return null;
  }
}

// 获取图表图标
function getChartIcon(chartType: string): string {
  switch (chartType) {
    case "line":
      return "pi pi-chart-line";
    case "bar":
      return "pi pi-chart-bar";
    case "pie":
      return "pi pi-chart-pie";
    case "radar":
      return "pi pi-chart-pie";
    case "smoothLine":
      return "pi pi-chart-line";
    case "area":
      return "pi pi-chart-line";
    case "mixBarLine":
      return "pi pi-chart-bar";
    case "interactivePieLine":
      return "pi pi-chart-pie";
    default:
      return "pi pi-chart-bar";
  }
}

// 获取图表名称
function getChartName(chartType: string): string {
  switch (chartType) {
    case "line":
      return "折线图";
    case "bar":
      return "柱状图";
    case "pie":
      return "饼图";
    case "radar":
      return "雷达图";
    case "smoothLine":
      return "平滑折线图";
    case "area":
      return "面积图";
    case "mixBarLine":
      return "柱状折线混合图";
    case "interactivePieLine":
      return "交互式饼图折线图";
    default:
      return "图表";
  }
}

// 获取图表描述
function getChartDescription(chartType: string): string {
  switch (chartType) {
    case "line":
      return "用于展示数据变化趋势";
    case "bar":
      return "用于展示分类数据对比";
    case "pie":
      return "用于展示数据占比分布";
    case "radar":
      return "用于多维数据比较分析";
    case "smoothLine":
      return "用于平滑展示数据趋势变化";
    case "area":
      return "用于展示数据范围及趋势";
    case "mixBarLine":
      return "用于展示对比数据及趋势";
    case "interactivePieLine":
      return "用于展示关联数据的交互分析";
    default:
      return "各类数据可视化图表";
  }
}
</script>

<style scoped>
.component-preview {
  position: relative;
}

.unknown-component {
  border-radius: 4px;
}

.text-component {
  word-break: break-word;
  min-height: 24px;
  background: transparent;
}

/* 添加图片错误样式 */
.image-preview.error-container {
  border: 1px dashed #f56c6c;
  position: relative;
  padding-bottom: 30px;
}

.error-text {
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  text-align: center;
  color: #f56c6c;
  font-size: 12px;
}

.image-preview img.error {
  opacity: 0.5;
}

.image-preview img {
  max-width: 100%;
  transition: all 0.3s;
}

.chart-preview {
  width: 100%;
  min-height: 200px;
}
</style>
