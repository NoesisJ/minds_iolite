// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import DatepickerView from '@/views/FormViews/DatepickerView.vue';
import ButtonsView from '@/views/FormViews/ButtonsView.vue';
import FormLayoutsView from '@/views/FormViews/FormLayoutsView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/infoCharts",
  },
  {
    path: "/information",
    name: "information",
    component: () => import("../views/InformationView.vue"),
  },
  {
    path: "/infoCharts",
    name: "infoCharts",
    component: () => import("../views/InfoChartsView.vue"),
  },
  {
    path: "/signUp",
    name: "signUp",
    component: () => import("../views/SignUpView.vue"),
  },
  {
    path: "/functional",
    name: "functional",
    children: [
      {
        path: "messages",
        name: "messages",
        component: () => import("../views/FunctionalViews/MessagesView.vue"),
      },
      {
        path: "notifications",
        name: "notifications",
        component: () =>
          import("../views/FunctionalViews/NotificationsView.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("../views/FunctionalViews/SettingsView.vue"),
      },
    ],
  },
  {
    path: "/finance",
    name: "finance",
    children: [
      {
        path: "list",
        name: "financeList",
        component: () => import("../views/FinanceViews/FinanceView.vue"),
      },
      {
        path: "charts",
        name: "financeCharts",
        component: () => import("../views/FinanceViews/FinanceChartsView.vue"),
      },
    ],
  },
  {
    path: "/material",
    name: "material",
    component: () => import("../views/MaterialViews/MaterialHub.vue"),
    children: [
      {
        path: "storage",
        name: "storage",
        component: () => import("../views/MaterialViews/StorageView.vue"),
      },
      {
        path: "requestLogs",
        name: "requestLogs",
        component: () => import("../views/MaterialViews/RequestLogsView.vue"),
      },
    ],
  },
  {
    path: "/agent",
    name: "agent",
    component: () => import("../views/AgentView.vue"),
  },
  {
    path: "/charts",
    name: "charts",
    children: [
      {
        path: "echarts",
        name: "echarts",
        component: () => import("../views/chartViews/echartsView.vue"),
      },
      {
        path: "highcharts",
        name: "highcharts",
        component: () => import("../views/chartViews/highchartsView.vue"),
      },
    ],
  },
  {
    path: "/forms",
    name: "forms",
    children: [
      {
        path: "inputs",
        name: "form-inputs",
        component: () => import("../views/FormViews/InputViews.vue"),
      },
      {
        path: 'datepicker',
        name: 'form-datepicker',
        component: () => import("../views/FormViews/DatepickerView.vue"),
      },
      {
        path: 'buttons',
        name: 'form-buttons',
        component: () => import("../views/FormViews/ButtonsView.vue"),
      },
      {
        path: 'layouts',
        name: 'form-layouts',
        component: () => import("../views/FormViews/FormLayoutsView.vue"),
      }
    ],
  },
  {
    path: '/designer',
    name: 'designer',
    component: () => import("@/views/designer/DesignerView.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
