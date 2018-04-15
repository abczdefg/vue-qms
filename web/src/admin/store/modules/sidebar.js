const state = {
  showSidebar: true
}

const actions = {
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

const mutations = {
  toggleSidebar(state) {
    state.showSidebar = !state.showSidebar;
  },
  showSidebar(state) {
    state.showSidebar = true;
  },
  hideSidebar(state) {
    state.showSidebar = false;
  }
}

export default {
  state,
  actions,
  mutations
}
