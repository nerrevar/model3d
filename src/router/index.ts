import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/add',
    name: 'Add model',
    component: () => import('@/views/AddView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.afterEach(
  (from, to) => document.title = `Model 3D - ${String(to.name || 'Home')}`
)

export default router
