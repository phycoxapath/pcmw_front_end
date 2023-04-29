<template>
  <div>
    <h1>admin home</h1>
    <span>{{}}</span>
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

</style>