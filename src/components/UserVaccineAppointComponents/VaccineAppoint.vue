<template>
  <div style="position: fixed;left: 340px;top: 100px">
    <el-text style="font-weight: bold;font-size: 20px;margin-left: 270px;" >请选择医院：</el-text>
        <el-select
            v-model="selectedHospital"
            style="width: 300px"
            filterable
            remote
            placeholder="输入医院名字搜索"
            :remote-method="hospSearch"
            :loading="isLoad"
            clearable
            @change="selectingHospHandle"
        >
          <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.hospitalName"
              :value="item.hospitalName"
          />
        </el-select>

        <el-table v-show="selectedHospital" :data="vaccineData" style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc;margin-top: 20px" height="500">
          <el-table-column label="序号" width="100px" prop="rowId" />
          <el-table-column label="疫苗名称"  prop="vaccineName" >
            <template #default="scope">
              <el-popover trigger="hover" placement="top" width="400px">
                <template #reference>
                  <span>{{scope.row.vaccineName}}</span>
                </template>
                <el-text>{{vaccines[scope.row.rowId-1].vaccineDescription}}</el-text>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="疫苗价格"  prop="vaccinePrice" >
            <template #default="scope">
              <span>{{scope.row.vaccinePrice}} 元/剂</span>
            </template>
          </el-table-column>
          <el-table-column label="接种医院"  prop="hospitalName" >
            <template #default="scope">
              <span>{{selectedHospital}}</span>
            </template>
          </el-table-column>
          <el-table-column label="选择时间" width="180px" prop="vaccinateDay">
            <template #default="scope">
              <el-popover placement="bottom" width="300" trigger="click" @before-enter="lineIndex = scope.row.rowId;isShowAppointTime = false;appointTime='' " >
                <template #reference>
                  <el-link :underline="false" ><el-icon size="20px"><Clock /></el-icon></el-link>
                </template>
                <el-date-picker
                  v-model="appointTime"
                  type="date"
                  placeholder="Pick a day"
                  size="small"
                  :disabled-date="disabledDate"
                  @visible-change="legalDate = scope.row.vaccinateDay"
                  @change="isShowAppointTime = true"
              />
              </el-popover>
              <el-text v-show="isShowAppointTime && scope.row.rowId === lineIndex">{{new Date(appointTime).toLocaleString()}}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="操作"  >
              <template #default="scope">
                <el-popconfirm title="确定要预约该时间段的该疫苗接种吗？" width="400px" @confirm="saveAppoint(scope.row.rowId-1)" confirm-button-type="success">
                  <template #reference>
                    <el-button type="success" >预约</el-button>
                  </template>
                </el-popconfirm>
              </template>
          </el-table-column>
        </el-table>

  </div>

</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "VaccineAppoint",
  data(){
    return{
      isLoad:false,
      legalDate:0,
      lineIndex:0,
      selectedHospital:"",
      selectedHospId:0,
      isShowAppointTime:false,
      appointTime:"",
      hospitals:[],
      options:[],
      vaccineData:[],
      vaccines:[],
      submitVaccineAppoint:{

      },
      rules:[],
    }
  },
  methods:{
    hospSearch(val){
      let hit = false
      if (val){
        this.isLoad = true
        setTimeout(()=>{
          this.isLoad = false
          for (let i = 0; i < this.hospitals.length; i++) {
            if (this.hospitals[i].hospitalName.toLowerCase().includes(val.toLowerCase())) {
              this.options.push(this.hospitals[i])
              hit = true
            }
          }
          if (!hit){
            this.options.splice(0,this.options.length)
          }
        }, 200)
      }else{
        this.options.splice(0,this.options.length)
      }
    },
    selectingHospHandle(val){
      for (let i = 0; i < this.hospitals.length; i++) {
        if (val === this.hospitals[i].hospitalName){
          this.selectedHospId = this.hospitals[i].id
          break
        }
      }
      this.vaccineData.splice(0,this.vaccineData.length)
      axios.get("http://localhost/vaccines/getByHospId?hospId="+this.selectedHospId).then(res=>{
        this.vaccines = res.data
        for (let i = 0; i < res.data.length; i++) {
          this.vaccineData.push({
            rowId: i+1,
            vaccineName: res.data[i].vaccineName,
            vaccinePrice: res.data[i].vaccinePrice,
            vaccinateDay: res.data[i].vaccinateDay,
            // prop="rowId" />
            // prop="vaccineName"
            // prop="vaccinePrice
            // prop="hospitalName
          })
        }
      })
    },
    disabledDate(date){
      let weekday = 2**((7-date.getDay())%7)
      return date < new Date() || date > new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 30) || (this.legalDate & weekday) === 0 ;
    },
    saveAppoint(rowIndex, row){
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
      this.submitVaccineAppoint.initiatorId = window.localStorage.getItem('id')
      this.submitVaccineAppoint.handlerId = this.selectedHospId
      this.submitVaccineAppoint.appointType = '疫苗预约'
      this.submitVaccineAppoint.appointTime = new Date(this.appointTime).toLocaleString()
      this.submitVaccineAppoint.appointAppendix = "{\"vaccineId\":\""+this.vaccines[rowIndex].id+"\",\"vaccineName\":\""+this.vaccines[rowIndex].vaccineName+"\"}"
      axios.post("http://localhost/appointments/saveAppointment",this.submitVaccineAppoint).then(res=>{
        if (res.data === 'save success'){
          ElMessage.success("预约成功！")
        }else {
          ElMessage.error("系统繁忙，请稍后再试！")
        }
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
        ElMessage.error("系统繁忙，请稍后再试！")
      })
    }
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
          this.getDate()


      );
    }
    axios.get("http://localhost/hospitals/getAllHospital").then(res=>{
      this.hospitals = res.data
    })

  }

}
</script>

<style scoped>
.demo-border{
  border-top: 2px solid var(--el-border-color);
  border-bottom: 2px solid var(--el-border-color);
  border-left: 2px solid var(--el-border-color);;
  border-right: 2px solid var(--el-border-color);;
  border-radius: 20px;
  width: 600px;
  padding: 25px;
  background-color: #FAFAFA;
  position: fixed;
  margin-left: 500px;
  margin-top: 100px;
}
</style>