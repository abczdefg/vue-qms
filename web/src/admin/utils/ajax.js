import axios from 'axios'
import { Message } from 'element-ui'
import store from '@admin/store'
import router from '@admin/router'

const instance = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
  withCredentials: true
});

// 响应拦截
instance.interceptors.response.use(
  response => response,
  error => {
    switch (error.response.status) {
      case 400:
      case 401:
        Message.error('登录过时，请重新登录');
        store.dispatch('logout');
        router.replace({name: 'login'});
    }
    return Promise.reject(error.response.data);
  }
);
export default instance;
