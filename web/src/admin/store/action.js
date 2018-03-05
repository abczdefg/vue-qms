export default {
  updateEditStatus({commit}, isEditing) {
    commit('updateEditStatus', isEditing);
  },
  login({commit}, userData) {
    sessionStorage.setItem('user', JSON.stringify(userData));
    commit('login', userData);
  },
  generateRoutes({commit}, role) {
    commit('generateRoutes', role);
  },
  addRoutes({commit}) {
    commit('addRoutes');
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
