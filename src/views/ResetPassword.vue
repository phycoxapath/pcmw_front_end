<template>
  <el-text class="mx-1" size="large" style="font-size: 30px;position: relative;left: 700px;top: 30px">重置密码</el-text>
  <el-form
      ref="modifyData"
      label-position="left"
      label-width="100px"
      :model="modifyData"
      class="demo-border"
      :rules="rules"
      style="max-width: 430px"
  >
    <el-form-item v-show="role === 'users'" label="登录名" prop="loginName">
      <el-input v-model="modifyData.loginName" />
    </el-form-item>
    <el-form-item v-show="role === 'doctors'" label="登录名" prop="jobId">
      <el-input v-model="modifyData.jobId" />
    </el-form-item>
    <el-form-item v-show="role === 'hospitals'" label="登录名" prop="hospitalName">
      <el-input v-model="modifyData.hospitalName" />
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input type="password" v-model="modifyData.password" show-password/>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword" >
      <el-input type="password" v-model="repeatPsw" show-password/>
    </el-form-item>
    <el-form-item class="button-style">
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
import {ElAlert, ElMessage} from "element-plus";
import sha1 from "sha1";
export default {
  name: "ModifyPassword",

  data(){
    var loginNameQuery = (rule, value, callback) =>{
       this.queryName = this.role === 'users' ? this.modifyData.loginName : (this.role === 'doctors' ? this.modifyData.jobId : this.modifyData.hospitalName)
      console.log(this.queryName)
      axios.get("http://localhost/" + this.role + "/" + this.queryName).then(res => {
          if (res.data === null || res.data === "") {
            callback(new Error("用户不存在"));
            ElMessage.error("用户不存在！")
          } else
            callback();
        })



    };
    var pswConfirmValidate = (rule, value, callback) =>{
      if (this.repeatPsw !== this.modifyData.password) {
        callback(new Error("两次输入密码不一致！"));
      }
      else
        callback();
    }
    return{
      role:this.$route.query.role,
      queryName:"",
      repeatPsw:"",
      modifyData:{
        loginName:"",
        jobId:"",
        hospitalName:"",
        password:"",
      },
      rules:{
        loginName: [
          {validator: loginNameQuery, trigger: 'blur', required: true}
        ],
        jobId:[
          {validator: loginNameQuery, trigger: 'blur', required: true}
        ],
        hospitalName:[
          {validator: loginNameQuery, trigger: 'blur', required: true}
        ],
        password:[
          {pattern : /^\S*(?=\S{6,15})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/,
            message: '密码必须包含大小写字母和数字，且长度需在6-15位',
            trigger:'blur'
          },
          { required: true, message: '密码不能为空！', trigger: 'blur' }
        ],
        confirmPassword:[
          {validator: pswConfirmValidate, trigger: 'blur', required: true}
        ]
      }

    }
  },
  methods:{
    onSubmit(){
      this.$refs.modifyData.validate(isValid => {
        if (isValid){
          this.modifyData.password = sha1(this.modifyData.password)
          axios.put("http://localhost/"+this.role,this.modifyData).then(res =>{
            if (res.data === 'update success'){
              this.modifyData.password = ""
              this.repeatPsw = ""
              ElMessage.success("重置密码成功，正在返回登录页面")
              setTimeout(() =>{
                this.$router.push({path:'/login',query:{select:this.role}})
              },1500)
            }else {
              ElMessage.error("重置失败，系统繁忙！")
            }
          })
        }
      })

    }
  }
}
</script>

<style scoped>
.el-form {
  width: 600px;
  margin:auto;
  padding: 25px;
  background-color: #FAFAFA;
  position: relative;
  top: 50px;
}
.demo-border{
  border-top: 2px solid var(--el-border-color);
  border-bottom: 2px solid var(--el-border-color);
  border-left: 2px solid var(--el-border-color);;
  border-right: 2px solid var(--el-border-color);;
  border-radius: 20px;
}
.button-style{
  position: relative;
  left: 264px;
  top: 20px;
}
</style>