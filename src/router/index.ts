import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/GalleryView.vue'),
  },
  {
    path: '/article-list',
    component: () => import('@/views/ArticleListView.vue'),
  },
  {
    path: '/article/:id',
    component: () => import('@/views/ArticleView.vue'),
    props: true,
  },
  {
    path: '/visualizer',
    component: () => import('@/views/VisualizerView.vue'),
  },
  // 修改后的OJ路由配置
  {
    path: '/oj-list',
    name: 'OJList',
    component: () => import('@/views/OJListView.vue'),
  },
  {
    path: '/oj/:id',
    name: 'OJDetail',
    component: () => import('@/views/OJView.vue'),
    props: true, // 启用路由参数自动注入props
  },
  {
    path: '/admin',
    component: () => import('@/views/AdminView.vue'),
    children: [
      {
        path: 'articles',
        component: () => import('@/views/admin/ArticleAdminView.vue'),
      },
      {
        path: 'tags',
        component: () => import('@/views/admin/TagAdminView.vue'),
      },
      {
        path: 'oj',
        component: () => import('@/views/admin/OJAdminView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
