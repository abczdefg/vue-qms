import Vue from 'vue'
import Router from 'vue-router'
import defaultRouter from './defaultRouter'
Vue.use(Router)
let router = new Router({
  base: '/admin/',
  // mode: 'history',
  routes: defaultRouter
});

export default router;
