<template>
  <div :style="componentStyles">
    <base-radio
      v-model="localValue"
      :value="radioValue"
      :label="label"
      :disabled="disabled"
      :size="size"
      :status="status"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import BaseRadio from "@/components/Form/Inputs/BaseRadio.vue";

const props = defineProps({
  // 单选按钮文本
  label: {
    type: String,
    default: "选项",
  },
  // 单选按钮值
  radioValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  // 禁用状态
  disabled: {
    type: Boolean,
    default: false,
  },
  // 单选按钮大小
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
    type: [String, Number, Boolean],
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