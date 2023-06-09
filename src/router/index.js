import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
        component: () => import('../components/MedicalServiceComponents/DefaultRegistry'),
      },
      {
        path: 'greenChannelRegistry',
        component: () => import('../components/MedicalServiceComponents/GreenChannelRegistry'),
      },
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
    path: '/hospitalVaccineMana',
    redirect: '/hospitalVaccineMana/addNewVaccine',
  },
  {
    path: '/hospitalVaccineMana',
    name: 'hospitalVaccineMana',
    component: () => import('../views/HospitalVaccineMana'),
    children: [
      {
        path: 'addNewVaccine',
        component: () => import('../components/HospitalVaccineComponents/AddNewVaccine'),
      },
      {
        path: 'modifyVaccine',
        component: () => import('../components/HospitalVaccineComponents/ModifyVaccine'),
      },
      {
        path: 'vaccineAppointmentMana',
        component: () => import('../components/HospitalVaccineComponents/VaccineAppointmentMana'),
      },
    ]
  },
  {
    path: '/greenChannelManaView',
    name: 'greenChannelManaView',
    component: () => import('../views/GreenChannelManaView')
  },
  {
    path: "/userVaccineAppoint",
    redirect: "/userVaccineAppoint/vaccineAppoint",
  },
  {
    path: '/userVaccineAppoint',
    name: 'userVaccineAppoint',
    component: () => import('../views/UserVaccineAppoint'),
    children: [
      {
        path: 'vaccineAppoint',
        component: () => import('../components/UserVaccineAppointComponents/VaccineAppoint'),
      },
      {
        path: 'appointHistory',
        component: () => import('../components/UserVaccineAppointComponents/AppointHistory'),
      },
    ],
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: () => import('../views/ResetPassword')
  },
  {
    path: '/shoppingMall',
    redirect: '/shoppingMall/mallBrowse'
  },
  {
    path: '/shoppingMall',
    name: 'shoppingMall',
    component: () => import('../views/ShoppingMall'),
    children: [
      {
        path: 'mallBrowse',
        component: () => import('../components/MallComponents/MallBrowse'),
      },
      {
        path: 'userOrder',
        component: () => import('../components/MallComponents/UserOrder'),
      },
    ]
  },
  {
    path: '/administratorLogin',
    name: 'administratorLogin',
    component: () => import('../views/AdminViews/AdministratorLogin')
  },
  {
    path: '/adminHome',
    redirect: '/adminHome/hospitalMana',
  },
  {
    path: '/adminHome',
    name: 'adminHome',
    component: () => import('../views/AdminViews/AdminHome'),
    children: [
      {
        path: 'hospitalMana',
        component: () => import('../components/AdministratorServiceComponents/HospitalMana'),
      },
      {
        path: 'userMana',
        component: () => import('../components/AdministratorServiceComponents/UserMana'),
      },
    ]
  },
  {
    path: '/shoppingMana',
    redirect: '/shoppingMana/addNewCommodity'
  },
  {
    path: '/shoppingMana',
    name: 'shoppingMana',
    component: () => import('../views/AdminViews/ShoppingMana'),
    children: [
      {
        path: 'addNewCommodity',
        component: () => import('../components/ShoppingManaComponents/AddNewCommodity'),
      },
      {
        path: 'modifyCommodity',
        component: () => import('../components/ShoppingManaComponents/ModifyCommodity'),
      },
      {
        path: 'orderMana',
        component: () => import('../components/ShoppingManaComponents/OrderMana'),
      },
    ]
  },
  {
    path: '/hospitalDeptMana',
    redirect: '/hospitalDeptMana/doctorMana'
  },
  {
    path: '/hospitalDeptMana',
    name: 'hospitalDeptMana',
    component: () => import('../views/HospitalDeptMana'),
    children: [
      {
        path: 'hospitalQualHandle',
        component: () => import('../components/HospitalDeptManaComponents/HospitalQualHandle'),
      },
      {
        path: 'doctorMana',
        component: () => import('../components/HospitalDeptManaComponents/DoctorMana'),
      },
    ]
  },
  {
    path: '/hospNoticeMana',
    redirect: '/hospNoticeMana/hospNotice'
  },
  {
    path: '/hospNoticeMana',
    component: () => import('../views/HospNoticeMana'),
    children: [
      {
        path: 'hospNotice',
        component: () => import('../components/HospNoticeManaComponents/HospNotice')
      },
    ]
  },
  {
    path: '/browseNotice',
    name: 'browseNotice',
    component: () => import('../views/BrowseNotice'),
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
