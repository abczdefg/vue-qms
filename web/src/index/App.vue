<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body, #app {
  min-width: 320px;
  height: 100%;
  box-sizing: border-box;
}
html, body, #app, button {
  font-family: 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
}
a {
  text-decoration: none;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
