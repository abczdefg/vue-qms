import Vue from 'vue'
import router, { defaultRouter } from '@admin/router'
import store from '@admin/store'
import { Message, Loading } from 'element-ui'

let loading;
router.beforeEach(async (to, from, next) => {
  // 1. 判断当前页面是否需要登录权限
  // 2. 判断是否登录
  // 3. 若已登录且需要权限，生成router
  if(!needLogin(defaultRouter, to)) {
    return next();
  }

  // 两次获取userData：先判断vuex是否保存数据，再去请求后台
  let userData = store.state.user.info;
  if(!userData) {
    userData = await checkLoginStatus();
  }
  if(userData === false) {
    Message.error('请先登录');
    next({name: 'login'});
    return false;
  }
  // 判断路由是否生成
  if(!checkAsyncRouter()) {
    let route = await generateRouter(userData.privilege);
    router.addRoutes(store.state.route.routes);
    return next({...to});
  }
  return next();
});
router.afterEach(() => {
  Vue.nextTick(() => {
    // loading.close();
  });
});

function needLogin(noAuthRoute, to) {
  return !noAuthRoute.some(v => v.path === to.path);
}

async function checkLoginStatus() {
  let userData;
  try {
    userData = await store.dispatch('checkLogin');
  } catch(e) {
    userData = false;
  }
  return userData;
}

function checkAsyncRouter() {
  return store.state.route.routes.length !== 0;
}

function generateRouter(privilege) {
  return store.dispatch('generateRoutes', privilege);
}
