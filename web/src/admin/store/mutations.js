import { asyncRouter } from '@admin/router'
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
    state.routes = filterRoutes(asyncRouter, privilege);
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

function filterRoutes(routes, privilege = []) {
  return routes.filter(route => {
    if(Array.isArray(route.children)) {
      route.children = filterRoutes(route.children, privilege);
      return true;
    }
    if(!route.meta || !route.meta.privilege || privilege.includes(route.meta.privilege)) {
      return true;
    }
    return false;
  });
}
