import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// 2. 配置路由
const routes: Array<RouteRecordRaw> = [
  //首页
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
  },
  //文章
  {
    path: '/article-list',
    component: () => import('@/views/ArticleListView.vue'),
  },
  {
    path: '/article/:id',
    component: () => import('@/components/blog/ArticleShow.vue'),
  },
  // 算法可视化列表
  {
    path: '/visualizer',
    component: () => import('@/views/VisualizerView.vue'),
  },
  {
    path: '/aichat',
    component: () => import('@/views/AIChatView.vue'),
  },
  {
    path: '/oj-list',
    component: () => import('@/views/OJListView.vue'),
  },
  {
    path: '/oj/:id',
    component: () => import('@/views/OJView.vue'),
  },
]
// 1.返回一个 router 实列，为函数，里面有配置项（对象） history
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 3导出路由   然后去 main.ts 注册 router.ts
export default router
