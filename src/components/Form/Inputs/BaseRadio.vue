<template>
  <label
    :class="[
      'flex items-center',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    ]"
  >
    <div class="relative flex items-center">
      <input
        type="radio"
        :name="name"
        :value="value"
        :checked="modelValue === value"
        :disabled="disabled"
        @change="$emit('update:modelValue', value)"
        class="absolute opacity-0 w-0 h-0"
      />
      <span
        :class="[
          'w-5 h-5 flex items-center justify-center border rounded-full',
          getRadioStyles(),
        ]"
      >
        <span
          v-if="modelValue === value"
          class="w-2.5 h-2.5 rounded-full bg-white"
        ></span>
      </span>
    </div>
    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
      <slot></slot>
    </span>
  </label>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "",
    validator: (val) =>
      ["", "success", "warning", "danger", "primary"].includes(val),
  },
});

const emit = defineEmits(["update:modelValue"]);

function getRadioStyles() {
  if (props.disabled) {
    return props.modelValue === props.value
      ? "bg-gray-400 border-gray-400"
      : "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600";
  }

  if (props.modelValue === props.value) {
    // 选中状态
    switch (props.status) {
      case "success":
        return "bg-green-600 border-green-600";
      case "warning":
        return "bg-yellow-600 border-yellow-600";
      case "danger":
        return "bg-red-600 border-red-600";
      case "primary":
        return "bg-purple-600 border-purple-600";
      default:
        return "bg-blue-600 border-blue-600";
    }
  } else {
    // 未选中状态
    switch (props.status) {
      case "success":
        return "border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30";
      case "warning":
        return "border-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30";
      case "danger":
        return "border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30";
      case "primary":
        return "border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30";
      default:
        return "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800";
    }
  }
}
</script>
