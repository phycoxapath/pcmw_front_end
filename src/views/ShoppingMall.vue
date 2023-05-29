<template>
  <router-view></router-view>
  <el-menu
      active-text-color="#337ecc"
      default-active="1"
      background-color="#FAFCFF"
      class="el-menu-vertical-demo"
      text-color="#303133"
      :router="true"
  >
    <el-menu-item index="/shoppingMall/mallBrowse">
      <el-icon><Plus /></el-icon>
      <span>商城主页</span>
    </el-menu-item>
    <el-menu-item index="//shoppingMall/userOrder">
      <el-icon><Edit /></el-icon>
      <span>我的订单</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "MallView"
}
</script>

<style scoped>
.el-menu-vertical-demo{
  position: fixed;
  width: 200px;
  height: 700px;
}
</style>