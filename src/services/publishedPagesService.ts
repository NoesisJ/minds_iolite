import { RouteRecordRaw } from "vue-router";
import { defineStore } from "pinia";
import router from "@/router";

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
export const usePublishedMenuStore = defineStore("publishedMenu", {
  state: () => ({
    dynamicMenuItems: [] as MenuItem[],
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
    },
  },
});

// 加载已发布页面
export function loadPublishedPages() {
  try {
    const publishedPages = JSON.parse(
      localStorage.getItem("published_pages") || "[]"
    );
    const menuStore = usePublishedMenuStore();

    // 清空现有动态菜单
    menuStore.clearMenuItems();

    // 遍历所有已发布页面
    publishedPages.forEach((page: PublishedPage) => {
      // 1. 动态注册路由
      const route: RouteRecordRaw = {
        path: page.route,
        name: `published-${page.id}`,
        component: () => import("@/views/PublishedPageRenderer.vue"),
        meta: {
          pageId: page.id,
          isPublished: true,
          title: page.title,
        },
      };

      // 避免路由重复添加
      try {
        if (router.hasRoute(`published-${page.id}`)) {
          router.removeRoute(`published-${page.id}`);
        }
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
          route: page.route,
        });
      }
      // 父菜单处理由SidebarLayout.vue中负责
    });

    return publishedPages;
  } catch (error) {
    console.error("加载已发布页面失败:", error);
    return [];
  }
}

// 发布页面
export async function publishPage(page: any, settings: PublishSettings) {
  try {
    const publishedPages = JSON.parse(
      localStorage.getItem("published_pages") || "[]"
    );

    // 检查路径是否已存在
    const existingPageIndex = publishedPages.findIndex(
      (p: PublishedPage) => p.route === settings.route
    );

    // 如果路径已存在
    if (existingPageIndex !== -1) {
      // 返回一个特殊状态，让调用者知道需要确认覆盖
      return {
        needsOverwriteConfirmation: true,
        existingPage: publishedPages[existingPageIndex],
        // 提供一个确认覆盖的函数
        confirmOverwrite: () => {
          // 移除现有页面
          publishedPages.splice(existingPageIndex, 1);

          // 创建新的发布页面记录
          const publishedPage: PublishedPage = {
            id: Date.now().toString(),
            pageId: page.id,
            title: settings.title,
            icon: settings.icon,
            route: settings.route,
            parentMenu: settings.parentMenu,
            pageData: JSON.parse(JSON.stringify(page)),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          publishedPages.push(publishedPage);
          localStorage.setItem(
            "published_pages",
            JSON.stringify(publishedPages)
          );

          // 重新加载页面
          loadPublishedPages();

          return publishedPage;
        },
      };
    }

    // 正常流程 - 路径不存在时
    const publishedPage: PublishedPage = {
      id: Date.now().toString(),
      pageId: page.id,
      title: settings.title,
      icon: settings.icon,
      route: settings.route,
      parentMenu: settings.parentMenu,
      pageData: JSON.parse(JSON.stringify(page)),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    publishedPages.push(publishedPage);
    localStorage.setItem("published_pages", JSON.stringify(publishedPages));

    // 重新加载页面
    loadPublishedPages();

    return publishedPage;
  } catch (error) {
    console.error("发布页面失败:", error);
    throw error;
  }
}

// 取消发布页面
export function unpublishPage(pageId: string) {
  try {
    const publishedPages = JSON.parse(
      localStorage.getItem("published_pages") || "[]"
    );
    const pageIndex = publishedPages.findIndex(
      (p: PublishedPage) => p.id === pageId
    );

    if (pageIndex === -1) {
      throw new Error("未找到要取消发布的页面");
    }

    const page = publishedPages[pageIndex];

    // 移除路由
    if (router.hasRoute(`published-${page.id}`)) {
      router.removeRoute(`published-${page.id}`);
    }

    // 从数组中移除
    publishedPages.splice(pageIndex, 1);
    localStorage.setItem("published_pages", JSON.stringify(publishedPages));

    // 重新加载页面
    loadPublishedPages();

    return true;
  } catch (error) {
    console.error("取消发布页面失败:", error);
    throw error;
  }
}
