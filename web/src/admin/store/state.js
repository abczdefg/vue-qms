export default {
  userData: sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')),
  routes: [],
  addRoutes: false,
  isEditing: false,
  showSidebar: true
}
