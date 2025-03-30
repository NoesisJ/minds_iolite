<template>
  <label :class="['flex items-center', disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer']">
    <div class="relative flex items-center">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="absolute opacity-0 w-0 h-0"
      />
      <span 
        :class="[
          'w-5 h-5 flex items-center justify-center border rounded',
          getCheckboxStyles()
        ]"
      >
        <svg v-if="modelValue" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </span>
    </div>
    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
      <slot></slot>
    </span>
  </label>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: '',
    validator: (val) => ['', 'success', 'warning', 'danger'].includes(val)
  }
});

const emit = defineEmits(['update:modelValue']);

function getCheckboxStyles() {
  if (props.disabled) {
    return props.modelValue 
      ? 'bg-gray-400 border-gray-400' 
      : 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600';
  }
  
  if (props.modelValue) {
    // 选中状态
    switch (props.status) {
      case 'success': return 'bg-green-600 border-green-600';
      case 'warning': return 'bg-yellow-600 border-yellow-600';
      case 'danger': return 'bg-red-600 border-red-600';
      default: return 'bg-blue-600 border-blue-600';
    }
  } else {
    // 未选中状态
    switch (props.status) {
      case 'success': return 'border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30';
      case 'warning': return 'border-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30';
      case 'danger': return 'border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30';
      default: return 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  }
}
</script> 