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
    <el-menu-item index="/hospitalDeptMana/doctorMana">
      <el-icon><Plus /></el-icon>
      <span>医生管理</span>
    </el-menu-item>
    <el-menu-item index="/hospitalDeptMana/hospitalQualHandle">
      <el-icon><Edit /></el-icon>
      <span>资质审核</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "HospitalDeptMana",
  data(){
    return{

    }
  },
  methods:{

  },
  mounted() {

  }
}
</script>

<style scoped>
.el-menu-vertical-demo{
  position: fixed;
  width: 200px;
  height: 700px;
}
</style>