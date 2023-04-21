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
    component: () => import('../views/MedicalService'),
    children: [
      {
        path: 'defaultRegistry/:param1/:param2',
        redirect:to =>{
          return {path:'/medicalService/defaultRegistry',query:{hospId:to.params.param1,deptId:to.params.param2}}
        }
      },
      {
        path: 'defaultRegistry',
        component: () => import('../components/MedicalServiceComponent/DefaultRegistry'),
      }
    ]
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
        path: 'hospitalInfoEdit',
        component: () => import('../components/PersonalCenterComponents/HospitalInfoEdit')
      },
      {
        path: 'doctorInfoEdit',
        component: () => import('../components/PersonalCenterComponents/DoctorInfoEdit')
      },
      {
        path: 'userQualification',
        component: () => import('../components/PersonalCenterComponents/UserQualification')
      },

      {
        path: 'modifyPassword',
        component: () => import('../components/PersonalCenterComponents/ModifyPassword')
      },
      
      {
        path: 'hospitalQualHandle',
        component: () => import('../components/PersonalCenterComponents/HospitalQualHandle')
      },

      {
        path: 'userAppointMana',
        component: () => import('../components/PersonalCenterComponents/UserAppointMana')
      },

    ]
  },
  {
    path: '/appointManaView',
    name: 'appointManaView',
    component: () => import('../views/AppointManaView')
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
