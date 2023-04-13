
  <template>

    <div class="common-layout">
      <el-container>
        <el-header>
          <div>

          </div>
        </el-header>
        <el-main>
          <div>
            <el-text class="mx-1" size="large" style="font-size: 30px;position: relative;left: 700px;bottom: 20px">登 录</el-text>
              <el-form :model="form" label-width="120px" class="demo-border"
                :rules="rules"
                ref="form"
              >
                <el-select v-model="select" class="m-2" placeholder="请先选择登录入口" size="large" style="position: relative;left: 180px">
                  <el-option
                      v-for="item in loginCharacters"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              <div v-show="select">
                <el-form-item class="input-style" label="用户名" prop="loginName">
                  <el-input v-model="form.loginName" placeholder="输入用户名" aria-required="true"/>
                </el-form-item>
                <el-form-item class="input-style" label="密码" prop="loginPassword">
                  <el-input type="password" v-model="form.loginPassword" show-password placeholder="输入密码"/>
                </el-form-item>
<!--                <el-form-item class="text-style">-->
<!--                  <el-text type="primary">-->
<!--                    没有账号？<el-button type="primary" plain>注册一个</el-button>-->
<!--                  </el-text>-->
<!--                </el-form-item>-->
                <el-form-item class="button-style">
                  <el-button type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" link @click="modifyPassword" style="position: relative; bottom: 20px">忘记密码</el-button>
                </el-form-item>
              </div>
            </el-form>
            </div>

        </el-main>
      </el-container>
    </div>

  </template>


<script>
import axios from 'axios'
import sha1 from 'sha1'
import {ElMessage} from "element-plus";
export default {
  name: "LoginView",
  data(){
    return{
      encodedPsw:"",
      select:this.$route.query.select,
      loginCharacters:[
        {label:"用户入口",value:"users"},
        {label:"医生入口",value:"doctors"},
        {label:"医疗机构入口",value:"hospitals"}
      ],
      rules:{
        loginName: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度应为2到10个字符', trigger: 'blur' },
        ],
        loginPassword:[
          {min:6,max:15,message: '密码长度应为6-15位',trigger: "blur"},
          { required: true, message: '密码不能为空！', trigger: 'blur' }

        ]
      },
      form:{
        loginName:this.$cookies.get('loginName'),
        loginPassword:""
      },

    }
  },
  methods : {

    onSubmit(){
      this.$refs.form.validate(valid =>{
        if (valid){
          this.encodedPsw = sha1(this.form.loginPassword)

            axios.get("http://localhost/"+this.select+"/"+this.form.loginName+"/"+this.encodedPsw).then(res =>{
              console.log(res)
              if (res.data === 'login success'){
                //loginState 判断登录状态，value为登录名
                //loginRole 判断登录角色，目前三角色分别为users doctors hospitals，对应三个controller的RequestMapping
                window.localStorage.setItem("loginState",this.form.loginName)
                window.localStorage.setItem("loginRole",this.select)
                if (!this.$cookies.isKey('loginName') || this.$cookies.get('loginName') !== this.form.loginName){
                  this.$cookies.set('loginName',this.form.loginName)
                  console.log("cookie setting")
                }

                ElMessage({
                  message: '登录成功，即将前往首页',
                  type: 'success',
                })
                setTimeout(() =>{
                  window.location.href = 'http://localhost:8080/'
                },1500)
              }
              else if (res.data === 'login name or password error'){
                ElMessage.error("用户名或密码错误")
              }
              else
                ElMessage.error("系统繁忙，请稍后再试")
            })
          }

      })
    },
    modifyPassword(){
      this.$router.push({path: '/resetPassword',query:{role:this.select}})
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