import Vue from 'vue'
import Router from 'vue-router'
const List = () => import(/* webpackChunkName: "index-list" */ '@index/pages/List.vue')
const Questionnaire = () => import(/* webpackChunkName: "index-questionnaire" */ '@index/pages/Questionnaire.vue')

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
      component: Questionnaire,
      props: true
    },
    {
      path: '*',
      redirect: '/'
    },
  ]
})
