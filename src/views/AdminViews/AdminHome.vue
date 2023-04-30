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
    <el-menu-item index="/userVaccineAppoint/vaccineAppoint">
      <el-icon><Plus /></el-icon>
      <span>医院管理</span>
    </el-menu-item>
    <el-menu-item index="/userVaccineAppoint/appointHistory">
      <el-icon><Edit /></el-icon>
      <span>用户管理</span>
    </el-menu-item>
  </el-menu>
  <div>
    <h1>admin home</h1>
    <el-button size="large" @click="getAllHospitals">查询医院</el-button>
  </div>


  <el-dialog
      v-model="loginPrompt"
      title=""
      width="30%"
      align-center
      :before-close="closeRedirect"
  >
    <span>您还未登录，请先登录!</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onCLick">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {ElMessage} from "element-plus";
import axios from "../../utils/request";
export default {
  name: "AdminHome",
  data(){
    return{
      loginPrompt:false,
      hospitals:[],
    }
  },
  methods:{
    onCLick(){
      this.$router.push('/administratorLogin')
    },
    closeRedirect(done){
      this.$router.push('/administratorLogin')
    },
    getAllHospitals(){
      axios.get("http://localhost/admins/getAllHospitals").then(res=>{
        this.hospitals = res.data
      })
    }
  },
  mounted() {
    if (!window.localStorage.getItem('jwt')){
      this.loginPrompt= true
    }
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