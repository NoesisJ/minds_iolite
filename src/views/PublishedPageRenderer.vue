<template>
  <div class="published-page-container">
    <div v-if="pageData" class="page-content">
      <div 
        v-for="(region, index) in pageData.regions" 
        :key="index" 
        class="region-wrapper"
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
    </div>
    <div v-else class="error-message">
      <div class="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <i class="pi pi-exclamation-circle text-5xl mb-4"></i>
        <div class="text-xl mb-2">页面不存在或已被删除</div>
        <p class="mb-4">请检查页面是否已发布或联系管理员</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getComponentType } from '@/utils/componentUtils';

const route = useRoute();
const pageData = ref(null);

onMounted(async () => {
  // 从存储中获取发布的页面数据
  const publishedPages = JSON.parse(localStorage.getItem('published_pages') || '[]');
  // 使用路径匹配页面
  const page = publishedPages.find(p => p.route === route.path);
  
  if (page) {
    pageData.value = page.pageData;
    // 设置页面标题
    document.title = page.title || '发布页面';
  }
});
</script>

<style scoped>
.published-page-container {
  min-height: calc(100vh - 56px);
  background-color: #f9fafb;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.region-wrapper {
  margin-bottom: 16px;
}

.component-wrapper {
  margin-bottom: 12px;
}

.error-message {
  text-align: center;
  padding: 40px 0;
}

/* 深色模式支持 */
:global(.dark) .published-page-container {
  background-color: #111827;
}

:global(.dark) .page-content {
  background-color: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style> 