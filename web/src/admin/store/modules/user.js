import { login, logout } from '@admin/api';

const state = {
  info: sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))
}
const getters = {
  userData: state => state.info
}
const actions = {
  login({commit}, user) {
    return login(user).then(res => {
      let { message, code, data } = res;
      sessionStorage.setItem('user', JSON.stringify(data));
      commit('login', data);
      return Promise.resolve(data);
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
    state.info = info;
  },
  logout(state) {
    state.info = null;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
