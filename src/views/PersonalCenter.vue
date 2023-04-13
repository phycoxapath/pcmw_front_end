<template>
<!--  <div v-show="personalInfoShow">-->
<!--    <el-alert v-show="alertShow" style="width: 600px" :closable="false" title="您的个人资料尚未完善，请通过左侧导航栏<完善资料>完善个人资料" type="warning" show-icon class="alert-info"/>-->
<!--  </div>-->
<!--  <div v-show="infoEditShow">-->
<!--    <info-edit class="info-edit"/>-->
<!--  </div>-->
<router-view/>
<div>
<!--  <el-form :model="updateData" label-width="120px" class="demo-border"-->
<!--           :rules="rules"-->
<!--  >-->
<!--&lt;!&ndash;    <el-select v-model="select" class="m-2" placeholder="请先选择登录入口" size="large" style="position: relative;left: 180px">&ndash;&gt;-->
<!--&lt;!&ndash;      <el-option&ndash;&gt;-->
<!--&lt;!&ndash;          v-for="item in loginCharacters"&ndash;&gt;-->
<!--&lt;!&ndash;          :key="item.value"&ndash;&gt;-->
<!--&lt;!&ndash;          :label="item.label"&ndash;&gt;-->
<!--&lt;!&ndash;          :value="item.value"&ndash;&gt;-->
<!--&lt;!&ndash;      />&ndash;&gt;-->
<!--&lt;!&ndash;    </el-select>&ndash;&gt;-->
<!--&lt;!&ndash;    <el-row :gutter="20">&ndash;&gt;-->
<!--&lt;!&ndash;      <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>&ndash;&gt;-->
<!--&lt;!&ndash;    </el-row>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-form-item class="input-style" label="密码" prop="loginPassword">&ndash;&gt;-->
<!--&lt;!&ndash;        <el-input type="password" v-model="form.loginPassword" show-password placeholder="输入密码"/>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-form-item>&ndash;&gt;-->
<!--      &lt;!&ndash;                <el-form-item class="text-style">&ndash;&gt;-->
<!--      &lt;!&ndash;                  <el-text type="primary">&ndash;&gt;-->
<!--      &lt;!&ndash;                    没有账号？<el-button type="primary" plain>注册一个</el-button>&ndash;&gt;-->
<!--      &lt;!&ndash;                  </el-text>&ndash;&gt;-->
<!--      &lt;!&ndash;                </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-form-item class="button-style">&ndash;&gt;-->
<!--&lt;!&ndash;        <el-button type="primary" @click="onSubmit">登录</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-form-item>&ndash;&gt;-->
<!--  </el-form>-->
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
  <el-menu
      active-text-color="#337ecc"
      default-active="1"
      background-color="#FAFCFF"
      class="el-menu-vertical-demo"
      text-color="#303133"
      :router="true"
      @select=selectHandle
  >

    <el-menu-item index="/personalCenter/personalInfo">
      <el-icon><Stamp /></el-icon>
      <span>个人信息</span>
    </el-menu-item>
    <el-menu-item :index=this.baseIndex+this.infoEditIndex>
      <el-icon><Edit /></el-icon>
      <span>完善资料</span>
    </el-menu-item>
    <el-menu-item index="/personalCenter/userQualification">
      <el-icon><CircleCheckFilled /></el-icon>
      <span>资质认证</span>
    </el-menu-item>
    <el-menu-item index="/personalCenter/modifyPassword">
      <el-icon><EditPen /></el-icon>
      <span>修改密码</span>
    </el-menu-item>

  </el-menu>
</div>

</template>

<script>
import axios from "axios";
export default {
  name: "PersonalCenter",
  components:{
  },
  data(){
    return{
      baseIndex:"/personalCenter/",
      infoEditIndex:"",
      loginPrompt:false,
      alertShow:true,
      personalInfoShow:false,
      infoEditShow:false,
      loginState:"",
      updateData:{

      },
      rules:{

      }
    }
  },
  methods:{
    selectHandle(key){

    },
    onCLick(){
      this.$router.push('/login')
    },
    closeRedirect(done){
      this.$router.push('/login')
    }

  },
  mounted() {
    this.loginState = window.localStorage.getItem('loginState')
    this.loginPrompt = !window.localStorage.getItem('loginState')
    if(this.loginState) {
      switch (window.localStorage.getItem('loginRole')){
        case 'users':
              this.infoEditIndex = 'infoEdit'
              break
        case 'hospitals':
              this.infoEditIndex = 'hospitalInfoEdit'
              break
        case 'doctors':

              break
      }
      axios.get("http://localhost/" + window.localStorage.getItem('loginRole') + "/" + this.loginState).then(res => {
        window.localStorage.setItem('id', res.data.id)
      })
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.el-menu-vertical-demo{
  width: 200px;
  height: 700px;
}


</style>