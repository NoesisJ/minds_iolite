<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="[
      'w-full transition-colors outline-none',
      'bg-white dark:bg-gray-700 border dark:border-gray-600',
      'text-gray-900 dark:text-gray-100',
      getShapeClasses(),
      getSizeClasses(),
      getStatusClasses(),
      disabled ? 'opacity-60 cursor-not-allowed' : '',
    ]"
  ></textarea>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  rows: {
    type: [Number, String],
    default: 5,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  shape: {
    type: String,
    default: "rectangle",
    validator: (val) => ["rectangle", "semi-round", "round"].includes(val),
  },
  size: {
    type: String,
    default: "medium",
    validator: (val) => ["small", "medium", "large"].includes(val),
  },
  status: {
    type: String,
    default: "",
    validator: (val) =>
      ["", "info", "success", "warning", "danger", "primary"].includes(val),
  },
});

const emit = defineEmits(["update:modelValue"]);

function getShapeClasses() {
  switch (props.shape) {
    case "round":
      return "rounded-xl";
    case "semi-round":
      return "rounded-lg";
    default:
      return "rounded";
  }
}

function getSizeClasses() {
  switch (props.size) {
    case "small":
      return "px-2 py-1 text-xs";
    case "large":
      return "px-4 py-3 text-base";
    default:
      return "px-3 py-2 text-sm";
  }
}

function getStatusClasses() {
  switch (props.status) {
    case "info":
      return "border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
    case "success":
      return "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500";
    case "warning":
      return "border-yellow-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500";
    case "danger":
      return "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    case "primary":
      return "border-purple-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500";
    default:
      return "border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400";
  }
}
</script>
