import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ChartsView from "../views/ChartsView.vue";
import InformationView from "../views/InformationView.vue";
import MessagesView from "../views/functionalViews/MessagesView.vue";
import NotificationsView from "../views/functionalViews/NotificationsView.vue";
import SettingsView from "../views/functionalViews/SettingsView.vue";
import Test01 from "../views/Test01.vue";
import Test02 from "../views/Test02.vue";
// 定义路由数组
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/ChartsView",
  },
  {
    path: "/ChartsView",
    component: ChartsView,
    children: [],
  },
  {
    path: "/InformationView",
    component: InformationView,
  },
  {
    path: "/Test01",
    component: Test01,
  },
  {
    path: "/Test02",
    component: Test02,
  },
  {
    path: "/MessagesView",
    component: MessagesView,
  },
  {
    path: "/NotificationsView",
    component: NotificationsView,
  },
  {
    path: "/SettingsView",
    component: SettingsView,
  },
];

// 创建 Router 实例并传入配置
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 的 History 模式
  routes,
});

// 导出 Router 实例
export default router;
