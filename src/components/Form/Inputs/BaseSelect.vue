<template>
  <div class="relative">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      :required="required"
      :class="[
        'appearance-none w-full transition-colors outline-none',
        getShapeClasses(),
        getSizeClasses(),
        getStatusClasses(),
        disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'
      ]"
    >
      <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    
    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg class="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
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
  },
  shape: {
    type: String,
    default: 'rectangle',
    validator: (val) => ['rectangle', 'semi-round', 'round'].includes(val)
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