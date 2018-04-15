const state = {
  isEditing: false
}

const actions = {
  setEditStatus({commit}, isEditing) {
    commit('setEditStatus', isEditing);
  }
}

const mutations = {
  setEditStatus(state, isEditing) {
    state.isEditing = isEditing;
  }
}

export default {
  state,
  actions,
  mutations
}
