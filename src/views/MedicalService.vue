<template>
  <router-view></router-view>
  <div  v-show="show">
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
            <!--        <el-sub-menu index="1-1" >-->
            <!--          <template #title>医院1</template>-->
            <!--          <el-menu-item index="1-1-1">科室1</el-menu-item>-->
            <!--          <el-menu-item index="1-1-2">科室2</el-menu-item>-->
            <!--          <el-menu-item index="1-1-3">科室3</el-menu-item>-->
            <!--        </el-sub-menu>-->
            <!--        <el-sub-menu index="1-2" >-->
            <!--          <template #title>医院2</template>-->
            <!--          <el-menu-item index="1-2-1">科室1</el-menu-item>-->
            <!--          <el-menu-item index="1-2-2">科室2</el-menu-item>-->
            <!--          <el-menu-item index="1-2-3">科室3</el-menu-item>-->
            <!--        </el-sub-menu>-->
            <!--        <el-sub-menu index="1-3" >-->
            <!--          <template #title>医院3</template>-->
            <!--          <el-menu-item index="1-3-1">科室1</el-menu-item>-->
            <!--          <el-menu-item index="1-3-2">科室2</el-menu-item>-->
            <!--          <el-menu-item index="1-3-3">科室3</el-menu-item>-->
            <!--        </el-sub-menu>-->


          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><location /></el-icon>
            <span>重症绿色挂号通道</span>
          </template>
          <el-menu-item-group title="Group One">
            <el-menu-item index="1-1" >item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>

  <div v-for="(hospital,index) in hospitals" :key="index" :class="'div'+index">
    <el-text size="large" style="font-size: 20px">{{hospital.hospitalName}}</el-text>
    <br/>
    <el-text size="large" style="position:relative; left: 100px">医院简介:</el-text>
    <br/><br/><br/><br/><br/>
    <el-text size="large" style="position:relative; left: 50px">热门科室</el-text>
    <div v-for="(department,subIndex) in hospital.departments.splice(0,3)" :key="subIndex">
      <el-button type="text">{{department.deptName}}</el-button>
    </div>

  </div>
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
      this.hospitals = res.data
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
  top: 90px;
  padding-right: 1200px;
  padding-bottom: 200px;
}
.div1{
  position: absolute;
  left: 200px;
  top: 300px;
  padding-right: 1200px;
  padding-bottom: 200px;

}
.div2{
  position: absolute;
  left: 200px;
  top: 500px;
  padding-right: 1200px;
  padding-bottom: 200px;

}
</style>