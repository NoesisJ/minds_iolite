<template>
  <div class="component-preview w-fit h-fit min-w-xl min-h-xl" :style="styles">
    <!-- 文本组件 -->
    <template v-if="componentType === 'text'">
      <div
        class="text-component p-3 rounded bg-gray-800"
        :style="{
          fontSize: componentProps.fontSize || '16px',
          textAlign: componentProps.textAlign || 'left',
          color: '#FFFFFF',
          lineHeight: '1.5',
          fontWeight: componentProps.content?.includes('标题')
            ? 'bold'
            : 'normal',
          border: '1px solid #4B5563',
        }"
      >
        {{
          componentProps.content ||
          "示例文本：这是一段示例文本内容，您可以在组件属性中修改此文本。文本组件可用于展示标题、段落、说明性文字等多种场景。"
        }}
      </div>
    </template>

    <!-- 图片组件 -->
    <template v-else-if="componentType === 'image'">
      <div
        class="image-preview flex items-center justify-center bg-gray-800 min-h-[100px]"
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
        <img
          v-else
          :src="getImageSrc('jlu.jpg')"
          alt="吉林大学校徽"
          :style="{
            width: componentProps.width || '100%',
            height: componentProps.height || 'auto',
            maxHeight: '200px',
            objectFit: 'contain',
          }"
        />
      </div>
    </template>

    <!-- 按钮组件 -->
    <template v-else-if="componentType === 'button'">
      <div class="button-preview">
        <button
          class="px-4 py-2 rounded transition-colors duration-150 font-medium"
          :class="
            getButtonClass(
              componentProps.type || 'primary',
              componentProps.size || 'medium'
            )
          "
        >
          {{ componentProps.label || "按钮" }}
        </button>
      </div>
    </template>

    <!-- 输入框组件 -->
    <template v-else-if="componentType === 'input'">
      <div class="form-field w-full">
        <div
          v-if="componentProps.label"
          class="field-label mb-1 text-sm text-gray-300"
        >
          {{ componentProps.label }}
          <span v-if="componentProps.required" class="text-red-500">*</span>
        </div>
        <div
          class="input-preview px-3 py-2 border border-gray-600 bg-gray-700 rounded w-full text-sm text-gray-400"
        >
          {{ componentProps.placeholder || "请输入" }}
        </div>
      </div>
    </template>

    <!-- 下拉框组件 -->
    <template v-else-if="componentType === 'select'">
      <div class="form-field w-full">
        <div
          v-if="componentProps.label"
          class="field-label mb-1 text-sm text-gray-300"
        >
          {{ componentProps.label }}
          <span v-if="componentProps.required" class="text-red-500">*</span>
        </div>
        <div class="select-preview relative">
          <div
            class="px-3 py-2 border border-gray-600 bg-gray-700 rounded text-sm text-gray-400 cursor-default flex justify-between items-center"
          >
            <span>{{ getSelectDefaultText() }}</span>
            <i class="pi pi-chevron-down text-gray-400"></i>
          </div>

          <!-- 示例下拉选项（不可交互） -->
          <div
            class="select-options absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded z-10 shadow-lg overflow-hidden opacity-60 pointer-events-none"
          >
            <div
              v-for="(option, index) in getSelectOptions()"
              :key="index"
              class="option-item px-3 py-2 hover:bg-gray-700 text-sm text-gray-300 cursor-default"
              :class="{ 'bg-blue-900/30': index === 0 }"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 表格组件 -->
    <template v-else-if="componentType === 'table'">
      <div class="table-preview border border-gray-700 rounded overflow-hidden">
        <div class="table-header bg-gray-800 p-2 text-sm">
          <div
            class="grid"
            :style="{
              gridTemplateColumns: `repeat(${componentProps.columns?.length || 1}, 1fr)`,
            }"
          >
            <div
              v-for="column in componentProps.columns || []"
              :key="column.field"
              class="font-medium text-gray-300 px-2"
            >
              {{ column.header }}
            </div>
          </div>
        </div>
        <div class="table-body text-sm">
          <!-- 示例数据行 -->
          <div
            v-for="(row, index) in getPreviewTableData()"
            :key="index"
            class="grid border-t border-gray-700"
            :style="{
              gridTemplateColumns: `repeat(${componentProps.columns?.length || 1}, 1fr)`,
            }"
            :class="index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'"
          >
            <div
              v-for="column in componentProps.columns || []"
              :key="column.field"
              class="p-2 text-gray-300 px-3"
            >
              {{ row[column.field] || "-" }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 图表组件 -->
    <template v-else-if="componentType === 'chart'">
      <div
        class="chart-preview bg-gray-800 p-2 rounded-md shadow w-[600px] h-fit"
      >
        <div class="chart-header mb-2">
          <div
            v-if="componentProps?.title"
            class="text-base font-medium text-gray-800"
          >
            {{ componentProps.title }}
          </div>
          <div v-if="componentProps?.subtitle" class="text-sm text-gray-600">
            {{ componentProps.subtitle }}
          </div>
        </div>
        <div
          class="chart-placeholder flex items-center justify-center"
        >
          <component
            v-if="getChartComponent(componentProps?.chartType)"
            :is="getChartComponent(componentProps?.chartType)"
            v-bind="getChartProps(componentProps || {})"
            class="w-full h-full"
          />
          <div
            v-else
            class="flex flex-col items-center justify-center text-gray-500 w-full"
          >
            <div class="text-3xl mb-2">📊</div>
            <div>{{ componentProps?.chartType || "图表" }}预览</div>
          </div>
        </div>
      </div>
    </template>

    <!-- 多行文本组件 -->
    <template v-else-if="componentType === 'textarea'">
      <div class="form-field w-full">
        <div
          class="textarea-preview px-3 py-2 border border-gray-600 bg-gray-700 rounded w-full text-sm text-gray-400 min-h-[100px]"
        >
          {{ componentProps.placeholder || "请输入内容" }}
        </div>
      </div>
    </template>

    <!-- 复选框组件 -->
    <template v-else-if="componentType === 'checkbox'">
      <div class="checkbox-preview flex items-center">
        <div class="w-5 h-5 rounded border border-gray-600 bg-gray-700 flex items-center justify-center mr-2">
          <i v-if="componentProps.value" class="pi pi-check text-sm text-blue-500"></i>
        </div>
        <span class="text-gray-300">{{ componentProps.label || "复选框选项" }}</span>
      </div>
    </template>

    <!-- 单选按钮组件 -->
    <template v-else-if="componentType === 'radio'">
      <div class="radio-preview flex items-center">
        <div class="w-5 h-5 rounded-full border border-gray-600 bg-gray-700 flex items-center justify-center mr-2">
          <div v-if="componentProps.value === componentProps.radioValue" class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
        </div>
        <span class="text-gray-300">{{ componentProps.label || "单选按钮选项" }}</span>
      </div>
    </template>

    <!-- 日期选择器组件 -->
    <template v-else-if="componentType === 'datepicker'">
      <div class="form-field w-full">
        <div class="datepicker-preview relative">
          <div
            class="px-3 py-2 border border-gray-600 bg-gray-700 rounded text-sm text-gray-400 cursor-default flex justify-between items-center"
          >
            <span>{{ componentProps.placeholder || "选择日期" }}</span>
            <i class="pi pi-calendar text-gray-400"></i>
          </div>
        </div>
      </div>
    </template>

    <!-- 未知组件类型 -->
    <template v-else>
      <div
        class="unknown-component p-4 bg-gray-800 rounded border border-dashed border-gray-600"
      >
        <div class="text-center text-gray-400">
          <i class="pi pi-question-circle text-2xl mb-2"></i>
          <div>未知组件类型: {{ componentType }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
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
import HighchartsColumnWidget from "@/components/widgets/charts/HighchartsColumnWidget.vue";
import HighchartsLineWidget from "@/components/widgets/charts/HighchartsLineWidget.vue";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

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
    case "highchartsColumn":
      return HighchartsColumnWidget;
    case "highchartsLine":
      return HighchartsLineWidget;
    default:
      return null;
  }
}

