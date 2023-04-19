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
    <el-dialog v-model="appointDialog" title="预约详情" >
      <el-table height="500" :data="appointDetail">
        <el-table-column label="医生姓名" prop="docName" />
        <el-table-column label="性别" prop="gender" />
        <el-table-column label="科室" prop="deptName" />
        <el-table-column label="医生简介" prop="docProfile" />
        <el-table-column label="预约时间段" prop="timeFragment" >
          <template #default="scope">
            <el-select v-model="timeFragment" placeholder="请选择时间段" >
              <el-option key="1" label="9:00" value="9"/>
              <el-option key="2" label="15:00" value="15"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="handle" >
          <template #default="scope">
            <el-button size="small" @click="submitAppoint(scope.$index,scope.row)">预约</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "DefaultRegistry",
  data(){
    return{
      timeFragment:"",
      appointDetail:[],
      appointDialog:false,
      hospId:0,
      deptId:0,
      hospName:"",
      deptName:"",
      doctors:[],
      range:[new Date(),new Date().setMonth(new Date().getMonth()+1)],
    }
  },
  methods:{
    registryHandle(data){
      console.log(data)
      console.log(this.doctors)
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
        this.appointDetail.push({
          docName:this.doctors[i].docName,
          gender:this.doctors[i].gender,
          deptName:this.doctors[i].deptName,
          docProfile:this.doctors[i].docProfile,
          timeFragment:data.day,
        })
      }

      this.appointDialog = true
    },
    registryAvailable(data){
      for (let i = 0; i < this.doctors.length; i++) {
        if (data.date < new Date() || (data.date.getMonth-new Date().getMonth())*30+data.date.getDate-new Date().getDate() > 30)
          return false
        if ((2**((7-data.date.getDay())%7) & this.doctors[i].workingDay) > 0){
          return true
        }
        if (i === this. doctors.length - 1)
          return false
      }

    },
    submitAppoint(rowIndex,row){
      console.log(row.timeFragment)
      console.log(this.timeFragment)

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
    }
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