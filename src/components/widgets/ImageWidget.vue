<template>
  <div class="image-widget">
    <img 
      v-if="src" 
      :src="src" 
      :alt="alt" 
      :width="width" 
      :height="height"
      @error="handleImageError"
      class="image-content"
    />
    <div v-else class="placeholder-image">
      <i class="pi pi-image text-gray-400 text-4xl"></i>
      <p class="text-gray-400 mt-2">图片未设置</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageWidget',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: '图片'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: 'auto'
    }
  },
  methods: {
    handleImageError(e) {
      console.warn('图片加载失败:', this.src);
      e.target.alt = '图片加载失败';
    }
  }
}
</script>

<style scoped>
.image-widget {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.image-content {
  max-width: 100%;
  height: auto;
}

.placeholder-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 4px;
  padding: 20px;
  width: 100%;
  min-height: 120px;
}
</style> 