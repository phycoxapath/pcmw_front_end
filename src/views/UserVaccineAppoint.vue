<template>
  <div  v-show="!loginPrompt">
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
        <span>疫苗接种预约</span>
      </el-menu-item>
      <el-menu-item index="/userVaccineAppoint/appointHistory">
        <el-icon><Edit /></el-icon>
        <span>预约记录</span>
      </el-menu-item>
      <el-menu-item index="/hospitalVaccineMana/modifyVaccine">
        <el-icon><Edit /></el-icon>
        <span>接种记录</span>
      </el-menu-item>
    </el-menu>
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
export default {
  name: "VaccineAppoint",
  data(){
    return{
      loginPrompt:false,

    }
  },
  methods:{
    onCLick(){
      this.$router.push('/login')
    },
    closeRedirect(done){
      this.$router.push('/login')
    }
  },
  mounted() {
    if (!window.localStorage.getItem('loginState')){
      this.loginPrompt = true
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