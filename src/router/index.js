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
    component: () => import('../views/PersonalCenter'),
    children:[
      {
        path:'personalInfo',
        component: () => import('../components/PersonalCenterComponents/PersonalInfo')
      },
      {
        path: 'infoEdit',
        component: () => import('../components/PersonalCenterComponents/InfoEdit')
      },
      {
        path: 'userQualification',
        component: () => import('../components/PersonalCenterComponents/UserQualification')
      },
      {
        path: 'modifyPassword',
        component: () => import('../components/PersonalCenterComponents/ModifyPassword')
      }
    ]
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: () => import('../views/ResetPassword')
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
