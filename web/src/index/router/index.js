import Vue from 'vue'
import Router from 'vue-router'
import List from '@index/page/List.vue'
import Questionnaire from '@index/page/Questionnaire.vue'

Vue.use(Router)

export default new Router({
  base: '/',
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path: '/detail/:id',
      name: 'Questionnaire',
      component: Questionnaire
    },
  ]
})
