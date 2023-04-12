<template>
  <el-form :inline="true" :model="oldPassword" class="demo-form-inline" :rules="rules" ref="oldPassword">
    <el-form-item label="请先输入旧密码:" v-show="oldPswCorrect === false" >
      <el-input type="password" v-model="oldPassword.password" placeholder="旧密码" show-password/>
    </el-form-item>
    <el-form-item v-show="oldPswCorrect === false">
      <el-button type="primary" @click="oldPswVerify">确定</el-button>
    </el-form-item>
    <el-form-item label="请输入新密码:" v-show="oldPswCorrect === true" prop="newPassword">
      <el-input type="password" v-model="oldPassword.newPassword" placeholder="新密码" show-password/>
    </el-form-item>
    <br/><br/>
    <el-form-item label="请确认新密码:" v-show="oldPswCorrect === true" prop="confirmPassword">
      <el-input type="password" v-model="oldPassword.confirmPassword" placeholder="确认新密码" />
    </el-form-item>
    <el-form-item v-show="oldPswCorrect === true">
      <el-button type="primary" @click="newPswSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";
import sha1 from "sha1";
export default {
  name: "ModifyPassword",
  data(){
    var pswConfirmValidate = (rule, value, callback) =>{
      if (value !== this.oldPassword.newPassword) {
        callback(new Error("两次输入密码不一致！"));
      }
      else
        callback();
    }
    return{
      oldPswCorrect:false,
      oldPassword:{
        password:"",
        newPassword:"",
        confirmPassword:""
      },
      updatePassword:{
        id:window.localStorage.getItem('id'),
        password:""
      },
      rules:{
        newPassword:[
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
    oldPswVerify(){
      axios.get("http://localhost/"+window.localStorage.getItem('loginRole')+"/"+window.localStorage.getItem('loginState')+"/"+sha1(this.oldPassword.password)).then(res =>{
        if (res.data === 'login success'){
          ElMessage.success("验证通过，请输入新密码")
          this.oldPswCorrect = true
        }else if (res.data === 'login name or password error'){
          ElMessage.warning("密码错误！")

        }else
          ElMessage.error("系统繁忙，请稍后再试！")
      })
    },
    newPswSubmit(){
      this.$refs.oldPassword.validate(isValid => {
        if (isValid){
          this.updatePassword.password = sha1(this.oldPassword.newPassword)
          axios.put("http://localhost/"+window.localStorage.getItem('loginRole'),this.updatePassword).then(res =>{
            if (res.data === 'update success'){
              ElMessage.success("密码修改成功，即将跳转到登录页面，请重新登录")
              window.localStorage.removeItem('loginState')
              window.localStorage.removeItem('loginRole')
              window.localStorage.removeItem('id')
              setTimeout(() =>{
                this.$router.push({path: '/login',query:{select : window.localStorage.getItem('loginRole')}})
              },1500)
            }else if (res.data === 'update fail'){
              ElMessage.error("系统繁忙，请稍后再试！")
            }
            else
              ElMessage.error("系统繁忙，请稍后再试！")
          })
        }
      })

    }
  },

}
</script>

<style scoped>
.demo-form-inline{
  position: absolute;
  top: 200px;
  left: 610px;
  width: 600px;
}
</style>