import Main from '@admin/components/Main.vue'
import Home from '@admin/pages/Home.vue'
import User from '@admin/pages/User.vue'
import Questionnaire from '@admin/pages/Questionnaire.vue'
import QuestionnaireEdit from '@admin/pages/QuestionnaireEdit.vue'
import NotFound from '@admin/pages/404.vue'
const asyncRouter = [{
  path: '/',
  component: Main,
  meta: {
    requiresAuth: true,
  },
  children: [{
    path: '/',
    redirect: {
      path: '/home'
    }
  }, {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
      role: ['超级管理员', '管理员']
    }
  }, {
    path: '/questionnaire',
    name: 'questionnaire',
    component: Questionnaire,
    meta: {
      requiresAuth: true,
      role: ['超级管理员', '管理员']
    }
  }, {
    path: '/questionnaire/:action',
    name: 'questionnaireAdd',
    component: QuestionnaireEdit,
    meta: {
      requiresAuth: true,
      role: ['超级管理员', '管理员']
    }
  }, {
    path: '/questionnaire/:action/:id',
    name: 'questionnaireEdit',
    component: QuestionnaireEdit,
    meta: {
      requiresAuth: true,
      role: ['超级管理员', '管理员']
    }
  }, {
    path: '/user',
    name: 'user',
    component: User,
    meta: {
      requiresAuth: true,
      role: ['超级管理员']
    }
  }]
}, {
  path: '/404',
  component: NotFound,
  name: '404',
  hidden: true
}, {
  path: '*',
  redirect: '/404',
  hidden: true
}];
export default asyncRouter;