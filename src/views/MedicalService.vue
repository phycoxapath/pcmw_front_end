<template>
  <router-view></router-view>
  <div  v-show="show" style=" position: fixed;">
    <el-scrollbar style="height: 100%">
      <el-menu
          active-text-color="#337ecc"
          background-color="#FAFCFF"
          class="el-menu-vertical-demo"
          text-color="#303133"
          :router="true"
          @open="handleOpen"
          @close="handleClose"
      >

        <el-sub-menu index="/medicalService">
          <template #title>
            <el-icon><location /></el-icon>
            <span>预约挂号</span>
          </template>
          <el-menu-item-group title="入驻医院">
            <el-sub-menu v-for="hospital in hospitals" :index=hospital.id.toString()>
              <template #title>{{hospital.hospitalName}}</template>
              <el-menu-item :index=baseIndex+param1+hospital.id+param1+dept.id v-for="dept in hospital.departments">{{dept.deptName}}</el-menu-item>
            </el-sub-menu>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu >
          <template #title>
            <el-icon><location /></el-icon>
            <span>重症挂号绿色通道</span>
          </template>
          <el-menu-item-group title="入驻医院" >
            <el-menu-item :index=greenChIndex+greenChParam+hospital.id v-for="hospital in hospitals">{{ hospital.hospitalName }}</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>

<!--  <el-card class="box-card0" :body-style="{backgroundColor:'#eafcff',padding:'100px'}">-->
<!--    <template #header>-->
<!--      <div class="card-header">-->
<!--        <span>Card name</span>-->
<!--        <el-button class="button" text>Operation button</el-button>-->
<!--      </div>-->
<!--    </template>-->
<!--    <div style="position:relative;bottom: 50px">-->
<!--      <span>123400000000000</span>-->
<!--    </div>-->
<!--    -->
<!--  </el-card>-->
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



</template>

<script>
import axios from "axios";

export default {
  name: "MedicalService",
  data(){
    return{
      baseIndex:"/medicalService/defaultRegistry",
      greenChIndex:"/medicalService/greenChannelRegistry",
      greenChParam:"?hospId=",
      param1:"/",
      param2:"&deptId=",
      loginState:"",
      show:false,
      loginPrompt:false,
      hospitals:[],
    }
  },
  methods:{
    onCLick(){
      this.$router.push('/login')
    },
    closeRedirect(done){
      this.$router.push('/login')
    }
  },
  mounted() {

    if (!window.localStorage.getItem('loginState')){
      this.loginPrompt = true
      //this.$router.push('/login')
    }else {
      this.show = true
    }
    axios.get("http://localhost/hospitals/getAllHospital").then(res=>{
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].qualification){
          this.hospitals.push(res.data[i])
        }
      }
    })
  }
}
</script>

<style scoped>
.el-menu-vertical-demo{
  width: 200px;
  height: 700px;
}
.div0{
  position: absolute;
  left: 200px;
  top: 150px;
  padding-right: 600px;
  padding-bottom: 70px;
  border: 2px solid #eafcff;
  background-color: #eafcff;
}
.div1{
  position: absolute;
  left: 200px;
  top: 350px;
  padding-right: 600px;
  padding-bottom: 70px;
  border: 2px solid #eafcff;
  background-color: #eafcff;
}
.div2{
  position: absolute;
  left: 200px;
  top: 550px;
  padding-right: 600px;
  padding-bottom: 70px;
  border: 2px solid #eafcff;
  background-color: #eafcff;
}
.dept0{
  position: absolute;
  left: 150px;
  top: 86px;
}
.dept1{
  position: absolute;
  left: 200px;
  top: 86px;
}
.dept2{
  position: absolute;
  left: 250px;
  top: 86px;
}
.box-card0{
  position: absolute;
  left: 250px;
  top: 86px;

}
</style>