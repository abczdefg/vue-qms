<template>
  <el-aside class="sidebar" width="auto" v-if="showSidebar">
    <!-- <div>三</div> -->
    <div class="sidebar-toggle" @click="isCollapse = !isCollapse">
      <i :class="{'el-icon-arrow-right': isCollapse, 'el-icon-arrow-left': !isCollapse}"></i>
    </div>
    <el-menu :default-active="onRoutes" unique-opened router :collapse="isCollapse">
      <template v-for="item in menu">
        <template v-if="item.children">
          <el-submenu :index="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem, i) in item.children" :key="i" :index="subItem.index">{{ subItem.title }}</el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
  export default {
    props: {
      menu: {
        defaults: [{
          icon: 'el-icon-menu',
          index: '/home',
          title: '首页'
        }]
      }
    },
    data() {
      return {
        isCollapse: false
      }
    },
    computed: {
      onRoutes() {
        let path = this.$route.path;
        let secIndex = path.indexOf('/', 1);
        return secIndex === -1 ? path : path.slice(0, secIndex);
      },
      showSidebar() {
        return this.$store.state.sidebar.showSidebar;
      }
    }
  }
</script>

<style lang="less" scoped>
  .sidebar {
    border-right: solid 1px #e6e6e6;
    .sidebar-toggle {
      padding: 0 20px;
      height: 56px;
      line-height: 56px;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: #ecf5ff;
      }
    }
    .el-menu {
      border-right: 0;
      &:not(.el-menu--collapse) {
        width: 140px;
      }
    }
    .fa {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
      vertical-align: middle;
    }
  }
</style>
