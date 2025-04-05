<template>
  <div class="w-[var(--sidebar-width)] bg-[var(--material-bg-dark)] py-3">
    <TogglePanel
      v-for="item in navMenus"
      :key="item.label"
      :is-active="isItemActive(item)"
      :default-open="shouldExpand(item)"
      :route-path="item.route"
      :has-children="!!item.items"
      @header-click="navigateTo"
    >
      <template #header>
        <span :class="item.icon" />
        <span class="menu-label">{{ item.label }}</span>
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
            <span class="menu-label">{{ subItem.label }}</span>
          </template>
        </TogglePanel>
      </template>
    </TogglePanel>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import TogglePanel from "@/components/ui/TogglePanel.vue";

const router = useRouter();

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  items?: NavItem[];
}

const isItemActive = (item: NavItem) => {
  console.log(router.currentRoute.value.path);
  console.log(item.route);
  if (item.route) return router.currentRoute.value.path === item.route;
  return item.items?.some(
    (subItem) => router.currentRoute.value.path === subItem.route
  );
};

const isSubItemActive = (subItem: NavItem) => {
  return router.currentRoute.value.path === subItem.route;
};

const shouldExpand = (item: NavItem) => {
  return item.items?.some(
    (subItem) => router.currentRoute.value.path === subItem.route
  );
};

const navigateTo = (path: string) => {
  if (path) router.push(path);
};

const navMenus = [
  {
    label: "人员管理",
    icon: "pi pi-users",
    route: "/information",
  },
  {
    label: "人员分布",
    icon: "pi pi-chart-bar",
    route: "/infoCharts",
  },
  {
    label: "财务管理",
    icon: "pi pi-dollar",
    items: [
      {
        label: "财务数据",
        icon: "pi pi-box",
        route: "/finance/list",
      },
      {
        label: "财务统计",
        icon: "pi pi-chart-pie",
        route: "/finance/charts",
      },
    ],
  },
  {
    label: "物资管理",
    icon: "pi pi-database",
    items: [
      {
        label: "在库物资",
        icon: "pi pi-inbox",
        route: "/material/storage",
      },
      {
        label: "入库审批",
        icon: "pi pi-filter",
        route: "/material/requestLogs",
      },
    ],
  },
  {
    label: "报名管理",
    icon: "pi pi-cog",
    route: "/signUp",
  },
  {
    label: "AI助手",
    icon: "pi pi-comments",
    route: "/agent",
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
    label: "设计器",
    icon: "pi pi-pencil",
    route: "/designer",
  },
];
</script>
