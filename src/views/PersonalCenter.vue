<template>
  <div v-show="personalInfoShow">
    <personal-info class="personal-info"/>
  </div>

<div>
  <el-form :model="updateData" label-width="120px" class="demo-border"
           :rules="rules"
  >
<!--    <el-select v-model="select" class="m-2" placeholder="请先选择登录入口" size="large" style="position: relative;left: 180px">-->
<!--      <el-option-->
<!--          v-for="item in loginCharacters"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value"-->
<!--      />-->
<!--    </el-select>-->
<!--    <el-row :gutter="20">-->
<!--      <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>-->
<!--      <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>-->
<!--      <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>-->
<!--      <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>-->
<!--    </el-row>-->
<!--      <el-form-item class="input-style" label="密码" prop="loginPassword">-->
<!--        <el-input type="password" v-model="form.loginPassword" show-password placeholder="输入密码"/>-->
<!--      </el-form-item>-->
      <!--                <el-form-item class="text-style">-->
      <!--                  <el-text type="primary">-->
      <!--                    没有账号？<el-button type="primary" plain>注册一个</el-button>-->
      <!--                  </el-text>-->
      <!--                </el-form-item>-->
<!--      <el-form-item class="button-style">-->
<!--        <el-button type="primary" @click="onSubmit">登录</el-button>-->
<!--      </el-form-item>-->
  </el-form>

  <el-menu
      active-text-color="#337ecc"
      default-active="1"
      background-color="#FAFCFF"
      class="el-menu-vertical-demo"
      text-color="#303133"
      @select=selectHandle
  >

    <el-menu-item index="personalInfo">
      <el-icon><Stamp /></el-icon>
      <span>个人信息</span>
    </el-menu-item>
    <el-menu-item index="2">
      <el-icon><Edit /></el-icon>
      <span>完善资料</span>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon><CircleCheckFilled /></el-icon>
      <span>资质认证</span>
    </el-menu-item>

  </el-menu>
</div>

</template>

<script>
import PersonalInfo from "@/components/PersonalInfo";
export default {
  name: "PersonalCenter",
  components:{
    PersonalInfo
  },
  data(){
    return{
      personalInfoShow:false,
      loginState:"",
      updateData:{

      },
      rules:{

      }
    }
  },
  methods:{
    selectHandle(key){
      if (key === 'personalInfo'){
          this.personalInfoShow = true
      }
    }
  },
  mounted() {
    this.loginState = window.localStorage.getItem('loginState')
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
.personal-info{
  position: absolute;
  top: 200px;
  left: 300px;
}
</style>