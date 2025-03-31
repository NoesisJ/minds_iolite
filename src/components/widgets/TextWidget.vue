<template>
  <div class="text-widget" :style="componentStyles">
    {{ content }}
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
    default: '这是一段文本'
  },
  fontSize: String,
  textAlign: String,
  color: String
});

const componentStyles = {
  fontSize: props.fontSize || '16px',
  textAlign: props.textAlign || 'left',
  color: props.color || '#333333'
};
</script> 