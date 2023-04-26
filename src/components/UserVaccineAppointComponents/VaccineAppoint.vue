<template>
  <div>
    <el-text style="font-weight: bold;font-size: 20px">请选择医院：</el-text>
        <el-select
            v-model="selectedHospital"
            filterable
            remote
            placeholder="输入医院名字搜索"
            :remote-method="hospSearch"
            :loading="isLoad"
        >
          <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.hospitalName"
              :value="item.hospitalName"
          />
        </el-select>

        <el-table v-show="selectedHospital" :data="vaccineData" style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc" height="500">
          <el-table-column label="序号"  prop="rowId" />
          <el-table-column label="疫苗名称"  prop="vaccineName" />
          <el-table-column label="疫苗价格"  prop="vaccinePrice" />
          <el-table-column label="接种医院"  prop="hospitalName" />
          <el-table-column label="选择时间">
            <template #default="scope">

            </template>
          </el-table-column>
          <el-table-column label="操作"  >
            <template #default="scope">

            </template>
          </el-table-column>
        </el-table>

  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "VaccineAppoint",
  data(){
    return{
      isLoad:false,
      selectedHospital:"",
      hospitals:[],
      options:[],
      vaccineData:[],
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
  },
  mounted() {
    axios.get("http://localhost/hospitals/getAllHospital").then(res=>{
      this.hospitals = res.data
    })
    axios.get("http://localhost/vaccines/")
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