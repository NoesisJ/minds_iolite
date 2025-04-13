<template>
  <div
    class="w-[var(--sidebar-width)] bg-[var(--material-bg-dark)] pt-3 overflow-hidden flex flex-col justify-between"
  >
    <div class="overflow-auto flex-1 custom-scrollbar">
      <TogglePanel
        v-for="item in combinedNavMenus"
        :key="item.label"
        :is-active="isItemActive(item)"
        :default-open="shouldExpand(item)"
        :route-path="item.route"
        :has-children="!!item.items"
        @header-click="navigateTo"
      >
        <template #header>
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </template>

        <template v-if="item.items" #content>
          <TogglePanel
            v-for="subItem in item.items"
            :key="subItem.label"
            :is-active="isSubItemActive(subItem)"
            :route-path="subItem.route"
            @header-click="navigateTo"
          >
            <template #header>
              <span :class="subItem.icon" />
              <span class="ml-2">{{ subItem.label }}</span>
            </template>
          </TogglePanel>
        </template>
      </TogglePanel>
    </div>

    <div
      class="w-full flex flex-row items-center px-4 py-3 gap-6 bg-[var(--material-item-bg)] hover:bg-[var(--material-item-bg-hover)]"
      @click="navigateTo('/import')"
    >
      <button
        class="bg-[var(--material-red-dark)] text-white rounded-full w-12 h-8 p-2 transition-colors duration-300 hover:bg-[var(--material-red)] items-center flex justify-center"
      >
        <span class="pi pi-cog" />
      </button>
      <span class="text-gray-400 mt-1">设置</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import TogglePanel from "@/components/ui/TogglePanel.vue";
import { loadPublishedPages } from "@/services/publishedPagesService";
import { usePublishedMenuStore } from "@/services/publishedPagesService";
import { PublishedPage } from "@/services/publishedPagesService";

const router = useRouter();
const publishedMenuStore = usePublishedMenuStore();

// 定义NavItem接口
interface NavItem {
  label: string;
  icon: string;
  route?: string;
  items?: NavItem[];
}

// 原始静态菜单
const navMenus: NavItem[] = [
  {
    label: "AI助手",
    icon: "pi pi-comments",
    route: "/agent",
  },
  {
    label: "数据分析设计器",
    icon: "pi pi-pencil",
    route: "/designer",
  },
  {
    label: "图表",
    icon: "pi pi-chart-bar",
    items: [
      {
        label: "ECharts",
        icon: "pi pi-chart-bar",
        route: "/charts/echarts",
      },
      {
        label: "HighCharts",
        icon: "pi pi-chart-bar",
        route: "/charts/highcharts",
      },
    ],
  },
  {
    label: "表单",
    icon: "pi pi-pencil",
    items: [
      {
        label: "输入框",
        icon: "pi pi-pencil",
        route: "/forms/inputs",
      },
      {
        label: "日期选择器",
        icon: "pi pi-pencil",
        route: "/forms/datepicker",
      },
      {
        label: "按钮",
        icon: "pi pi-pencil",
        route: "/forms/buttons",
      },
      {
        label: "表单布局",
        icon: "pi pi-pencil",
        route: "/forms/layouts",
      },
    ],
  },
  {
    label: "表格",
    icon: "pi pi-table",
    route: "/table",
  },
  {
    label: "ECharts渲染",
    icon: "pi pi-upload",
    route: "/123",
  },
];

// 合并静态和动态菜单
const combinedNavMenus = computed(() => {
  // 创建深拷贝以避免修改原始菜单
  const menusCopy: NavItem[] = JSON.parse(JSON.stringify(navMenus));

  // 处理已发布页面的父菜单映射
  const publishedPages: PublishedPage[] = JSON.parse(
    localStorage.getItem("published_pages") || "[]"
  );

  // 将已发布页面添加到父菜单
  publishedPages.forEach((page: PublishedPage) => {
    if (page.parentMenu) {
      // 查找父菜单
      const parentMenu: NavItem | undefined = menusCopy.find(
        (menu: NavItem) => menu.label === page.parentMenu
      );
      if (parentMenu) {
        if (!parentMenu.items) parentMenu.items = [];

        // 检查是否已存在
        const exists = parentMenu.items.some(
          (item: NavItem) => item.route === page.route
        );
        if (!exists) {
          parentMenu.items.push({
            label: page.title,
            icon: page.icon,
            route: page.route,
          });
        }
      }
    }
  });

  // 合并顶级菜单
  return [...menusCopy, ...publishedMenuStore.dynamicMenuItems];
});

const isItemActive = (item: NavItem): boolean => {
  if (item.route) return router.currentRoute.value.path === item.route;
  return (
    item.items?.some(
      (subItem: NavItem) => router.currentRoute.value.path === subItem.route
    ) || false
  );
};

const isSubItemActive = (subItem: NavItem): boolean => {
  return router.currentRoute.value.path === subItem.route;
};

const shouldExpand = (item: NavItem): boolean => {
  return (
    item.items?.some(
      (subItem: NavItem) => router.currentRoute.value.path === subItem.route
    ) || false
  );
};

const navigateTo = (path: string): void => {
  if (path) router.push(path);
};

// 在应用启动时加载已发布页面
onMounted(async () => {
  await loadPublishedPages();
});
</script>
