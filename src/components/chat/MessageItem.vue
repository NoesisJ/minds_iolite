<!-- components/chat/MessageItem.vue -->
<template>
  <div
    class="flex w-full select-text group"
    :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div class="max-w-[80%] rounded-lg p-4 relative" :class="messageClass">
      <!-- 普通文本内容 -->
      <template v-if="!hasChartData">
        {{ message.content }}
      </template>

      <!-- 图表内容 -->
      <template v-else>
        <!-- 提取非JSON部分的文本 -->
        <div v-if="nonJsonContent" class="mb-4">
          {{ nonJsonContent[0] }}
        </div>

        <!-- 渲染对应的图表 -->
        <div v-if="chartData">
          <SimplePieChart
            v-if="chartData.chart_type === 'pie'"
            :pieData="pieChartData"
            :title="chartData.title"
          />
          <SimpleBarChart
            v-else-if="chartData.chart_type === 'bar'"
            :xAxisData="chartData.categories"
            :barData="[chartData.values]"
            :seriesNames="['数值']"
            :title="chartData.title"
          />
          <SimpleAreaChart
            v-else-if="chartData.chart_type === 'line'"
            :data="chartData.values"
            :title="chartData.title"
          />
        </div>

        <div v-if="nonJsonContent" class="mb-4">
          {{ nonJsonContent[1] }}
        </div>
      </template>

      <!-- 小复制按钮 -->
      <div
        v-if="message.sender !== 'system'"
        class="absolute flex items-center justify-center rounded-md bg-[#7d4a38] w-10 h-8 p-2 text-white hover:bg-[#c96442] border border-[#404040] cursor-pointer opacity-0 group-hover:opacity-100 group-hover:transition-all group-hover:duration-100"
        :class="
          message.sender === 'user'
            ? 'left-[-40px] bottom-[10px] group-hover:left-[-60px]'
            : 'bottom-[10px] right-[-40px] group-hover:right-[-60px]'
        "
        @click="copyToClipboard(message.content)"
      >
        <Copy class="h-4 w-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Copy } from "lucide-vue-next";
import type { Message } from "@/types/chat";
import SimpleAreaChart from "@/components/chat/AreaLineChartPreview.vue";
import SimplePieChart from "@/components/chat/BasicPieChartPreview.vue";
import SimpleBarChart from "@/components/chat/BarChartPreview.vue";

const props = defineProps<{
  message: Message;
}>();

// 尝试从消息内容中提取JSON数据
const extractJsonData = (content: string) => {
  try {
    // 1. 先尝试匹配 ```...``` 代码块
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const codeBlockMatch = content.match(codeBlockRegex);

    if (codeBlockMatch && codeBlockMatch[0]) {
      // 提取第一个代码块的内容（去掉 ```）
      const codeContent = codeBlockMatch[0].replace(/```/g, "").trim();
      // 处理单引号和双引号的转换
      const formattedCodeContent = codeContent.replace(/'/g, '"');
      // 尝试解析为 JSON
      return JSON.parse(formattedCodeContent);
    }

    // 2. 如果没有代码块，尝试匹配 [...] 中括号内容
    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) {
      const jsonString = jsonMatch[0].replace(/^\[|\]$/g, "");
      const formattedJsonString = jsonString.replace(/'/g, '"');
      return JSON.parse(formattedJsonString);
    }
    return null;
  } catch (e) {
    console.error("Failed to parse JSON from message:", e);
    return null;
  }
};

const chartData = computed(() => extractJsonData(props.message.content));
const hasChartData = computed(() => !!chartData.value);

// 提取非JSON部分的文本内容
const nonJsonContent = computed(() => {
  if (!hasChartData.value) return null;
  const jsonMatch = props.message.content.match(/\[.*\]/s);
  if (jsonMatch) {
    // 提取非JSON部分的文本内容为除去json的两个部分
    return props.message.content.split(jsonMatch[0]);
  }
  return props.message.content;
});

// 为饼图准备数据格式
const pieChartData = computed(() => {
  if (!chartData.value || chartData.value.chart_type !== "pie") return [];
  return chartData.value.labels.map((label: string, index: number) => ({
    name: label,
    value: chartData.value.values[index],
  }));
});

const messageClass = computed(() => {
  const sender = props.message.sender;

  if (sender === "user") {
    return "bg-[#404040] text-white";
  } else if (sender === "ai") {
    return "bg-[#353535] text-white";
  } else {
    // 系统消息或错误消息
    return "bg-[#532f2f] text-white";
  }
});

const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  }

  // Fallback for legacy browsers
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.cssText =
      "position:fixed;pointer-events:none;z-index:-9999;opacity:0;";

    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error("Legacy clipboard copy also failed:", err);
    return false;
  }
};
</script>
