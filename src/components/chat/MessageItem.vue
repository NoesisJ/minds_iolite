<!-- components/chat/MessageItem.vue -->
<template>
  <div
    class="flex w-full"
    :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div class="max-w-[80%] rounded-lg p-4" :class="messageClass">
      {{ message.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
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
</script>
