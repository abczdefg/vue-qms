<template>
  <el-container class="main-container" direction="vertical">
    <qnr-header>后台管理系统</qnr-header>
    <el-container class="sub-container">
        <qnr-sidebar :menu="menuItems"></qnr-sidebar>
        <el-main>
          <transition name="move" mode="out-in"><router-view></router-view></transition>
        </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import qnrHeader from '../components/Header.vue';
  import qnrSidebar from '../components/Sidebar.vue';
  export default {
    components: {
      qnrHeader, qnrSidebar
    },
    computed: {
      menuItems() {
        let userData = JSON.parse(sessionStorage.getItem('user'));
        return this.menu.filter(route => route.role.indexOf(userData.role) !== -1);
      }
    },
    data() {
      return {
        menu: [
          {
            icon: 'el-icon-menu',
            index: '/home',
            title: '首页',
            role: ['超级管理员', '管理员']
          },
          {
            icon: 'el-icon-tickets',
            index: '/questionnaire',
            title: '问卷管理',
            role: ['超级管理员', '管理员']
          },
          {
            icon: 'el-icon-service',
            index: '/user',
            title: '用户管理',
            role: ['超级管理员']
          }
        ]
      }
    }
  }
</script>
<style>
  .main-container {
    height: 100%;
  }
  .sub-container {
    overflow: hidden;
  }
  .el-main {
    display: flex;
    flex-direction: column;
  }
</style>
