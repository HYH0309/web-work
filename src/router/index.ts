import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalized,
} from 'vue-router'
// 2. 配置路由
const routes: Array<RouteRecordRaw> = [
  //首页
  {
    path: '/',
    component: () => import('../views/HomeView.vue'),
  },
  //文章
  {
    path: '/article',
    component: () => import('../views/ArticleListView.vue'),
    children: [
      {
        path: '/:id',
        component: () => import('../views/ArticleView.vue'),
      },
    ],
  },
  // 算法可视化列表
  {
    path: '/algorithm-list',
    component: () => import('../views/AlgorithmListView.vue'),
  },
  // 算法可视化展示
  {
    path: '/algorithm/:algoName(bubble|quick|merge)',
    name: 'algorithm',
    component: () => import('../views/AlgorithmView.vue'),
    props: (route: RouteLocationNormalized) => ({
      algorithm: route.params.algoName,
      defaultSpeed: 1,
      enableFullscreen: true,
    }),
  },
  {
    path: '/algorithm/:category(bs|graph|mst)',
    name: 'legacyAlgorithm',
    component: () => import('../views/AlgorithmView.vue'),
    props: (route: RouteLocationNormalized) => ({
      algorithmType: route.params.category,
      defaultSpeed: 3,
      enableFullscreen: true,
    }),
  },
  {
    path: '/aichat',
    component: () => import('../views/AIChatView.vue'),
  },
  {
    path: '/OJ',
    component: () => import('../views/OJListView.vue'),
    children: [
      {
        path: ':id',
        component: () => import('../views/OJView.vue'),
      },
    ],
  },
]
// 1.返回一个 router 实列，为函数，里面有配置项（对象） history
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 3导出路由   然后去 main.ts 注册 router.ts
export default router
