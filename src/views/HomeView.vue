<template>
  <div>
    <h1 style="text-align: center">欢迎访问pcmw后疫情时代便民医疗服务网站！</h1>
  </div>
<div class="mainContent">
  <div style="border: 2px solid #474747;height: 180px">
    <h2 style="margin-left: 45px">简介</h2>
    <span style="display: block;text-indent: 45px;font-size: 17px;">pcmw是一个基于保守防疫政策转向放开、新冠乙类乙管等时代背景的、
      契合新时代特点的便民医疗服务网站。本站点面向普通用户提供普通预约、绿色通道预约、疫苗预约与接种记录查询、抗疫物资专售商城等服务。
      医生与医疗机构入驻简便快捷，作为服务提供者对暴露给用户的服务有一定客制化能力。
    </span>
  </div>
  <div>
  <h2 style="margin-left: 45px">特点与优势</h2>
    <ul style="margin-left: 25px">
      <li >普通用户层面服务较齐全，功能较丰富</li>
      <br/>
      <li>医生、医院可一定程度客制化暴露给用户的服务，入驻上线简单便捷</li>
      <br/>
      <li>契合后疫情时代重复感染多次感染特点，在感染高峰期为医院削峰分流，在疫情平稳期依然能提供基础性服务</li>
    </ul>
  </div>
</div>
  <div class="hospNotice">

  </div>
  <div class="externalPage">

  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'HomeView',
  components: {

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
  }
}
</script>

<style scoped>
.mainContent{
  border: 2px solid #c8c9cc;
  width: 1100px;
  height: 600px;
  background-color: #c8c9cc;
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
</style>
