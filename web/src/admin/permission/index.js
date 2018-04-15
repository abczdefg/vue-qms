import Vue from 'vue'
import router, { defaultRouter } from '@admin/router'
import store from '@admin/store'
import { Message, Loading } from 'element-ui'

let loading;
router.beforeEach((to, from, next) => {
  // 1. 判断登录
  // 2. 判断路由是否生成（相当于权限控制）

  // loading = Loading.service({ fullscreen: true });
  let userData = store.state.user.info;
  if(userData) {
    if(store.state.route.routes.length === 0) {
      store.dispatch('generateRoutes', userData.privilege).then(res => {
        router.addRoutes(store.state.route.routes);
        next({...to});
      });
    } else {
      next();
    }
  } else {
    if(defaultRouter.some(v => v.path === to.path)) {
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
