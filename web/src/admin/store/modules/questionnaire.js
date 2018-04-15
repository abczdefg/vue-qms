const state = {
  isEditing: false
}

const actions = {
  updateEditStatus({commit}, isEditing) {
    commit('updateEditStatus', isEditing);
  }
}

const mutations = {
  updateEditStatus(state, isEditing) {
    state.isEditing = isEditing;
  }
}

export default {
  state,
  actions,
  mutations
}
