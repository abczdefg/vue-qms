import Vue from 'vue'
import router from '@admin/router'
import store from '@admin/store'
import { Message, Loading } from 'element-ui'

let loading;
const whiteList = ['/login', '/404'];
router.beforeEach((to, from, next) => {
  // loading = Loading.service({ fullscreen: true });
  let userData = store.state.userData;
  if(userData) {
    if(!store.state.addRoutes) {
      store.dispatch('generateRoutes', userData.privilege).then(res => {
        router.addRoutes(store.state.routes);
        store.dispatch('addRoutes');
        next({...to});
      });
    } else {
      next();
    }
  } else {
    if(whiteList.includes(to.path)) {
      next();
    } else {
      Message.error('请先登录');
      next({name: 'login'});
    }
  }
});

router.afterEach(() => {
  Vue.nextTick(() => {
    // loading.close();
  });
})
