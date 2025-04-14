<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="[
      'w-full transition-colors outline-none',
      'bg-gray-700 border-gray-600',
      'text-gray-100',
      getShapeClasses(),
      getSizeClasses(),
      getStatusClasses(),
      disabled ? 'opacity-60 cursor-not-allowed bg-gray-800' : '',
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
      return "border-blue-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400";
    case "success":
      return "border-green-400 focus:border-green-400 focus:ring-1 focus:ring-green-400";
    case "warning":
      return "border-yellow-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400";
    case "danger":
      return "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400";
    case "primary":
      return "border-purple-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400";
    default:
      return "border-gray-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400";
  }
}
</script>
