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
    <el-menu-item index="/shoppingMana/addNewCommodity">
      <el-icon><Plus /></el-icon>
      <span>新增商品</span>
    </el-menu-item>
    <el-menu-item index="/shoppingMana/modifyCommodity">
      <el-icon><Edit /></el-icon>
      <span>编辑商品</span>
    </el-menu-item>
    <el-menu-item index="/shoppingMana/orderMana">
      <el-icon><Edit /></el-icon>
      <span>订单管理</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "ShoppingMana"
}
</script>

<style scoped>
.el-menu-vertical-demo{
  position: fixed;
  width: 200px;
  height: 700px;
}
</style>