<template>
  <button 
    class="widget-button" 
    :class="[`btn-${type}`, `btn-${size}`]"
    :style="componentStyles"
  >
    {{ label }}
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '按钮'
  },
  type: {
    type: String,
    default: 'primary' // primary, secondary, success, warning, danger
  },
  size: {
    type: String,
    default: 'medium' // small, medium, large
  }
});

const componentStyles = {};
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