// 获取表格示例数据
function getPreviewTableData() {
  if (!componentProps.value || !componentProps.value.columns) {
    return [];
  }

  // 基于组件定义的列生成示例数据
  const columns = componentProps.value.columns;
  const sampleData = [];

  for (let i = 0; i < 3; i++) {
    const row: Record<string, string | number> = {};
    columns.forEach((column: any) => {
      const field = column.field;
      if (field === "id") {
        row[field] = i + 1;
      } else if (field === "account" || field === "name") {
        row[field] = `示例${field}${i + 1}`;
      } else if (field === "amount" || field === "price") {
        row[field] = (Math.random() * 1000).toFixed(2);
      } else if (field === "date") {
        row[field] = `2023-${String(i + 1).padStart(2, "0")}-01`;
      } else if (field === "status") {
        row[field] = i % 2 === 0 ? "已完成" : "进行中";
      } else if (field === "type") {
        row[field] = i % 2 === 0 ? "类型A" : "类型B";
      } else {
        row[field] = `${field}数据${i + 1}`;
      }
    });
    sampleData.push(row);
  }

  return sampleData;
}

// 获取下拉框选项
function getSelectOptions() {
  if (
    componentProps.value &&
    Array.isArray(componentProps.value.options) &&
    componentProps.value.options.length > 0
  ) {
    return componentProps.value.options;
  }

  // 示例选项
  return [
    { label: "选项 1", value: "1" },
    { label: "选项 2", value: "2" },
    { label: "选项 3", value: "3" },
    { label: "选项 4", value: "4" },
    { label: "选项 5", value: "5" },
  ];
}

