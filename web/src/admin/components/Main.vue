<template>
  <el-container class="main-container" direction="vertical">
    <qnr-header>后台管理系统</qnr-header>
    <el-container class="sub-container">
      <qnr-sidebar :menu="menuItems"></qnr-sidebar>
      <el-main>
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import qnrHeader from '@admin/components/Header.vue';
  import qnrSidebar from '@admin/components/Sidebar.vue';
  import menu from '@admin/data/menu.js';
  export default {
    components: {
      qnrHeader, qnrSidebar
    },
    computed: {
      menuItems() {
        function filterMenu(routes) {
          return routes.filter(route => {
            if(Array.isArray(route.children)) {
              route.children = filterMenu(route.children);
              return true;
            }
            if(route.meta && route.meta.menu) {
              return true;
            }
            return false;
          });
        }
        function convertMenu(routes, basePath = '') {
          return routes.map(route => {
            let result = { index: basePath + route.path || '' };
            if(Array.isArray(route.children)) {
              // 只有一个则不使用子菜单
              if(route.children.length === 1) {
                result.index = route.path + route.children[0].path;
                result.title = route.children[0].meta.title;
                result.icon = route.children[0].meta.icon;
              } else {
                result.children = convertMenu(route.children, result.index);
              }
            } else {
              result.title = route.meta.title;
              result.icon = route.meta.icon;
            }
            return result;
          });
        }
        return convertMenu(filterMenu(this.$store.state.routes));
      }
    },
    data() {
      return {
      }
    }
  }
</script>
<style scoped>
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
