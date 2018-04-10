export default {
  userData: sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')),
  routes: [],
  isEditing: false,
  showSidebar: true
}
