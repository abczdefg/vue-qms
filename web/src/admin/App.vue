<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html,
body,
#app {
  height: 100%;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif;
}
/* css reset：border-collapse导致element表格下方会出现滚动条 */
table {
  border-spacing: 0;
  border-collapse: separate;
}
/* 滚动条样式 */
::-webkit-scrollbar-track-piece {
  background-color: #f2f2f2;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: #409eff;
  background-clip: padding-box;
  min-height: 28px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #66b1ff;
}
* {
  box-sizing: border-box;
}
/* dialog */
.el-dialog {
  margin: 0 auto;
  top: 50%;
  transform: translateY(-50%);
}
.el-dialog__body {
  max-height: 58vh;
  overflow-y: auto;
}
/* table */
.el-table {
  margin-bottom: 22px;
}
</style>
