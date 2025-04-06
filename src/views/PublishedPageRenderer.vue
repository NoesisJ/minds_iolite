<template>
  <div class="published-page-container">
    <div v-if="isLoading" class="loading-state">
      <div class="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <i class="pi pi-spin pi-spinner text-5xl mb-4"></i>
        <div class="text-xl mb-2">加载中...</div>
      </div>
    </div>
    <div v-else-if="pageData && pageData.regions" class="page-content">
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
            :is="safeGetComponentType(component.type)" 
            v-bind="component.props || {}" 
            :style="component.styles || {}"
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
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { getComponentType } from '@/utils/componentUtils';

const props = defineProps({
  pageId: {
    type: String,
    default: ''
  }
});

const route = useRoute();
const pageData = ref(null);
const isLoading = ref(true);

// 安全获取组件类型
function safeGetComponentType(type) {
  try {
    return getComponentType(type);
  } catch (error) {
    console.error(`获取组件类型失败: ${type}`, error);
    return 'div'; // 使用安全的fallback
  }
}

// 加载页面数据函数
async function loadPageData() {
  try {
    isLoading.value = true;
    
    // 从存储中获取发布的页面数据
    const publishedPages = JSON.parse(localStorage.getItem('published_pages') || '[]');
    
    // 优先使用props中的pageId
    let pageId = props.pageId;
    
    // 如果props中没有，则尝试从路由元数据中获取
    if (!pageId && route.meta && route.meta.pageId) {
      pageId = route.meta.pageId;
    }
    
    let page;
    
    if (pageId) {
      // 通过ID查找页面
      page = publishedPages.find(p => p.id === pageId);
      console.log('通过ID查找页面:', pageId, page ? '找到' : '未找到');
    }
    
    // 如果没有找到，使用路径匹配（作为备用方法）
    if (!page) {
      page = publishedPages.find(p => p.route === route.path);
      console.log('通过路径查找页面:', route.path, page ? '找到' : '未找到');
    }
    
    // 等待下一个DOM更新周期
    await nextTick();
    
    if (page) {
      console.log('加载页面:', page.title, 'ID:', page.id);
      
      // 确保页面数据有效
      if (!page.pageData || !page.pageData.regions) {
        console.error('页面数据结构无效:', page);
        pageData.value = null;
      } else {
        pageData.value = page.pageData;
        // 设置页面标题
        document.title = page.title || '发布页面';
      }
    } else {
      console.error('未找到页面, 路径:', route.path, '页面ID:', pageId);
      pageData.value = null;
    }
  } catch (error) {
    console.error('加载页面数据出错:', error);
    pageData.value = null;
  } finally {
    isLoading.value = false;
  }
}

// 监听路由变化和props变化，重新加载页面数据
watch([() => route.path, () => props.pageId], () => {
  loadPageData();
});

onMounted(() => {
  loadPageData();
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

.error-message, .loading-state {
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