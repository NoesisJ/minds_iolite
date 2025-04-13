<!-- components/chat/MessageItem.vue -->
<template>
  <div
    class="flex w-full select-text group"
    :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div class="max-w-[80%] rounded-lg p-4 relative" :class="messageClass">
      {{ message.content }}
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

const props = defineProps<{
  message: Message;
}>();

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
