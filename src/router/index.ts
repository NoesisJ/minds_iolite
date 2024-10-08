import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import DashBoard from "../views/Dashboard.vue";
import PersonInformation from "../views/PersonInformation.vue";
// 定义路由数组
const routes: Array<RouteRecordRaw> = [
  {
    path: "/DashBoard",
    component: DashBoard,
    children: [],
  },
  {
    path: "/",
    component: PersonInformation,
    children: [],
  },


  
];

// 创建 Router 实例并传入配置
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 的 History 模式
  routes,
});

// 导出 Router 实例
export default router;
