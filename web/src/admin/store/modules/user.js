import { login, logout, checkLogin } from '@admin/api';

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
      commit('logout');
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
