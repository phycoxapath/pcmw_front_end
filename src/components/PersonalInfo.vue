<template>


  <el-alert v-show="infoCompletion" style="width: 600px" :closable="false" title="您的个人资料尚未完善，请通过左侧导航栏<完善资料>完善个人资料" type="warning" show-icon class="alert-info"/>

  <el-descriptions
      class="margin-top"
      title="个人信息"
      :column="1"
      size="large"
      border

  >
   <el-descriptions-item width="300"  v-for="(attr,index) in userData" :key="index">
     <template #label>
         {{index}}
     </template>
     {{attr}}
   </el-descriptions-item>

  </el-descriptions>

</template>

<script>
import axios from 'axios'
export default {
  name: "PersonalInfo",
  data(){
    return{
      infoCompletion:false,
      loginRole:"",
      loginState:"",
      formInline:{
        user:"",
        region:""
      },
      userData:{
        id:"",
        用户名:"",
        性别:"",
        年龄:"",
        收货地址:"",
        是否取得资质:"",
        资质类型:"",
      },
      userData1:{

      }
    }
  },
  methods:{

  },
  mounted() {

    if (window.localStorage.getItem('loginRole') === 'user'){
        axios.get("http://localhost/users/"+window.localStorage.getItem('loginState')).then(res =>{
          let i = 0,j = 0;
          for (const resKey in res.data) {
            if (resKey === 'password') {
              continue;
            }
            i++;
            for (const userKey in this.userData) {
              j++;
              if (i === j){
                this.userData[userKey] = res.data[resKey];
                j = 0
                break;
              }
            }
          }
          for (const userDataKey in this.userData) {
            if (this.userData[userDataKey] === "" || this.userData[userDataKey] === null){
              this.infoCompletion = true;
              break;
            }
          }
        })
    }
    else if (window.localStorage.getItem('loginRole') === 'doctor'){

    }
    else if (window.localStorage.getItem('loginRole') === 'hospital'){

    }
  }

}
</script>

<style scoped>
.margin-top{
  position: absolute;
  top: 200px;
  left: 550px;
}
.alert-info{
  position: absolute;
  top: 80px;
  left: 550px;
}
</style>