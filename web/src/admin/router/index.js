import Vue from 'vue'
import Router from 'vue-router'
import Login from '@admin/pages/Login.vue'
import NotFound from '@admin/pages/404.vue'
import Main from '@admin/components/Main.vue'
import Home from '@admin/pages/Home.vue'
import User from '@admin/pages/User.vue'
import Questionnaire from '@admin/pages/Questionnaire.vue'
import QuestionnaireEdit from '@admin/pages/QuestionnaireEdit.vue'
import Result from '@admin/pages/Result.vue'

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
