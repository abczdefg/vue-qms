// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'reset-css/reset.css'
import '@index/assets/iconfont/iconfont.css'
import App from '@index/App'
import router from '@index/router'
import { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
