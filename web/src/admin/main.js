// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'reset-css/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI)

// 动态加载路由
const whiteList = ['/login', '/404'];
router.beforeEach((to, from, next) => {
  let userData = sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'));
  if(userData) {
    store.dispatch('generateRoutes', userData.privilege).then(res => {
      if(!store.state.addRoutes) {
        router.addRoutes(store.state.routes);
        store.dispatch('addRoutes');
        next({...to});
      } else {
        next();
      }
    });
  } else {
    if(whiteList.indexOf(to.path) === -1) {
      ElementUI.Message.error('登录过时，请重新登录');
      next({name: 'login'});
    } else {
      next();
    }
  }
});

/* ajax设置 */

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


