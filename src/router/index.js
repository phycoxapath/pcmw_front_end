import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView')
  },
  {
    path: '/medicalService',
    name: 'medicalService',
    component: () => import('../views/MedicalService')
  },
  {
    path: '/personalCenter',
    name: 'personalCenter',
    component: () => import('../views/PersonalCenter')

  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
