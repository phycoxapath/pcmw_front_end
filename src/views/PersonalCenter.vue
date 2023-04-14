<template>
<router-view/>
<div>

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
    <el-menu-item :index=this.baseIndex+this.qualificationIndex>
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
      infoShowIndex:"",
      qualificationIndex:"",
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
              this.infoShowIndex = 'personalInfo'
              break
        case 'hospitals':
              this.infoEditIndex = 'hospitalInfoEdit'
              this.infoShowIndex = 'personalInfo'
              break
        case 'doctors':
              this.infoShowIndex = 'doctorInfo'
              this.infoEditIndex = 'doctorInfoEdit'
              break
      }
      axios.get("http://localhost/" + window.localStorage.getItem('loginRole') + "/getByName?name="+window.localStorage.getItem('loginState')).then(res => {
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