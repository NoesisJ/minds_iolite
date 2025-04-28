<template>
  <base-input
    v-model="localValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :shape="shape"
    :size="size"
    :status="status"
    :style="componentStyles"
  />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import BaseInput from "@/components/Form/Inputs/BaseInput.vue";

const props = defineProps({
  // 输入框类型
  type: {
    type: String,
    default: "text", // text, password, email, number 等
  },
  // 提示文本
  placeholder: {
    type: String,
    default: "请输入",
  },
  // 禁用状态
  disabled: {
    type: Boolean,
    default: false,
  },
  // 输入框形状
  shape: {
    type: String,
    default: "rectangle", // rectangle, semi-round, round
  },
  // 输入框大小
  size: {
    type: String,
    default: "medium", // small, medium, large
  },
  // 状态类型
  status: {
    type: String,
    default: "", // "", primary, info, success, warning, danger
  },
  // 初始值
  value: {
    type: [String, Number],
    default: "",
  },
  // 样式对象
  styles: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:value", "input", "change"]);

// 本地值，用于实现双向绑定
const localValue = ref(props.value);

// 监听props变化更新本地值
watch(() => props.value, (newValue) => {
  localValue.value = newValue;
});

// 监听本地值变化向上提交事件
watch(localValue, (newValue) => {
  emit("update:value", newValue);
  emit("input", newValue);
  emit("change", newValue);
});

// 组合样式
const componentStyles = computed(() => {
  return {
    ...props.styles,
  };
});
</script> 