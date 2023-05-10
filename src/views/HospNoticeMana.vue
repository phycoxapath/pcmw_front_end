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
    <el-menu-item index="/hospNoticeMana/hospNotice">
      <el-icon><Plus /></el-icon>
      <span>院级公告</span>
    </el-menu-item>
    <el-menu-item index="/adminHome/userMana">
      <el-icon><Edit /></el-icon>
      <span>科室公告</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "HospNoticeMana"
}
</script>

<style scoped>
.el-menu-vertical-demo{
  position: fixed;
  width: 200px;
  height: 700px;
}
</style>