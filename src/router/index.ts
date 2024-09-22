import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 定义路由数组
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'), // 懒加载组件
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'), // 懒加载组件
  },
  {
    path: '/:catchAll(.*)', // 匹配所有未定义路由的页面
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
];

// 创建 Router 实例并传入配置
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 的 History 模式
  routes,
});

// 导出 Router 实例
export default router;
