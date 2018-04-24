import Vue from 'vue'
import Router from 'vue-router'
const Login = () => import(/* webpackChunkName: "admin-login" */ '@admin/pages/Login.vue')
const NotFound = () => import(/* webpackChunkName: "admin-login" */ '@admin/pages/404.vue')
const Main = () => import(/* webpackChunkName: "admin-main" */ '@admin/components/Main.vue')
const Home = () => import(/* webpackChunkName: "admin-home" */ '@admin/pages/Home.vue')
const User = () => import(/* webpackChunkName: "admin-user" */ '@admin/pages/User.vue')
const Questionnaire = () => import(/* webpackChunkName: "admin-questionnaire" */ '@admin/pages/Questionnaire.vue')
const QuestionnaireEdit = () => import(/* webpackChunkName: "admin-questionnaire" */ '@admin/pages/QuestionnaireEdit.vue')
const Result = () => import(/* webpackChunkName: "admin-questionnaire" */ '@admin/pages/Result.vue')

Vue.use(Router)

export const defaultRouter = [{
  path: '/login',
  component: Login,
  name: 'login'
}, {
  path: '/404',
  component: NotFound,
  name: '404'
}]

export const asyncRouter = [{
  path: '/',
  component: Main,
  children: [{
    path: '',
    redirect: 'home'
  }, {
    path: 'home',
    name: 'home',
    component: Home,
    meta: {
      menu: true,
      title: '首页',
      icon: 'el-icon-menu'
    }
  }]
}, {
  path: '/questionnaire',
  component: Main,
  children: [{
    path: '',
    name: 'questionnaire',
    component: Questionnaire,
    meta: {
      menu: true,
      icon: 'el-icon-tickets',
      title: '问卷管理',
      privilege: 'questionnaire'
    }
  }, {
    path: 'detail/:action',
    name: 'questionnaireAdd',
    component: QuestionnaireEdit,
    meta: {
      privilege: 'questionnaire'
    }
  }, {
    path: ':id(\\d+)/detail/:action',
    name: 'questionnaireEdit',
    component: QuestionnaireEdit,
    meta: {
      privilege: 'questionnaire'
    }
  }, {
    path: ':id(\\d+)/result',
    name: 'Result',
    component: Result,
    meta: {
      privilege: 'questionnaire'
    }
  }]
}, {
  path: '/user',
  component: Main,
  children: [{
    path: '',
    name: 'user',
    component: User,
    meta: {
      menu: true,
      icon: 'fa fa-user',
      title: '用户管理',
      privilege: 'user'
    },
  }]
}, {
  path: '*',
  redirect: '/404'
}];

let router = new Router({
  base: '/admin/',
  // mode: 'history',
  routes: defaultRouter
});

export default router;
