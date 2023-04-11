<template>

  <el-descriptions
      class="margin-top"
      title="编辑信息"
      :column="1"
      size="large"
      border
  >
    <el-descriptions-item width="300"  v-for="(attr,index) in userData" :key="index">
      <template #label>
        {{index}}
      </template>
      {{attr}}<el-input v-model="newValue" :value=attr v-if="index === lineIndex && index!=='性别'"></el-input>
<!--      <el-input v-model="newAge" v-if="index ==='年龄'"></el-input>-->
<!--      <el-input v-model="newAddr" v-if="index ==='收货地址'"></el-input>-->
      <el-radio-group v-if="index === '性别' &&index === lineIndex" v-model="newGender">
        <el-radio label="男" size="large">男</el-radio>
        <el-radio label="女" size="large">女</el-radio>
      </el-radio-group>
       <el-button @click="modify(index)" v-if="attr !== '' &&attr!== null && index!=='id' && index!== '是否取得资质' && index!== '资质类型' && index!==lineIndex" type="primary" color=" #ecf5ff" ><el-icon><Edit/></el-icon>修改</el-button>
      <el-button @click="modify(index)" v-else-if="index!=='id' && index!== '是否取得资质' && index!== '资质类型' && index !== lineIndex" type="primary" color=" #ecf5ff" ><el-icon><Edit/></el-icon>添加</el-button>
        <el-button @click="save(index,newValue)" type="primary" color=" #ecf5ff" v-show="index === lineIndex">保存</el-button>
        <el-button @click="cancel" type="primary" color=" #ecf5ff" v-show="index === lineIndex">取消</el-button>
    </el-descriptions-item>
  </el-descriptions>

</template>

<script>
import axios from "axios";
import {Edit} from "@element-plus/icons-vue";


export default {
  name: "InfoEdit",
  components: {Edit},
  data(){
    return{
      lineIndex:"",
      newGender:"",
      newValue:"",
      form:{
        name:"",
        region:""
      },
      loginNameShow:true,
      userData:{
        id:"",
        用户名:"",
        性别:"",
        年龄:"",
        收货地址:"",
        是否取得资质:"",
        资质类型:"",
      },
      user:{
        loginName:"",
        gender:"",
        age:0,
        address:""
      }
    }
  },
  methods :{
    modify(type,input){
      this.lineIndex = type

    },
    cancel(){
      this.lineIndex = ""
    },
    save(type,newValue){
      if (type === '用户名'){
        this.userData.用户名 = newValue
        this.user.loginName = newValue
        window.localStorage.setItem('loginState',newValue)
      }
      else if (type === '性别'){
        this.userData.性别 = this.newGender
        this.user.gender = this.newGender
      }
      else if (type === '年龄'){
        this.userData.年龄 = newValue
        this.user.age = newValue
      }
      else if (type === '收货地址'){
        this.userData.收货地址 = newValue
        this.user.address = newValue
      }
      axios.put("http://localhost/users",this.user)
      this.lineIndex = ""
    }
  },
  mounted() {
    this.user.loginName = window.localStorage.getItem('loginState')
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
.edit-button-style{
  position: relative;
  left: 50px;
}
.margin-top{
  position: absolute;
  top: 100px;
  left: 550px;
}
</style>