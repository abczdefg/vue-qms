import Main from '@admin/components/Main.vue'
import Home from '@admin/pages/Home.vue'
import User from '@admin/pages/User.vue'
import Questionnaire from '@admin/pages/Questionnaire.vue'
import QuestionnaireEdit from '@admin/pages/QuestionnaireEdit.vue'
import Result from '@admin/pages/Result.vue'
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
      privilege: 'questionnaire'
    }
  }, {
    path: '/questionnaire',
    name: 'questionnaire',
    component: Questionnaire,
    meta: {
      requiresAuth: true,
      privilege: 'questionnaire'
    }
  }, {
    path: '/questionnaire/detail/:action',
    name: 'questionnaireAdd',
    component: QuestionnaireEdit,
    meta: {
      requiresAuth: true,
      privilege: 'questionnaire'
    }
  }, {
    path: '/questionnaire/:id/detail/:action',
    name: 'questionnaireEdit',
    component: QuestionnaireEdit,
    meta: {
      requiresAuth: true,
      privilege: 'questionnaire'
    }
  }, {
    path: '/questionnaire/:id/result',
    name: 'Result',
    component: Result,
    meta: {
      requiresAuth: true,
      privilege: 'questionnaire'
    }
  }, {
    path: '/user',
    name: 'user',
    component: User,
    meta: {
      requiresAuth: true,
      privilege: 'user'
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
