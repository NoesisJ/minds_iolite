<template>
  <base-datepicker
    v-model="localValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :min="min"
    :max="max"
    :shape="shape"
    :size="size"
    :status="status"
    :style="componentStyles"
  />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import BaseDatepicker from "@/components/Form/Datepicker/BaseDatepicker.vue";

const props = defineProps({
  // 提示文本
  placeholder: {
    type: String,
    default: "选择日期",
  },
  // 禁用状态
  disabled: {
    type: Boolean,
    default: false,
  },
  // 最小日期
  min: {
    type: Date,
    default: null,
  },
  // 最大日期
  max: {
    type: Date,
    default: null,
  },
  // 日期选择器形状
  shape: {
    type: String,
    default: "semi-round", // rectangle, semi-round, round
  },
  // 日期选择器大小
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
    type: Date,
    default: null,
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