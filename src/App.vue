<template>
  <div id="app">
      <header class="clearfix">
          <el-menu theme="dark" class="fl el-menu-demo header-ul" mode="horizontal">
            <el-menu-item index="1"><router-link to="/newsjet" class="link">NewsJet</router-link></el-menu-item>
            <el-menu-item index="2"><router-link to="/girls" class="link">Girls Daily</router-link></el-menu-item>
          </el-menu>
      </header>
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="scss">
@import "./styles/common.css";
header{
    background: #324157;
    padding: 0 50px;
}
*{
    padding: 0;
    margin: 0;
}
.sidebar-wrapper .el-menu{
    width: 200px;
    position: fixed;
    top: 60px;bottom: 0;
    left: 0;
    overflow: auto;
}
.content{
    position: fixed;
    top: 60px;
    left: 200px;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 30px 20px 10px;
}
</style>
