import route from '@admin/router/asyncRouter.js'
export default {
	updateEditStatus(state, isEditing) {
		state.isEditing = isEditing;
	},
  login(state, userData) {
    state.userData = userData;
  },
  logout(state) {
    state.userData = null;
  },
  generateRoutes(state, privilege) {
    state.routes = filterRoutesByRole(route, privilege);
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

function filterRoutesByRole(route, privilege = []) {
  let ret = [];
  for(let [index, value] of Object.entries(route)) {
    let meta = value.meta;
    if(!meta || !meta.privilege || privilege.includes(meta.privilege)) {
      ret[index] = value;
    }
    if(Array.isArray(value.children)) {
      ret[index].children = filterRoutesByRole(value.children, privilege);
    }
  }
  return ret;
}
