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
  import menu from '../data/menu.js';
  export default {
    components: {
      qnrHeader, qnrSidebar
    },
    computed: {
      menuItems() {
        let userData = this.$store.state.userData;
        return menu.filter(route => route.role.includes(userData.role));
      }
    },
    data() {
      return {
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
