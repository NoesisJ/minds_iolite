<template>
  <button
    :disabled="disabled"
    :class="[
      'transition-colors focus:outline-none',
      getStatusClasses(),
      getSizeClasses(),
      getShapeClasses(),
      disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
    ]"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  status: {
    type: String,
    default: "primary",
    validator: (val) =>
      ["primary", "info", "success", "warning", "danger", "basic"].includes(
        val
      ),
  },
  size: {
    type: String,
    default: "medium",
    validator: (val) => ["small", "medium", "large"].includes(val),
  },
  shape: {
    type: String,
    default: "rectangle",
    validator: (val) => ["rectangle", "semi-round", "round"].includes(val),
  },
  hero: {
    type: Boolean,
    default: false,
  },
  outline: {
    type: Boolean,
    default: false,
  },
  ghost: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

function getStatusClasses() {
  // Hero 按钮
  if (props.hero) {
    switch (props.status) {
      case "primary":
        return "bg-purple-600 hover:bg-purple-700 text-white shadow-lg";
      case "info":
        return "bg-blue-500 hover:bg-blue-600 text-white shadow-lg";
      case "success":
        return "bg-green-500 hover:bg-green-600 text-white shadow-lg";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg";
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white shadow-lg";
      default:
        return "bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-lg";
    }
  }

  // Outline 按钮
  if (props.outline) {
    switch (props.status) {
      case "primary":
        return "border-2 border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20";
      case "info":
        return "border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
      case "success":
        return "border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20";
      case "warning":
        return "border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20";
      case "danger":
        return "border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20";
      default:
        return "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800";
    }
  }

  // Ghost 按钮
  if (props.ghost) {
    switch (props.status) {
      case "primary":
        return "text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20";
      case "info":
        return "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
      case "success":
        return "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20";
      case "warning":
        return "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20";
      case "danger":
        return "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20";
      default:
        return "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800";
    }
  }

  // 默认按钮
  switch (props.status) {
    case "primary":
      return "bg-purple-500 hover:bg-purple-600 text-white";
    case "info":
      return "bg-blue-500 hover:bg-blue-600 text-white";
    case "success":
      return "bg-green-500 hover:bg-green-600 text-white";
    case "warning":
      return "bg-yellow-500 hover:bg-yellow-600 text-white";
    case "danger":
      return "bg-red-500 hover:bg-red-600 text-white";
    default:
      return "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white";
  }
}

function getSizeClasses() {
  switch (props.size) {
    case "small":
      return "px-3 py-1 text-xs";
    case "large":
      return "px-5 py-3 text-base";
    default:
      return "px-4 py-2 text-sm";
  }
}

function getShapeClasses() {
  switch (props.shape) {
    case "round":
      return "rounded-full";
    case "semi-round":
      return "rounded-lg";
    default:
      return "rounded";
  }
}
</script>
