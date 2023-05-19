<template>
<!--  style="position:absolute;top: 100px;left: 400px"-->
  <div style="position:absolute;top: 100px;left: 400px">
    <el-calendar style="width: 70%;" :range="range">
      <template #header="{ date }">
        <span>{{hospName}} / {{deptName}}</span>
        <span>{{date}}</span>
      </template>
      <template #date-cell="{ data }" >
        <p :class="data.isSelected ? 'is-selected' : ''"  style="text-align: center">
          {{ data.day.split('-').slice(1).join('-') }}
          {{ data.isSelected ? '✔️' : '' }}
        </p>
          <el-button v-show="registryAvailable(data)" @click="registryHandle(data)" type="success" size="small" style="position:relative;left: 22px;bottom: 10px">有号</el-button>
      </template>
    </el-calendar>
  </div>
<!--  <div>-->
<!--    <el-calendar   >-->
<!--      <template #date-cell="{ data }">-->
<!--        <p :class="data.isSelected ? 'is-selected' : ''">-->
<!--          {{ data.day.split('-').slice(1).join('-') }}-->
<!--          {{ data.isSelected ? '✔️' : '' }}-->
<!--        </p>-->
<!--      </template>-->
<!--    </el-calendar>-->
<!--  </div>-->
  <div>
    <el-dialog v-model="appointDialog" title="预约详情" width="1050px" draggable>
      <el-table height="500" :data="appointDetail">
        <el-table-column label="序号" prop="originIndex" ></el-table-column>
        <el-table-column label="医生姓名" prop="docName" >
          <template #default="scope">
            <el-popover width="200" placement="top" trigger="hover">
              <template #reference>
                <el-link :underline="false" @click="showDocDetail(scope.row.originIndex)">{{scope.row.docName}}</el-link>
              </template>
              <span>点击查看医生详细信息</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" />
        <el-table-column label="科室" prop="deptName" />
        <el-table-column label="医生职级" prop="docTitle" />
        <el-table-column label="预约时间段" prop="timeFragment" >
          <template #default="scope">
            <el-select  v-model="timeFragment[scope.$index]" placeholder="请选择时间段" >
              <el-option key="1" label="9:00" value="9:00:00"/>
              <el-option key="2" label="15:00" value="15:00:00"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="appointAppendix" >
          <template #default="scope">
            <el-popover placement="bottom" width="400" trigger="click">
              <template #reference>
                <el-button size="small">点击填写</el-button>
              </template>
              <el-input type="textarea" v-model="appendix" placeholder="填写备注（200字以内）"></el-input>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="handle" >
          <template #default="scope">
            <el-button size="small"  type="success" @click="submitAppoint(scope.row.originIndex,scope.row)">预约</el-button>
            <el-text size="small" style="float: right;">剩余：{{this.doctors[scope.row.originIndex].remainRegistry}}</el-text>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-model="docDetailsDialog" title="医生详细信息" draggable>
      <el-descriptions
          class="margin-top"
          title="医生信息"
          :column="1"
          size="default"
          border

      >
      <el-descriptions-item width="300"  v-for="(attr,index) in showData" :key="index">
        <template #label>
          {{index}}
        </template>
        <span v-show="index !== '工作日' && index !=='医院简介' && index !== '医生简介'" >{{attr}}</span>
        <el-popover width="300" trigger="hover" placement="top">
          <template #reference>
            <el-text v-show="index === '医生简介'" style="width: 300px" truncated>{{attr}}</el-text>
          </template>
          <span>{{attr}}</span>
        </el-popover>

        <span v-show="index === '工作日' && (attr & week.Mon) > 0">周一 </span>
        <span v-show="index === '工作日' && (attr & week.Tues) > 0">周二 </span>
        <span v-show="index === '工作日' && (attr & week.Wed) > 0">周三 </span>
        <span v-show="index === '工作日' && (attr & week.Thur) > 0">周四 </span>
        <span v-show="index === '工作日' && (attr & week.Fri) > 0">周五 </span>
        <span v-show="index === '工作日' && (attr & week.Sat) > 0">周六 </span>
        <span v-show="index === '工作日' && (attr & week.Sun) > 0">周日 </span>
      </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="docDetailsDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>

