<template>
  <div v-if="show" class="preview-modal-overlay" @click="close">
    <div class="preview-modal-container" @click.stop>
      <div class="preview-modal-header">
        <h2 class="text-lg font-medium">{{ page?.title || "页面预览" }}</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="preview-modal-content">
        <div v-if="page">
          <div
            v-for="(region, index) in page.regions"
            :key="index"
            class="mb-4"
          >
          <div v-if="region.components.length > 0" class="region-content"
               :style="{
                 display: 'flex',
                 flexDirection: region.layout?.direction === 'horizontal' ? 'row' : 'column',
                 gap: `${region.layout?.gap || 8}px`,
                 padding: `${region.layout?.padding || 0}px`
               }"
          >
  <div
    v-for="component in region.components"
    :key="component.id"
    class="component-wrapper"
  >
    <component
      :is="getComponentType(component.type)"
      v-bind="component.props"
      :style="component.styles"
    />
  </div>
</div>
            <div v-else class="empty-region p-4 text-center text-gray-400">
              {{ region.name }} - 空区域
            </div>
          </div>
        </div>
        <div v-else class="p-8 text-center text-gray-500">
          <i class="pi pi-exclamation-circle text-3xl mb-3"></i>
          <div class="text-lg">无法加载页面</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { getComponentType } from "@/utils/componentUtils";

const props = defineProps({
  show: Boolean,
  page: Object,
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

const getComponentWrapperStyle = (region) => {
  if (!region.layout || region.layout.direction === 'vertical') {
    return {
      marginBottom: `${region.layout?.spacing || 8}px`
    };
  }

  return {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${region.layout?.spacing || 8}px`
  };
};
</script>

<style scoped>
.preview-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.preview-modal-container {
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dark .preview-modal-container {
  background-color: #1f2937;
  color: white;
}

.preview-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .preview-modal-header {
  border-color: #4b5563;
}

.preview-modal-content {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.empty-region {
  border: 1px dashed #d1d5db;
  border-radius: 0.25rem;
}

.dark .empty-region {
  border-color: #4b5563;
}
</style>
