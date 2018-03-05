import route from '../router/asyncRouter.js'

export default {
	updateEditStatus(state, isEditing) {
		state.isEditing = isEditing;
	},
  login(state, userData) {
    state.userData = userData;
  },
  generateRoutes(state, role) {
    state.routes = filterRoutesByRole(route, role);
  },
  addRoutes(state) {
    state.addRoutes = true;
  },
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

function filterRoutesByRole(route, role) {
  let ret = [];
  for(let [index, value] of Object.entries(route)) {
    let meta = value.meta;
    if(!meta || !Array.isArray(meta.role) || value.meta.role.includes(role)) {
      ret[index] = value;
    }
    if(Array.isArray(value.children)) {
      ret[index].children = filterRoutesByRole(value.children, role);
    }
  }
  return ret;
}
