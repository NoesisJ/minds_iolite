import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 定义路由数组
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/:catchAll(.*)', 
    name: 'NotFound',
    component: () => import('../views/Dashboard.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
