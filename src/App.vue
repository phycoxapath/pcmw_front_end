<template>
<div id="building">
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    :router="true"
    active-text-color="#337ecc"
    @select="handleSelect"
>
  <el-menu-item index="/" style="width: 150px" >首页</el-menu-item>
  <el-menu-item index="/adminHome" class="menu-style"  v-show="loginRole === 'admin'">角色管理</el-menu-item>
  <el-menu-item index="/shoppingMana" class="menu-style"  v-show="loginRole === 'admin'">商城管理</el-menu-item>
  <el-menu-item index="/greenChannelManaView" class="menu-style" v-show="this.loginRole==='hospitals'">绿色通道受理</el-menu-item>
  <el-menu-item index="/medicalService" class="menu-style" v-show="!this.loginState||this.loginRole==='users'">医疗业务</el-menu-item>
  <el-menu-item index="/userVaccineAppoint" class="menu-style" v-show="!this.loginState||this.loginRole==='users'">疫苗预约</el-menu-item>
    <el-menu-item index="/appointManaView" class="menu-style" v-show="this.loginRole==='doctors'">预约管理</el-menu-item>
    <el-menu-item index="/hospitalVaccineMana" class="menu-style" v-show="this.loginRole==='hospitals'">疫苗管理</el-menu-item>
  <el-menu-item index="/shoppingMall" class="menu-style" v-show="this.loginRole === 'users'|| !this.loginState">商城入口</el-menu-item>
  <el-menu-item index="/hospitalDeptMana" class="menu-style" v-show="this.loginRole === 'hospitals'">科室人员管理</el-menu-item>
  <el-menu-item index="/hospNoticeMana" class="menu-style" v-show="this.loginRole === 'hospitals'">公告管理</el-menu-item>
  <div class="flex-grow" />
  <el-menu-item index="/login" style="color: #409EFF;" v-show="!loginState">登录</el-menu-item>
  <el-menu-item index="/register" style="color: #409EFF;" v-show="!loginState">注册</el-menu-item>
  <el-sub-menu index="userConfig" style="color: #409EFF" v-show="loginState && loginRole !== 'admin'">
    <template #title>您好，{{ loginState }}</template>
    <el-menu-item index="/personalCenter"><el-icon><User /></el-icon> 个人中心</el-menu-item>
    <el-menu-item index="exitLogin"><el-icon><CloseBold /></el-icon> 退出登录</el-menu-item>
  </el-sub-menu>
  <el-sub-menu index="adminConfig" style="color: #409EFF" v-show="loginState && loginRole === 'admin'">
    <template #title>您好，{{ loginState }}</template>
    <el-menu-item index="exitLogin"><el-icon><CloseBold /></el-icon> 退出登录</el-menu-item>
  </el-sub-menu>

</el-menu>
  <router-view/>
</div>

</template>
<script>

export default {
  data(){
    return{
      loginState:"",
      loginRole:"",
      exitLogin:""
    }
  },
  methods:{
    handleSelect(key){
      console.log(key)
      if (key === 'exitLogin' && this.loginRole !== 'admin'){
        if (window.localStorage.getItem('loginState')) {
          window.localStorage.removeItem('loginState')
          window.localStorage.removeItem('loginRole')
          window.localStorage.removeItem('id')
          window.location.href = "http://localhost:8080/"
        }
      }else if (key === 'exitLogin' && this.loginRole === 'admin') {
        window.localStorage.removeItem('loginState')
        window.localStorage.removeItem('loginRole')
        window.localStorage.removeItem('jwt')
        window.location.href = "http://localhost:8080/"
      }

    }
  },
  mounted() {
    this.loginState = window.localStorage.getItem('loginState')
    this.loginRole = window.localStorage.getItem('loginRole')

  }
}
</script>
<style>
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  margin-top: 0px;
}
body{
  margin:0;
  padding:0;
  border:0
}
#building{
  background:url("assets/background.png");
  width:100%;
  height:100%;
  position:fixed;
  background-size:100% 100%;

}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

/*nav a.router-link-exact-active {*/
/*  color: #42b983;*/
/*}*/
.flex-grow {
  flex-grow: 1;
}
.menu-style{
  width:250px;
  position:relative;
  left: 100px;
  /*border-right: #FAFAFA;*/
}
</style>
