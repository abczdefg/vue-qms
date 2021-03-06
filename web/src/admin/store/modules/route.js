import { asyncRouter } from '@admin/router'

const state = {
  routes: []
}

const actions = {
  generateRoutes({commit}, role) {
    commit('generateRoutes', role);
  }
}

const mutations = {
  generateRoutes(state, privilege) {
    state.routes = filterRoutes(asyncRouter, privilege);
  }
}

export default {
  state,
  actions,
  mutations
}

function filterRoutes(routes, privilege = []) {
  return routes.filter(route => {
    if(Array.isArray(route.children)) {
      let children = filterRoutes(route.children, privilege);
      route.children = (children.length > 0) ? children : null;
      return true;
    }
    if(!route.meta || !route.meta.privilege || privilege.includes(route.meta.privilege)) {
      return true;
    }
    return false;
  });
}
