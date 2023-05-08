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
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "HospitalVaccineMana",
  mounted() {
    axios.get("http://localhost/hospitals/getById?id="+window.localStorage.getItem('id')).then(res=>{
      if (res.data.qualification){
        this.isQualified = true
      }else {
        ElMessage.error("您尚未认证机构资质，请先申请认证资质！")
        setTimeout( () =>{
          window.location.href = 'http://localhost:8080/#/personalCenter/userQualification'
        },1200)
      }
    })
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