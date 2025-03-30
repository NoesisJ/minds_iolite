<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="[
      'w-full transition-colors outline-none',
      getShapeClasses(),
      getSizeClasses(),
      getStatusClasses(),
      disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'
    ]"
  />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  shape: {
    type: String,
    default: 'rectangle',
    validator: (val) => ['rectangle', 'semi-round', 'round'].includes(val)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  },
  status: {
    type: String,
    default: '',
    validator: (val) => ['', 'info', 'success', 'warning', 'danger', 'primary'].includes(val)
  }
});

const emit = defineEmits(['update:modelValue']);

function getShapeClasses() {
  switch (props.shape) {
    case 'round': return 'rounded-full';
    case 'semi-round': return 'rounded-lg';
    default: return 'rounded';
  }
}

function getSizeClasses() {
  switch (props.size) {
    case 'small': return 'px-2 py-1 text-xs';
    case 'large': return 'px-4 py-3 text-base';
    default: return 'px-3 py-2 text-sm';
  }
}

function getStatusClasses() {
  switch (props.status) {
    case 'info':
      return 'border-2 border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100';
    case 'success':
      return 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100';
    case 'warning':
      return 'border-2 border-yellow-500 focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-gray-100';
    case 'danger':
      return 'border-2 border-red-500 focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-gray-100';
    case 'primary':
      return 'border-2 border-purple-500 focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100';
    default:
      return 'border border-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100';
  }
}
</script> 