import Vue from 'Vue'
import router from '@admin/router'
import { login, logout, checkLogin } from '@admin/api';
import { Loading } from 'element-ui';

const state = {
  info: sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))
}
const getters = {
  userData: state => state.info
}
const actions = {
  login({commit}, user) {
    return login(user).then(res => {
      let { data } = res;
      commit('login', data);
      return Promise.resolve(data);
    });
  },
  checkLogin({commit}) {
    return checkLogin().then(res => {
      let { data } = res;
      commit('login', data);
      return Promise.resolve(data);
    }).catch(err => {
      commit('logout');
      return Promise.reject(err);
    });
  },
  logout({commit}) {
    return logout().then(res => {
      const duration = 200;
      commit('logout');
      Loading.service({
        fullscreen: true,
        background: '#ffffff'
      })
      setTimeout(() => {
        router.replace('/login');
        router.go(0); // 重置vue-router
      }, duration);
      sessionStorage.removeItem('user');
    });
  }
}

const mutations = {
  login(state, info) {
    sessionStorage.setItem('user', JSON.stringify(info));
    state.info = info;
  },
  logout(state) {
    sessionStorage.removeItem('user');
    state.info = null;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
