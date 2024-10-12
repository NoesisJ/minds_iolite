import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import DashBoard from "../views/Dashboard.vue";
import PersonInformation from "../views/PersonInformation.vue";
import Test01 from "../views/Test01.vue";
import Test02 from "../views/Test02.vue";
// 定义路由数组
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: DashBoard,
    children: [],
  },
  {
    path: "/PersonInformation",
    component: PersonInformation,
    children: [],
  },
  {
    path: "/Test01",
    component: Test01,
  },
  {
    path: "/Test02",
    component: Test02,
  },


  
];

// 创建 Router 实例并传入配置
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 的 History 模式
  routes,
});

// 导出 Router 实例
export default router;
