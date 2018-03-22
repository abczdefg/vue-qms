<template>
  <el-header class="header">
    <div class="logo"><slot></slot></div>
    <div class="user-info">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="el-dropdown-link">
          {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>
<script>
  export default {
    data() {
      return {
        name: 'a'
      }
    },
    computed: {
      username() {
        let userData = this.$store.state.userData;
        return userData.username || this.name;
      }
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.$store.dispatch('logout');
            this.$router.replace('/login');
            break;
          default:
            break;
        }
      }
    }
  }
</script>
<style scoped>
  .header {
    background-color: #409EFF;
    color: #ffffff;
    vertical-align: middle;
  }
  .header .sidebar-toggle,
  .header .logo {
    display: inline-block;
    vertical-align: middle;
    line-height: 60px;
  }
  .header .sidebar-toggle {
    cursor: pointer;
  }
  .user-info {
    float: right;
    vertical-align: top;
  }
  .user-info .el-dropdown-link {
    padding-left: 50px;
    line-height: 60px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
    display: inline-block;
    background: url("../assets/logo.png") no-repeat;
    background-size: 40px 40px;
    background-position: 5px center;
  }
</style>
