<template>
  <div
    class="flex w-full select-text group"
    :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div class="max-w-[80%] rounded-lg p-4 relative" :class="messageClass">
      <!-- 普通文本内容 -->
      <template v-if="!hasChartData && !hasBracketData">
        {{ message.content }}
      </template>

      <!-- 图表内容 (代码块格式) -->
      <template v-else-if="hasChartData">
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
            :xAxisData="chartData.xAxisData"
            :barData="chartData.barData"
            :seriesNames="['totaltime1', 'totaltime2']"
            :title="chartData.title"
          />
          <SimpleAreaChart
            v-else-if="chartData.chart_type === 'line'"
            :data="chartData.data"
            :xAxisLabels="chartData.xAxisLabels"
            :title="chartData.title"
          />
        </div>

        <div v-if="nonJsonContent" class="mb-4">
          {{ nonJsonContent[1] }}
        </div>
      </template>

      <!-- 中括号JSON内容显示为代码块 -->
      <template v-else-if="hasBracketData">
        <!-- 提取中括号前面的文本 -->
        <div v-if="bracketNonJsonContent[0]" class="mb-4">
          {{ bracketNonJsonContent[0] }}
        </div>

        <!-- 显示JSON格式的代码块 -->
        <pre
          class="bg-[#2d2d2d] p-3 rounded-md overflow-x-auto"
        ><code>{{ formattedBracketJsonContent }}</code></pre>

        <!-- 提取中括号后面的文本 -->
        <div v-if="bracketNonJsonContent[1]" class="mt-4">
          {{ bracketNonJsonContent[1] }}
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

// 尝试从消息内容中提取代码块中的JSON数据
const extractJsonData = (content: string) => {
  try {
    // 尝试匹配 $$$$ ... $$$$ 包裹的内容
    // 这里使用 $$$$ 作为代码块的标记符号
    const codeBlockRegex = /\$\$\$\$([\s\S]*?)\$\$\$\$/g;
    const codeBlockMatch = content.match(codeBlockRegex);

    if (codeBlockMatch && codeBlockMatch[0]) {
      console.log("Extracting JSON data from content:", content);
      // 提取第一个代码块的内容（去掉 ```）
      const codeContent = codeBlockMatch[0].replace(/\$\$\$\$/g, "").trim();
      // 处理单引号和双引号的转换
      const formattedCodeContent = codeContent.replace(/'/g, '"');
      console.log("Formatted code content:", formattedCodeContent);
      // 尝试解析为 JSON
      return JSON.parse(formattedCodeContent);
    }
    return null;
  } catch (e) {
    console.error("Failed to parse JSON from code block:", e);
    return null;
  }
};

// 提取中括号中的内容
const extractBracketData = (content: string) => {
  try {
    // 尝试匹配 [...] 中括号内容
    const jsonMatch = content.match(/\[([\s\S]*)\]/);
    if (jsonMatch) {
      // 删掉头尾的中括号
      const jsonContent = jsonMatch[1];
      // 处理单引号和双引号的转换
      const formattedJsonContent = jsonContent.replace(/'/g, '"');
      // 尝试解析为 JSON
      return JSON.parse(formattedJsonContent);
    }
    return null;
  } catch (e) {
    console.error("Failed to extract bracket data:", e);
    return null;
  }
};

// 从代码块中提取JSON数据
const chartData = computed(() => extractJsonData(props.message.content));
const hasChartData = computed(() => !!chartData.value);

// 提取中括号内容
const bracketData = computed(() => extractBracketData(props.message.content));
const hasBracketData = computed(
  () => !!bracketData.value && !hasChartData.value
);

// 格式化中括号内JSON内容
const formattedBracketJsonContent = computed(() => {
  if (!bracketData.value) return "";
  try {
    // 处理中括号内容格式化
    const jsonContent = bracketData.value.replace(/'/g, '"');
    // 尝试解析并美化JSON
    const parsedJson = JSON.parse(jsonContent);
    return JSON.stringify(parsedJson, null, 2);
  } catch (e) {
    console.error("Failed to format bracket JSON:", e);
    return bracketData.value;
  }
});

// 提取代码块前后非JSON部分的文本内容
const nonJsonContent = computed(() => {
  if (!hasChartData.value) return [props.message.content];

  const codeBlockRegex = /\$\$\$\$([\s\S]*?)\$\$\$\$/;
  const match = props.message.content.match(codeBlockRegex);

  if (!match) return [props.message.content];

  const parts = props.message.content.split(match[0]);
  return [parts[0]?.trim(), parts[1]?.trim()];
});

// 提取中括号前后的文本内容
const bracketNonJsonContent = computed(() => {
  if (!hasBracketData.value) return ["", ""];

  const bracketRegex = /\[(.*?)\]/s;
  const match = props.message.content.match(bracketRegex);

  if (!match) return [props.message.content, ""];

  const parts = props.message.content.split(match[0]);
  return [parts[0]?.trim(), parts[1]?.split("]")[1]?.trim()];
});

// 为饼图准备数据格式
const pieChartData = computed(() => {
  if (!chartData.value || chartData.value.chart_type !== "pie") return [];
  return chartData.value.pieData;
});

const messageClass = computed(() => {
  const sender = props.message.sender;
  console.log("Sender:", sender);

  if (sender === "user") {
    return "bg-[#404040] text-white";
  } else if (sender === "assistant") {
    return "bg-[#353535] text-white";
  } else if (sender === "system") {
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
