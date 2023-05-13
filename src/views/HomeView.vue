<template>
  <div>
    <h1 style="text-align: center">欢迎访问pcmw后疫情时代便民医疗服务网站！</h1>
  </div>
<div class="mainContent">
  <div style="height: 130px">
    <h2 style="margin-left: 45px">简介</h2>
    <span style="display: block;text-indent: 45px;font-size: 17px;">pcmw是一个基于保守防疫政策转向放开、新冠乙类乙管等时代背景的、
      契合新时代特点的便民医疗服务网站。本站点面向普通用户提供普通预约、绿色通道预约、疫苗预约与接种记录查询、抗疫物资专售商城等服务。
      医生与医疗机构入驻简便快捷，作为服务提供者对暴露给用户的服务有一定客制化能力。
    </span>
  </div>
  <el-divider border-style="dashed"></el-divider>
  <div style="height: 170px">
  <h2 style="margin-left: 45px">特点与优势</h2>
    <ul style="margin-left: 25px">
      <li >普通用户层面服务较齐全，功能较丰富</li>
      <br/>
      <li>医生、医院可一定程度客制化暴露给用户的服务，入驻上线简单便捷</li>
      <br/>
      <li>契合后疫情时代重复感染多次感染特点，在感染高峰期为医院削峰分流，在疫情平稳期依然能提供基础服务</li>
    </ul>
  </div>
  <el-divider border-style="dashed"></el-divider>
  <div>
    <h2 style="margin-left: 45px">快捷导航</h2>
    <ul style="margin-left: 25px">
      <li><el-link style="display: block;font-size: 17px" :underline="false">医疗服务入口</el-link></li>
      <br/>
      <li><el-link style="display: block;font-size: 17px" :underline="false">疫苗服务入口</el-link></li>
      <br/>
      <li><el-link style="display: block;font-size: 17px" :underline="false">商城服务入口</el-link></li>
    </ul>

  </div>
</div>
  <div class="hospNotice">
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span style="font-size: 16px">入驻医院公告</span>
        </div>
      </template>
      <div style="height: 40px" v-for="(notice,index) in recentNotices" :key="index" class="text item"><el-link @click="noticeDetailsDialog = true;showIndex = index;paragraph = notice.noticeMain.split('\n')" :underline="false">{{notice.noticeTitle}}</el-link></div>
      <el-link style="float: right;margin-top: 70px" :underline="false" @click="this.$router.push('/browseNotice')">查看更多...</el-link>
    </el-card>
  </div>
  <div class="externalPage">

  </div>
  <div>
    <el-dialog title="公告详情" draggable width="1080" v-model="noticeDetailsDialog">
     <div style="width: 1000px;height: 560px;background-color: #ffffff">
       <div>
         <el-text style="display: block;text-align: center;font-size: 22px;font-weight: bold;font-family:'Microsoft JhengHei UI Light';margin-top: 10px">{{recentNotices[showIndex].noticeTitle}}</el-text>
       </div>
       <div>
         <el-text style="display: block;text-align: center;">{{recentNotices[showIndex].noticePublisher}} {{recentNotices[showIndex].postTime}}</el-text>
       </div>
       <el-divider></el-divider>
       <div style="margin-top: 20px">
         <el-text v-for="p in paragraph" style="display: block;font-size: 17px; text-indent: 34px">{{p}}<br/></el-text>
       </div>
     </div>

    </el-dialog>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'HomeView',
  components: {

  },
  data(){
    return{
      noticeDetailsDialog:false,
      showIndex:0,
      recentNotices:[],
      paragraph:[],

    }
  },
  watch:{
    '$route' (to , from){
      if (window.localStorage.getItem('loginState') !== '' || window.localStorage.getItem('loginState') !== null) {
        if (window.localStorage.getItem('loginRole') !== 'admin') {
          axios.get("http://localhost/" + window.localStorage.getItem('loginRole') + "/getByName?name=" + window.localStorage.getItem('loginState')).then(res => {
            window.localStorage.setItem('id', res.data.id)
          })
        }
      }
    }
  },
  mounted() {
    if (window.localStorage.getItem('loginState') !== '' || window.localStorage.getItem('loginState') !== null) {
      if (window.localStorage.getItem('loginRole') !== 'admin') {
        axios.get("http://localhost/" + window.localStorage.getItem('loginRole') + "/getByName?name=" + window.localStorage.getItem('loginState')).then(res => {
          window.localStorage.setItem('id', res.data.id)
        })
      }
    }
    axios.get("http://localhost/common/getRecentHospNotice").then(res=>{
      this.recentNotices = res.data
    })
  }
}
</script>

<style scoped>
.mainContent{
  border: 1px solid #c8c9cc;
  border-radius: 10px;
  width: 1100px;
  height: 600px;
  background-color: #ffffff;
  margin-left: 60px;
}
.hospNotice{
  background-color: #c8c9cc;
  width: 300px;
  height: 300px;
  position: fixed;
  right: 60px;
  top: 143px;
}
.externalPage{
  background-color: #c8c9cc;
  width: 300px;
  height: 300px;
  position: fixed;
  right: 60px;
  top: 450px;
}
li.myClass{
  font-size: 17px;
}
.box-card{
  height: 300px;
}
</style>