</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "DefaultRegistry",
  data(){
    return{
      appendix:"",
      timeFragment:[],
      appointDetail:[],
      appointDialog:false,
      docDetailsDialog:false,
      hospId:0,
      deptId:0,
      hospName:"",
      deptName:"",
      doctors:[],
      range:[new Date(),new Date().setMonth(new Date().getMonth()+1)],
      appointmentDTO:{},
      showData:{
        工号:"",
        姓名:"",
        性别:"",
        职称:"",
        工作日:"",
        所属科室:"",
        医生简介:"",
        是否取得资质:"",
        资质类型:""
      },
      week:{
        Mon:64,
        Tues:32,
        Wed:16,
        Thur:8,
        Fri:4,
        Sat:2,
        Sun:1
      },
    }
  },
  methods:{
    registryHandle(data){
      console.log(data)
      console.log(this.doctors)
      this.appendix = ""
      this.timeFragment.splice(0,this.timeFragment.length)
      Date.prototype.toLocaleString = function (){
        let monthLessTen = this.getMonth() < 10 ? "0": ""
        let dateLessTen = this.getDate() < 10 ? "0" : ""
        let hourLessTen = this.getHours() < 10 ? "0" : ""
        let minuteLessTen = this.getMinutes() < 10 ? "0" : ""
        let secondLessTen = this.getSeconds() <10 ? "0" : ""

        return (
            this.getFullYear() +
            "-" +monthLessTen+
            (this.getMonth() + 1) +
            "-" +dateLessTen+
            this.getDate() +
            " " +hourLessTen+
            this.getHours() +
            ":" +minuteLessTen+
            this.getMinutes() +
            ":" +secondLessTen+
            this.getSeconds()

        );
      }
      this.appointDetail.splice(0,this.appointDetail.length)
      for (let i = 0; i < this.doctors.length; i++) {
        if ((2**((7-data.date.getDay())%7) & this.doctors[i].workingDay) > 0) {
          this.appointDetail.push({
            originIndex:i,
            docName: this.doctors[i].docName,
            gender: this.doctors[i].gender,
            deptName: this.doctors[i].deptName,
            docTitle: this.doctors[i].docTitle,
            timeFragment: data.day,
          })
        }
      }

      this.appointDialog = true
    },
    registryAvailable(data){
      for (let i = 0; i < this.doctors.length; i++) {
        if (data.date < new Date() || (data.date.getMonth()-new Date().getMonth())*30+data.date.getDate()-new Date().getDate() > 30)
          return false
        if ((2**((7-data.date.getDay())%7) & this.doctors[i].workingDay) > 0){
          if (this.doctors[i].remainRegistry > 0)
          return true
        }
        if (i === this. doctors.length - 1)
          return false
      }


    },
    submitAppoint(rowIndex,row){
      console.log(row.timeFragment)
      if (this.doctors[rowIndex].remainRegistry <= 0){
        ElMessage.error("当前医生已无号!")
        return false
      }
      if (this.timeFragment.length === 0){
        ElMessage.error("请选择预约时间段!")
        return false
      }
      row.timeFragment = row.timeFragment +' '+ this.timeFragment[rowIndex]
      if (this.appendix.length > 200){
        ElMessage.error("备注字数超出限制!")
        return false
      }
      this.appointmentDTO.initiatorId = window.localStorage.getItem('id')
      this.appointmentDTO.handlerId = this.doctors[rowIndex].id
      this.appointmentDTO.appointType = '普通预约'
      this.appointmentDTO.appointAppendix = this.appendix
      this.appointmentDTO.appointTime = row.timeFragment
      axios.post("http://localhost/appointments/saveAppointment",this.appointmentDTO).then(res =>{
        if (res.data === 'save success') {
          ElMessage.success("预约成功!")
          this.appointDialog = false
        }
        else
          ElMessage.error("系统繁忙，请稍后再试!")
      })

    },
    showDocDetail(rowIndex){
      axios.get("http://localhost/doctors/getById?id=" + this.doctors[rowIndex].id).then(res => {
        console.log(res.data)
        let i = 0, j = 0
        for (const resKey in res.data) {
          if (resKey === 'id') {
            continue;
          }
          if (resKey === 'password') {
            continue;
          }
          i++;
          for (const userKey in this.showData) {
            j++;
            if (i === j) {
              if (res.data[resKey] === true || res.data[resKey] === false) {
                this.showData[userKey] = res.data[resKey] === true ? '是' : '否'
              } else {
                this.showData[userKey] = res.data[resKey];
              }
              j = 0
              break;
            }
          }
          if (resKey === 'qualType')
            break;
        }
      })
      this.docDetailsDialog = true
    }
  },
  watch:{
    '$route' (to, from){
      this.hospId = this.$route.query.hospId
      this.deptId = this.$route.query.deptId
      axios.get("http://localhost/doctors/getByDeptId?deptId="+this.deptId).then(res=>{
        this.doctors.splice(0,this.doctors.length)
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].qualification){
            this.doctors.push(res.data[i])
          }
          for (let i = 0; i < this.doctors.length; i++) {
            axios.get("http://localhost/appointments/getCountByHandlerId?id="+this.doctors[i].id).then(res=>{
              this.doctors[i].remainRegistry = 10-res.data
            }).catch(err=>{
              if (err.response) {
                // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
              }
              console.log(err.config);
            })
          }
        }
      })
      axios.get("http://localhost/hospitals/getById?id="+this.hospId).then(res=>{
        console.log(res.data)
        this.hospName = res.data.hospitalName
        for (let i = 0; i < res.data.departments.length; i++) {
          if (parseInt(this.deptId) === res.data.departments[i].id) {
            this.deptName = res.data.departments[i].deptName
            break
          }
        }
      })
    },

  },
  mounted() {
    this.hospId = this.$route.query.hospId
    this.deptId = this.$route.query.deptId
    axios.get("http://localhost/doctors/getByDeptId?deptId="+this.deptId).then(res=>{
      this.doctors.splice(0,this.doctors.length)
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].qualification){
          this.doctors.push(res.data[i])
        }
      }
      for (let i = 0; i < this.doctors.length; i++) {
        axios.get("http://localhost/appointments/getCountByHandlerId?id="+this.doctors[i].id).then(res=>{
          this.doctors[i].remainRegistry = 10-res.data
        }).catch(err=>{
          if (err.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', err.message);
          }
          console.log(err.config);
        })
      }
    })
    axios.get("http://localhost/hospitals/getById?id="+this.hospId).then(res=>{
      this.hospName = res.data.hospitalName
      for (let i = 0; i < res.data.departments.length; i++) {
        if (parseInt(this.deptId) === res.data.departments[i].id) {
          this.deptName = res.data.departments[i].deptName
          break
        }
      }
    })

  }
}
</script>

<style scoped>
.is-selected {
  color: #1989fa;
}
</style>