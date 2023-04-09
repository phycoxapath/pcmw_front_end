<template>
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
          console.log(res.data)
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

</style>