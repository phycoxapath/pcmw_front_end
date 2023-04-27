<template>
<div style="position: fixed;left: 340px;top: 100px">
  <el-table :data="vaccineAppointData" style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc;margin-top: 20px" height="500">
    <el-table-column label="序号" width="100px" prop="rowId" />
    <el-table-column label="预约类型"  prop="appointType" />
    <el-table-column label="接种地点"  prop="handlerName" />
    <el-table-column label="疫苗名称"  prop="vaccineName" />
    <el-table-column label="操作时间" sortable prop="operateTime" />
    <el-table-column label="接种时间" sortable prop="appointTime" />
  </el-table>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "AppointHistory",
  data(){
    return{
      vaccineAppointData:[],
      vaccineAppointments:[],
    }
  },
  methods:{

  },
  mounted() {
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
    axios.get("http://localhost/appointments/getValidByInitiatorIdAndType?initiatorId="+window.localStorage.getItem('id')+"&type=疫苗预约").then(res=>{
      this.vaccineAppointments = res.data
      let vaccine
      for (let i = 0; i < res.data.length; i++) {
        vaccine = JSON.parse(res.data[i].appointAppendix)
        this.vaccineAppointData.push({
          rowId: i+1,
          handlerName: res.data[i].handlerName,
          appointType: res.data[i].appointType,
          vaccineName: vaccine.vaccineName,
          operateTime: new Date(res.data[i].operateTime).toLocaleString() ,
          appointTime: new Date(res.data[i].appointTime).toLocaleString() ,
        })
      }

    })
  }
}
</script>

<style scoped>

</style>