// 获取图表组件的props
function getChartProps(componentProps: any) {
  // 基本所有图表组件都需要的属性
  const baseProps = {
    height: componentProps.height || "320px",
    title: componentProps.title || "",
    subtitle: componentProps.subtitle || "",
    showLegend: componentProps.showLegend !== false,
    width: "100%",
    textStyle: {
      color: "#333333", // 默认字体颜色
    },
    // ECharts通用配置
    color: [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
    ],
    titleTextStyle: { color: "#333333" },
    legendTextStyle: { color: "#333333" },
    tooltipTextStyle: { color: "#333333" },
    axisLabelColor: "#333333",
    darkMode: false,
  };

  // 根据图表类型提供不同的示例数据
  switch (componentProps.chartType) {
    case "line":
    case "smoothLine":
      return {
        ...baseProps,
        data: componentProps.data || [
          { name: "系列1", data: [120, 200, 150, 80, 70, 110, 130] },
          { name: "系列2", data: [60, 70, 80, 120, 75, 100, 50] },
        ],
        xAxisData: componentProps.xAxisData || [
          "周一",
          "周二",
          "周三",
          "周四",
          "周五",
          "周六",
          "周日",
        ],
        grid: {
          top: 40,
          right: 25,
          bottom: 60,
          left: 60,
          width: "90%",
          containLabel: true,
        },
        xAxis: {
          axisLabel: { color: baseProps.axisLabelColor },
          axisLine: { lineStyle: { color: "#ccc" } },
        },
        yAxis: {
          axisLabel: { color: baseProps.axisLabelColor },
          axisLine: { lineStyle: { color: "#ccc" } },
        },
        tooltip: { textStyle: { color: "#fff" } },
        legend: { textStyle: { color: baseProps.legendTextStyle.color } },
      };

    case "bar":
      return {
        ...baseProps,
        data: componentProps.data || [
          { name: "销售额", data: [320, 240, 180, 410, 290, 380, 210] },
          { name: "利润", data: [120, 80, 60, 170, 130, 180, 110] },
        ],
        xAxisData: componentProps.xAxisData || [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
        ],
        grid: {
          top: 40,
          right: 25,
          bottom: 60,
          left: 60,
          width: "90%",
          containLabel: true,
        },
        xAxis: {
          axisLabel: { color: baseProps.axisLabelColor },
          axisLine: { lineStyle: { color: "#ccc" } },
        },
        yAxis: {
          axisLabel: { color: baseProps.axisLabelColor },
          axisLine: { lineStyle: { color: "#ccc" } },
        },
        tooltip: { textStyle: { color: "#fff" } },
        legend: { textStyle: { color: baseProps.legendTextStyle.color } },
      };

    case "pie":
      return {
        ...baseProps,
        data: componentProps.data || [
          { name: "类别1", value: 335 },
          { name: "类别2", value: 310 },
          { name: "类别3", value: 234 },
          { name: "类别4", value: 135 },
          { name: "类别5", value: 154 },
        ],
        radius: componentProps.radius || ["40%", "65%"],
        center: componentProps.center || ["50%", "50%"],
        roseType: componentProps.roseType || false,
        label: {
          color: baseProps.axisLabelColor,
          formatter: "{b}: {d}%",
        },
        legend: {
          textStyle: { color: baseProps.legendTextStyle.color },
        },
      };

    case "radar":
      return {
        ...baseProps,
        indicator: componentProps.indicator || [
          { name: "销售", max: 6500 },
          { name: "管理", max: 16000 },
          { name: "研发", max: 30000 },
          { name: "客服", max: 38000 },
          { name: "市场", max: 52000 },
        ],
        data: componentProps.data || [
          { value: [4300, 10000, 28000, 35000, 50000], name: "预算分配" },
          { value: [5000, 14000, 28000, 31000, 42000], name: "实际开销" },
        ],
        center: ["50%", "50%"],
        radius: "65%",
        radar: {
          axisName: {
            color: baseProps.axisLabelColor,
          },
          axisLabel: {
            color: baseProps.axisLabelColor,
          },
          splitLine: {
            lineStyle: {
              color: "rgba(120, 120, 120, 0.2)",
            },
          },
        },
        legend: {
          textStyle: { color: baseProps.legendTextStyle.color },
        },
      };

    case "area":
      return {
        ...baseProps,
        data: componentProps.data || [
          { name: "系列1", data: [120, 200, 150, 80, 70, 110, 130] },
          { name: "系列2", data: [60, 70, 80, 120, 75, 100, 50] },
        ],
        xAxisData: componentProps.xAxisData || [
          "周一",
          "周二",
          "周三",
          "周四",
          "周五",
          "周六",
          "周日",
        ],
        fillOpacity: componentProps.fillOpacity || 0.5,
        grid: { top: 40, right: 20, bottom: 60, left: 50 },
        xAxis: {
          axisLabel: { color: baseProps.axisLabelColor },
          axisLine: { lineStyle: { color: "#ccc" } },
        },
        yAxis: {
          axisLabel: { color: baseProps.axisLabelColor },
          axisLine: { lineStyle: { color: "#ccc" } },
        },
        tooltip: { textStyle: { color: "#fff" } },
        legend: { textStyle: { color: baseProps.legendTextStyle.color } },
      };

    case "mixBarLine":
      return {
        ...baseProps,
        data: componentProps.data || [
          {
            name: "蒸发量",
            type: "bar",
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
          },
          {
            name: "降水量",
            type: "bar",
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6],
          },
          {
            name: "平均温度",
            type: "line",
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3],
          },
        ],
        xAxisData: componentProps.xAxisData || [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
        ],
        grid: { top: 40, right: 40, bottom: 60, left: 50 },
        xAxis: {
          axisLabel: { color: baseProps.axisLabelColor },
          axisLine: { lineStyle: { color: "#ccc" } },
        },
        yAxis: [
          {
            axisLabel: { color: baseProps.axisLabelColor },
            axisLine: { lineStyle: { color: "#ccc" } },
          },
          {
            axisLabel: { color: baseProps.axisLabelColor },
            axisLine: { lineStyle: { color: "#ccc" } },
          },
        ],
        tooltip: { textStyle: { color: "#fff" } },
        legend: { textStyle: { color: baseProps.legendTextStyle.color } },
      };

    case "interactivePieLine":
      return {
        ...baseProps,
        pieConfig: componentProps.pieConfig || {
          radius: ["30%", "45%"],
          center: ["30%", "40%"],
          label: {
            color: baseProps.axisLabelColor,
            formatter: "{b}: {d}%",
          },
        },
        grid: componentProps.grid || {
          top: 30,
          bottom: 30,
          left: "50%",
          right: "5%",
        },
        data: componentProps.data || [
          {
            name: "类别A",
            value: 200,
            details: [150, 120, 90, 180, 240, 220, 190],
          },
          {
            name: "类别B",
            value: 180,
            details: [90, 120, 160, 150, 180, 165, 210],
          },
          {
            name: "类别C",
            value: 150,
            details: [120, 140, 130, 160, 170, 190, 220],
          },
        ],
        xAxisData: componentProps.xAxisData || [
          "周一",
          "周二",
          "周三",
          "周四",
          "周五",
          "周六",
          "周日",
        ],
        xAxis: {
          axisLabel: { color: baseProps.axisLabelColor },
          axisLine: { lineStyle: { color: "#ccc" } },
        },
        yAxis: {
          axisLabel: { color: baseProps.axisLabelColor },
          axisLine: { lineStyle: { color: "#ccc" } },
        },
        tooltip: { textStyle: { color: "#fff" } },
        legend: { textStyle: { color: baseProps.legendTextStyle.color } },
      };

    // 针对Highcharts的图表类型
    case "highchartsPie":
      return {
        ...baseProps,
        data: componentProps.data || [
          { name: "类别A", y: 61.41 },
          { name: "类别B", y: 11.84 },
          { name: "类别C", y: 10.85 },
          { name: "类别D", y: 4.67 },
          { name: "类别E", y: 4.18 },
        ],
        enableDataLabels: componentProps.enableDataLabels !== false,
        size: componentProps.size || "85%",
        highchartsOptions: {
          title: { style: { color: baseProps.titleTextStyle.color } },
          legend: { itemStyle: { color: baseProps.legendTextStyle.color } },
          labels: { style: { color: baseProps.axisLabelColor } },
          tooltip: { style: { color: "#333" } },
        },
      };

    case "highchartsLine":
      return {
        ...baseProps,
        data: componentProps.data || [
          {
            name: "安装与开发",
            data: [43934, 48656, 65165, 81827, 112143, 142383, 171533],
          },
          {
            name: "制造业",
            data: [24916, 37941, 29742, 29851, 32490, 30282, 38121],
          },
        ],
        pointStart: componentProps.pointStart || 2015,
        yAxisTitle: componentProps.yAxisTitle || "数值",
        marginLeft: componentProps.marginLeft || 50,
        marginRight: componentProps.marginRight || 30,
        highchartsOptions: {
          title: { style: { color: baseProps.titleTextStyle.color } },
          legend: { itemStyle: { color: baseProps.legendTextStyle.color } },
          xAxis: { labels: { style: { color: baseProps.axisLabelColor } } },
          yAxis: { labels: { style: { color: baseProps.axisLabelColor } } },
          tooltip: { style: { color: "#333" } },
        },
      };

    case "highchartsColumn":
      return {
        ...baseProps,
        data: componentProps.data || [
          ["东京", 37.33],
          ["德里", 31.18],
          ["上海", 27.79],
          ["圣保罗", 22.23],
          ["墨西哥城", 21.91],
        ],
        seriesName: componentProps.seriesName || "数据",
        colorByPoint: componentProps.colorByPoint !== false,
        dataLabelsEnabled: componentProps.dataLabelsEnabled !== false,
        dataLabelsRotation: componentProps.dataLabelsRotation || -90,
        tooltipFormat:
          componentProps.tooltipFormat || "数值: <b>{point.y:.1f}</b>",
        labelsSuffix: componentProps.labelsSuffix || "",
        marginBottom: componentProps.marginBottom || 80,
      };

    default:
      return componentProps;
  }
}

