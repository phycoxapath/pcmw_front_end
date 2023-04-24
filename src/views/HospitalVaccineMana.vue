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
    <el-menu-item index="/hospitalVaccineMana/addNewVaccine">
      <el-icon><Plus /></el-icon>
      <span>新增疫苗</span>
    </el-menu-item>
    <el-menu-item index="/hospitalVaccineMana/modifyVaccine">
      <el-icon><Edit /></el-icon>
      <span>编辑疫苗</span>
    </el-menu-item>
    <el-menu-item index="/hospitalVaccineMana/vaccineAppointmentMana">
      <el-icon><Checked /></el-icon>
      <span>预约查看</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "HospitalVaccineMana"
}
</script>

<style scoped>
.el-menu-vertical-demo{
  position: fixed;
  width: 200px;
  height: 700px;
}
</style>