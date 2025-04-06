import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import router from '@/router';

// 菜单项类型定义
export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  items?: MenuItem[];
}

// 发布页面类型定义
export interface PublishedPage {
  id: string;
  pageId: string;
  title: string;
  icon: string;
  route: string;
  parentMenu: string;
  pageData: any;
  createdAt: number;
  updatedAt: number;
}

// 发布设置类型
export interface PublishSettings {
  title: string;
  icon: string;
  parentMenu: string;
  route: string;
}

// 使用Pinia存储发布的菜单项
export const usePublishedMenuStore = defineStore('publishedMenu', {
  state: () => ({
    dynamicMenuItems: [] as MenuItem[]
  }),
  actions: {
    addMenuItem(item: MenuItem) {
      // 检查是否已存在
      const exists = this.dynamicMenuItems.some(
        (menuItem) => menuItem.route === item.route
      );
      
      if (!exists) {
        this.dynamicMenuItems.push(item);
      }
    },
    clearMenuItems() {
      this.dynamicMenuItems = [];
    }
  }
});

// 加载已发布页面
export function loadPublishedPages() {
  try {
    const publishedPages = JSON.parse(localStorage.getItem('published_pages') || '[]');
    const menuStore = usePublishedMenuStore();
    
    // 清空现有动态菜单
    menuStore.clearMenuItems();
    
    // 首先移除所有已注册的动态路由
    try {
      const routes = router.getRoutes();
      routes.forEach(route => {
        if (route.name && String(route.name).startsWith('published-')) {
          router.removeRoute(route.name);
        }
      });
    } catch (err) {
      console.error('移除现有路由失败:', err);
    }
    
    // 遍历所有已发布页面
    publishedPages.forEach((page: PublishedPage) => {
      // 只注册数据结构完整的页面
      if (!page.pageData || !page.pageData.regions) {
        console.warn('页面数据结构不完整，跳过注册:', page.id, page.title);
        return;
      }
      
      // 1. 动态注册路由
      const route: RouteRecordRaw = {
        path: page.route,
        name: `published-${page.id}`,
        component: () => import('@/views/PublishedPageRenderer.vue'),
        props: { 
          pageId: page.id 
        },
        meta: {
          pageId: page.id,
          isPublished: true,
          title: page.title
        }
      };
      
      // 添加路由
      try {
        router.addRoute(route);
        console.log(`动态添加路由成功: ${page.route} (ID: ${page.id})`);
      } catch (err) {
        console.error(`添加路由失败: ${page.route}`, err);
      }
      
      // 2. 添加到侧边栏菜单
      // 如果没有父菜单，添加为顶级菜单
      if (!page.parentMenu) {
        menuStore.addMenuItem({
          label: page.title,
          icon: page.icon,
          route: page.route
        });
      }
      // 父菜单处理由SidebarLayout.vue中负责
    });
    
    return publishedPages;
  } catch (error) {
    console.error('加载已发布页面失败:', error);
    return [];
  }
}

// 发布页面
export function publishPage(page: any, settings: PublishSettings) {
  try {
    const publishedPages = JSON.parse(localStorage.getItem('published_pages') || '[]');
    
    // 检查路径是否已存在
    if (publishedPages.some((p: PublishedPage) => p.route === settings.route)) {
      throw new Error('该路由路径已被使用，请更换');
    }
    
    // 创建发布页面记录
    const publishedPage: PublishedPage = {
      id: Date.now().toString(),
      pageId: page.id,
      title: settings.title,
      icon: settings.icon,
      route: settings.route,
      parentMenu: settings.parentMenu,
      pageData: JSON.parse(JSON.stringify(page)), // 深拷贝页面数据
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    publishedPages.push(publishedPage);
    localStorage.setItem('published_pages', JSON.stringify(publishedPages));
    
    // 重新加载页面
    loadPublishedPages();
    
    return publishedPage;
  } catch (error) {
    console.error('发布页面失败:', error);
    throw error;
  }
}

// 取消发布页面
export function unpublishPage(pageId: string) {
  try {
    const publishedPages = JSON.parse(localStorage.getItem('published_pages') || '[]');
    const pageIndex = publishedPages.findIndex((p: PublishedPage) => p.id === pageId);
    
    if (pageIndex === -1) {
      throw new Error('未找到要取消发布的页面');
    }
    
    const page = publishedPages[pageIndex];
    
    // 移除路由
    if (router.hasRoute(`published-${page.id}`)) {
      router.removeRoute(`published-${page.id}`);
    }
    
    // 从数组中移除
    publishedPages.splice(pageIndex, 1);
    localStorage.setItem('published_pages', JSON.stringify(publishedPages));
    
    // 重新加载页面
    loadPublishedPages();
    
    return true;
  } catch (error) {
    console.error('取消发布页面失败:', error);
    throw error;
  }
} 