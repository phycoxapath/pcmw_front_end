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
<!--      下面input的value即为动态渲染时的attr，也即userData对应key的value-->
      {{attr}}<el-input v-model="newValue" :value=attr v-if="index === lineIndex && index!=='性别'"></el-input>

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
import {ElMessage} from "element-plus";


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
        id:"",
        loginName:"",
        gender:"",
        age:0,
        address:""
      }
    }
  },
  methods :{
    //lineIndex:所点击的行的index，即描述列表动态渲染时userData的key
    modify(type,input){
      this.lineIndex = type

    },
    cancel(){
      this.lineIndex = ""
    },
    //newValue双向绑定动态渲染出的所有行的输入框，但由于一次只修改一个属性，可以保证正常使用
    //点击save时传进来的newValue即为输入框中的新值
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
      this.user.id = window.localStorage.getItem('id')
      axios.put("http://localhost/users",this.user).then(res =>{
        if (res.data === 'update success'){
          ElMessage.success("保存成功")
        }
      })
      this.lineIndex = ""
    }
  },
  mounted() {
    this.user.loginName = window.localStorage.getItem('loginState')
    axios.get("http://localhost/"+window.localStorage.getItem('loginRole')+"/getById?id="+window.localStorage.getItem('id')).then(res =>{
      let i = 0,j = 0;
      for (const resKey in res.data) {
        if (resKey === 'password') {
          continue;
        }
        i++;
        for (const userKey in this.userData) {
          j++;
          if (i === j){
            if (res.data[resKey] === true || res.data[resKey] === false){
              this.userData[userKey] = res.data[resKey] === true ? '是' : '否'
            }else {
              this.userData[userKey] = res.data[resKey];
            }
            j = 0
            break;
          }
        }
      }

    })
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