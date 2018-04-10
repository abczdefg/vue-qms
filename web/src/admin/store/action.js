export default {
  updateEditStatus({commit}, isEditing) {
    commit('updateEditStatus', isEditing);
  },
  login({commit}, userData) {
    sessionStorage.setItem('user', JSON.stringify(userData));
    commit('login', userData);
  },
  logout({commit}) {
    sessionStorage.removeItem('user');
    commit('logout');
  },
  generateRoutes({commit}, role) {
    commit('generateRoutes', role);
  },
  toggleSidebar({commit}) {
    commit('toggleSidebar');
  },
  showSidebar({commit}) {
    commit('showSidebar');
  },
  hideSidebar({commit}) {
    commit('hideSidebar');
  }
}
