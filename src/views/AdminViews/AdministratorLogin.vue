<template>
  <div>
    <el-text style="font-size: 26px;font-weight: bold;position:relative;left: 700px;top: 70px">管理员登录</el-text>
    <el-form :model="adminLoginForm" label-width="120px" class="demo-border"
             :rules="rules"
             ref="adminLoginForm"
    >
      <el-form-item label="登录名" prop="loginName" style="position: relative;left: 70px">
        <el-input style="width: 250px" v-model="adminLoginForm.loginName" placeholder="输入登录名"/>
      </el-form-item>
      <el-form-item label="密码" prop="password" style="position: relative;left: 70px">
        <el-input style="width: 250px " type="password" v-model="adminLoginForm.password" show-password placeholder="输入密码"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="margin-left: 259px">登录</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import axios from "../../utils/request";
import {ElMessage} from "element-plus";
import sha1 from "sha1";

export default {
  name: "AdministratorLogin",
  data(){
    return{
      adminLoginForm:{
        loginName: "",
        password:"",
      },
      rules:{
        loginName: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
          { min: 2, max: 12, message: '用户名长度应为2到10个字符', trigger: 'blur' },
        ],
        password:[
          {min:6,max:15,message: '密码长度应为6-15位',trigger: "blur"},
          { required: true, message: '密码不能为空！', trigger: 'blur' }

        ]
      },
      }

  },
  methods:{
    onSubmit(){
      this.adminLoginForm.password = sha1(this.adminLoginForm.password)
      axios.post("http://localhost/admins/loginValidate",this.adminLoginForm).then(res=>{
        if (res.data === "login success"){
          ElMessage.success("登录成功！即将跳转到首页...")
          window.localStorage.setItem("loginRole","admin")
          window.localStorage.setItem("loginState","pcmwSysAdmin")
          setTimeout( ()=>{
            window.location.href = 'http://localhost:8080/'
          },1000)
        }
      })
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.demo-border{
  border-top: 2px solid var(--el-border-color);
  border-bottom: 2px solid var(--el-border-color);
  border-left: 2px solid var(--el-border-color);;
  border-right: 2px solid var(--el-border-color);;
  border-radius: 20px;
  width: 600px;
  padding: 25px;
  background-color: #FAFAFA;
  position: fixed;
  margin-left: 450px;
  margin-top: 100px;
}
</style>