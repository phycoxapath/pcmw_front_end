<template>
<div>
  <el-text class="mx-1" size="large" style="font-size: 30px;position: relative;left: 720px;top: 30px">注 册</el-text>
  <el-form :model="registerForm" label-width="120px" class="demo-border"
  :rules="rules"
   ref="registerForm"
  >
    <div >
      <el-form-item>
        <el-radio-group v-model="radio" size="large">
          <el-radio-button label="用户注册" />
          <el-radio-button label="医生注册" />
          <el-radio-button label="机构注册" />
        </el-radio-group>
      </el-form-item>
      <div v-if="radio === '用户注册'">
      <el-form-item class="input-style" label="用户名" prop="registerName">
        <el-input v-model="registerForm.registerName" placeholder="输入用户名" />
      </el-form-item>
    </div>
      <div v-if="radio === '医生注册'">
        <el-form-item class="input-style" label="工号" prop="registerName">
          <el-input v-model="registerForm.registerName" placeholder="输入工号" />
        </el-form-item>
      </div>
      <div v-if="radio === '机构注册'">
        <el-form-item class="input-style" label="机构名称" prop="registerName">
          <el-input v-model="registerForm.registerName" placeholder="输入机构名称" />
        </el-form-item>
      </div>
      <div v-show="radio">
        <el-form-item class="input-style" label="密码" prop="registerPassword">
          <el-input type="password" v-model="registerForm.registerPassword" show-password placeholder="输入密码"/>
        </el-form-item>
        <el-form-item class="input-style" label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="registerForm.confirmPassword" show-password placeholder="确认密码"/>
        </el-form-item>
        <el-form-item class="button-style">
          <el-button type="primary" @click="onSubmit">注册</el-button>
        </el-form-item>
      </div>


      <!--                <el-form-item class="text-style">-->
      <!--                  <el-text type="primary">-->
      <!--                    没有账号？<el-button type="primary" plain>注册一个</el-button>-->
      <!--                  </el-text>-->
      <!--                </el-form-item>-->

    </div>
<!--    <el-form-item>-->
<!--      <el-button @click="onClick">button</el-button>-->
<!--    </el-form-item>-->
  </el-form>
</div>
</template>

<script>
import axios from "axios"
import {ElMessage} from "element-plus";
import sha1 from 'sha1'
export default {
  name: "RegisterView",
  data(){
    var pswConfirmValidate = (rule, value, callback) =>{
      if (value !== this.registerForm.registerPassword)
        callback(new Error("两次输入密码不一致！"));
      else
        callback();
    };
    return{

      radio:"",
      registerForm: {
        registerName:"",
        registerPassword:"",
        confirmPassword:"",
        qualification:false,
        qualType:""
      },
      user: {
        loginName:"",
        jobId:"",
        hospitalName:"",
        password:"",
        qualification:false,
        qualType:""
      },
      doctor:{
        jobId:"",
        password:"",
        qualification:false,
        qualType:""
      },
      hospital:{
        hospitalName: "",
        password:"",
        qualification:false,
        qualType:""
      },
      rules:{
        registerName:[
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度应为2到10个字符', trigger: 'blur' },
        ],
        registerPassword:[
          {pattern : /^\S*(?=\S{6,15})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/,
            message: '密码必须包含大小写字母和数字，且长度需在6-15位',
            trigger:'blur'
          },
          { required: true, message: '密码不能为空！', trigger: 'blur' }
        ],
        confirmPassword: [
          {validator: pswConfirmValidate, trigger: 'blur', required: true}
        ]
      }
    }
  },
  methods:{
    onSubmit(){
      this.$refs.registerForm.validate((isValid, invalidFields) => {
        if (isValid){
          this.user.loginName=this.registerForm.registerName
          this.user.jobId=this.registerForm.registerName
          this.user.hospitalName=this.registerForm.registerName
          this.user.password=sha1(this.registerForm.registerPassword)
          this.user.qualification=this.registerForm.qualification
          if (this.radio === '用户注册'){
            this.user.qualType = "免挂号绿色通道预约资质"
            axios.post("http://localhost/users",this.user).then(res =>{
              console.log(res)
              if (res.data === 'register success'){
                ElMessage({
                  message: '注册成功，即将前往登录页面',
                  type: 'success',
                })
                setTimeout(()=>{
                  this.$router.push({path: '/login', query:{select:'users'}})
                },1500)
              }
            })
          }
          else if(this.radio === '医生注册'){
            this.user.qualType = "从业资格证明"
            axios.post("http://localhost/doctors",this.user).then(res =>{
              console.log(res)
              if (res.data === 'register success'){
                ElMessage({
                  message: '注册成功，即将前往登录页面',
                  type: 'success',
                })
                setTimeout(()=>{
                  this.$router.push({path: '/login', query:{select:'doctors'}})
                },1500)

              }
            })
          }
          else{
            this.user.qualType = "机构资质证明"
            axios.post("http://localhost/hospitals",this.user).then(res =>{
              console.log(res)
              if (res.data === 'register success'){
                ElMessage({
                  message: '注册成功，即将前往登录页面',
                  type: 'success',
                })
                setTimeout(()=>{
                  this.$router.push({path: '/login', query:{select:'hospitals'}})
                },1500)

              }
            })
          }
        }
      })
    },
    onClick(){
      setTimeout(()=>{
        this.$router.push({path:'/login', query: {select: '用户入口'}})
      },1500)
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
.input-style{
  width: 400px;
  position: relative;
  left: 45px;
  top: 20px;
}
/*.text-style{*/
/*  position: relative;*/
/*  left: 166px;*/
/*  top: 20px;*/
/*}*/
.button-style{
  position: relative;
  left: 264px;
  top: 20px;
}
</style>