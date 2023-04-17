<template>


  <el-alert v-show="infoCompletion" style="width: 600px" :closable="false" title="您的个人资料尚未完善，请通过左侧导航栏<完善资料>完善个人资料" type="warning" show-icon class="alert-info"/>

  <el-descriptions
      class="margin-top"
      title="个人信息"
      :column="1"
      size="large"
      border

  >
   <el-descriptions-item width="300"  v-for="(attr,index) in showData" :key="index">
     <template #label>
         {{index}}
     </template>
     <span v-show="index !== '工作日'" @click="test(attr)">{{attr}}</span>
     <span v-show="index === '工作日' && (attr & week.Mon) > 0">周一 </span>
     <span v-show="index === '工作日' && (attr & week.Tues) > 0">周二 </span>
     <span v-show="index === '工作日' && (attr & week.Wed) > 0">周三 </span>
     <span v-show="index === '工作日' && (attr & week.Thur) > 0">周四 </span>
     <span v-show="index === '工作日' && (attr & week.Fri) > 0">周五 </span>
     <span v-show="index === '工作日' && (attr & week.Sat) > 0">周六 </span>
     <span v-show="index === '工作日' && (attr & week.Sun) > 0">周日 </span>
   </el-descriptions-item>

  </el-descriptions>
  <div v-show="loginRole === 'hospitals'">
    <el-text size="large" style="position: absolute; left: 550px;top: 460px">下属科室：</el-text>
      <el-table :header-cell-style="{background:'#F5F7FA'}" :data="dept" height="250" stripe style="width: 39%;position:absolute;left: 550px;top: 480px;background-color: #FAFAFA" >
        <el-table-column prop="hospName" label="机构名" width="250" />
        <el-table-column prop="deptName" label="科室名" width="340" />
      </el-table>

  </div>

</template>

<script>
import axios from 'axios'
export default {
  name: "PersonalInfo",
  data(){
    return{
      loginRole:"",
      infoCompletion:false,
      week:{
        Mon:64,
        Tues:32,
        Wed:16,
        Thur:8,
        Fri:4,
        Sat:2,
        Sun:1
      },
      dept:[

      ],
      showData: {

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
      hospitalData:{
        id:"",
        医院名称:"",
        是否取得资质:"",
        资质类型:""
      },
      doctorData:{
        id:"",
        工号:"",
        姓名:"",
        性别:"",
        工作日:"",
        所属科室:"",
        是否取得资质:"",
        资质类型:""
      }
    }
  },
  methods:{
    test(workingDay){
      console.log((workingDay & this.week.Mon)>0)
    }
  },
  mounted() {
        this.loginRole = window.localStorage.getItem('loginRole')
        if (window.localStorage.getItem('loginRole') === 'hospitals'){
          axios.get("http://localhost/hospitals/getById?id="+window.localStorage.getItem('id')).then(res=>{
            for (let i = 0; i < res.data.departments.length; i++) {
              this.dept.push({
                hospName:window.localStorage.getItem('loginState'),
                deptName:res.data.departments[i].deptName
              })
            }
          })
        }
        axios.get("http://localhost/"+window.localStorage.getItem('loginRole')+"/getById?id="+window.localStorage.getItem('id')).then(res =>{
          //根据loginRole选择要展示的数据框架
          switch (window.localStorage.getItem('loginRole')){
            case 'users':
              this.showData = this.userData
                  break
            case 'hospitals':
              this.showData = this.hospitalData
                  break
            case 'doctors':
              this.showData = this.doctorData
              break
          }
          let i = 0,j = 0;
          //跳过展示密码，并将其他属性对齐
          for (const resKey in res.data) {
            if (resKey === 'password') {
              continue;
            }
            i++;
            for (const userKey in this.showData) {
              j++;
              if (i === j){
                if (res.data[resKey] === true || res.data[resKey] === false){
                  this.showData[userKey] = res.data[resKey] === true ? '是' : '否'
                }else {
                  this.showData[userKey] = res.data[resKey];
                }
                j = 0
                break;
              }
            }
            if (resKey === 'qualType')
              break;
          }
          //userData中还有空值就显示提醒框el-alert
          for (const userDataKey in this.showData) {
            if (this.showData[userDataKey] === "" || this.showData[userDataKey] === null){
              this.infoCompletion = true;
              break;
            }
          }
        })


  }

}
</script>

<style scoped>
.margin-top{
  position: absolute;
  top: 150px;
  left: 550px;
}
.alert-info{
  position: absolute;
  top: 80px;
  left: 550px;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 400px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background:  #c8c9cc;
  color: #303133;
  
}
</style>