// 获取按钮类
function getButtonClass(type: string, size: string) {
  const baseClasses = "shadow";
  const typeClasses: Record<string, string> = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    default: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };
  const sizeClasses: Record<string, string> = {
    small: "text-xs px-2 py-1",
    medium: "text-base px-4 py-2",
    large: "text-lg px-6 py-3",
  };
  return `${baseClasses} ${typeClasses[type] || typeClasses.primary} ${sizeClasses[size] || sizeClasses.medium}`;
}

// 获取下拉框默认文本
function getSelectDefaultText() {
  const options = getSelectOptions();
  if (componentProps.value && componentProps.value.value) {
    const selectedOption = options.find(
      (option: { value: string; label: string }) =>
        option.value === componentProps.value.value
    );
    if (selectedOption) {
      return selectedOption.label;
    }
  }
  return componentProps.value?.placeholder || "请选择...";
}
</script>

<style>
/* 全局样式，确保预览对话框足够宽 */
:deep(.p-dialog-content),
:deep(.p-dialog) {
  width: 100% !important;
  max-width: 800px !important;
  min-width: 600px !important;
  overflow: hidden !important;
}

:deep(.preview-dialog) {
  width: 100% !important;
  max-width: 800px !important;
}

:deep(.chart-widget),
:deep(.echarts) {
  width: 100% !important;
  min-width: 100% !important;
}
</style>

<style scoped>
.component-preview {
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.unknown-component {
  border-radius: 4px;
  width: 100%;
}

.text-component {
  word-break: break-word;
  min-height: 24px;
  background: transparent;
  width: 100%;
}

/* 添加图片错误样式 */
.image-preview.error-container {
  border: 1px dashed #f56c6c;
  position: relative;
  padding-bottom: 30px;
  width: 100%;
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
  width: 100% ;
  min-height: 200px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.chart-placeholder {
  position: relative;
  width: 100% ;
  min-height: 320px;
  box-sizing: border-box;
}

/* 特定图表类型样式优化 */
:deep(.echarts-container),
:deep(.highcharts-container) {
  width: 100% !important;
  height: 100% !important;
  min-height: 300px;
}
</style>
