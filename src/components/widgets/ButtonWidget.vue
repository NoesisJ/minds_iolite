<template>
  <base-button
    :status="status"
    :size="size"
    :shape="shape"
    :hero="hero"
    :outline="outline"
    :ghost="ghost"
    :disabled="disabled"
    @click="handleClick"
    :style="componentStyles"
  >
    <i v-if="icon" :class="icon + ' mr-1.5'"></i>
    {{ label }}
  </base-button>
</template>

<script setup>
import { computed } from 'vue';
import BaseButton from '@/components/Form/Buttons/BaseButton.vue';

const props = defineProps({
  // 按钮文本
  label: {
    type: String,
    default: '按钮'
  },
  // 按钮状态类型
  status: {
    type: String,
    default: 'primary' // primary, info, success, warning, danger, basic
  },
  // 按钮大小
  size: {
    type: String,
    default: 'medium' // small, medium, large
  },
  // 按钮形状
  shape: {
    type: String,
    default: 'rectangle' // rectangle, semi-round, round
  },
  // 突出按钮
  hero: {
    type: Boolean,
    default: false
  },
  // 轮廓按钮
  outline: {
    type: Boolean,
    default: false
  },
  // 幽灵按钮
  ghost: {
    type: Boolean,
    default: false
  },
  // 禁用状态
  disabled: {
    type: Boolean,
    default: false
  },
  // 图标
  icon: {
    type: String,
    default: ''
  },
  // 样式对象
  styles: {
    type: Object,
    default: () => ({})
  }
});

const componentStyles = computed(() => {
  return {
    ...props.styles
  };
});

// 点击事件处理
const handleClick = (e) => {
  if (props.disabled) return;
  // 在这里你可以添加事件触发逻辑
  console.log('Button clicked:', props.label);
};
</script>

<style scoped>
.widget-button {
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: 1px solid #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  border: 1px solid #4b5563;
}

.btn-success {
  background-color: #10b981;
  color: white;
  border: 1px solid #059669;
}

.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn-large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}
</style> 