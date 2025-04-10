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
        return "bg-[var(--material-red)] hover:bg-[#0384d1] text-white shadow-lg";
      case "info":
        return "bg-[var(--material-blue)] hover:bg-[#0384d1] text-white shadow-lg";
      case "success":
        return "bg-[var(--material-green)] hover:bg-[#559c1a] text-white shadow-lg";
      case "warning":
        return "bg-[var(--material-yellow)] hover:bg-[#e68f04] text-white shadow-lg";
      case "danger":
        return "bg-[var(--material-red-dark)] hover:bg-[var(--material-red-dark)] text-white shadow-lg";
      default:
        return "bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-lg";
    }
  }

  // Outline 按钮
  if (props.outline) {
    switch (props.status) {
      case "primary":
        return "border-2 border-[var(--material-red)] text-[var(--material-red)] hover:bg-[#0495ee20]";
      case "info":
        return "border-2 border-[var(--material-blue)] text-[var(--material-blue)] hover:bg-[#0495ee20]";
      case "success":
        return "border-2 border-[var(--material-green)] text-[var(--material-green)] hover:bg-[#60af2020]";
      case "warning":
        return "border-2 border-[var(--material-yellow)] text-[var(--material-yellow)] hover:bg-[#ff9f0520]";
      case "danger":
        return "border-2 border-[var(--material-red-dark)] text-[var(--material-red-dark)] hover:bg-[#e91d6320]";
      default:
        return "border-2 border-[var(--material-red)] text-[var(--material-blue)] hover:bg-[#0495ee20]";
    }
  }

  // Ghost 按钮
  if (props.ghost) {
    switch (props.status) {
      case "primary":
        return "text-[var(--material-red)] hover:bg-[#0495ee20]";
      case "info":
        return "text-[var(--material-blue)] hover:bg-[#0495ee20]";
      case "success":
        return "text-[var(--material-green)] hover:bg-[#60af2020]";
      case "warning":
        return "text-[var(--material-yellow)] hover:bg-[#ff9f0520]";
      case "danger":
        return "text-[var(--material-red-dark)] hover:bg-[#e91d6320]";
      default:
        return "text-[var(--material-red)] hover:bg-[#0495ee20]";
    }
  }

  // 默认按钮
  switch (props.status) {
    case "primary":
      return "bg-[var(--material-red)] hover:bg-[#e91d63] text-white";
    case "info":
      return "bg-[var(--material-blue)] hover:bg-[#0384d1] text-white";
    case "success":
      return "bg-[var(--material-green)] hover:bg-[#559c1a] text-white";
    case "warning":
      return "bg-[var(--material-yellow)] hover:bg-[#e68f04] text-white";
    case "danger":
      return "bg-[var(--material-red-dark)] hover:bg-[#cf3341] text-white";
    default:
      return "bg-[var(--material-red)] hover:bg-[#e91d63] text-white";
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
