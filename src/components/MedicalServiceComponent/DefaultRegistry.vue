<template>
  <div style="position:absolute;top: 100px;left: 400px">
    <el-calendar style="width: 70%;" :range="range">
      <template #date-cell="{ data }">
        <p :class="data.isSelected ? 'is-selected' : ''"  @click="registryHandle(data)">
          {{ data.day.split('-').slice(1).join('-') }}
          {{ data.isSelected ? '✔️' : '' }}
        </p>
        <el-text v-show="registryAvailable(data)" type="success">有号</el-text>
      </template>
    </el-calendar>
  </div>
  <div>
    <el-dialog v-model="appointDialog">

    </el-dialog>
  </div>
<!--  <el-calendar>-->
<!--    <template #date-cell="{ data }">-->
<!--      <p :class="data.isSelected ? 'is-selected' : ''">-->
<!--        {{ data.day.split('-').slice(1).join('-') }}-->
<!--        {{ data.isSelected ? '✔️' : '' }}-->
<!--      </p>-->
<!--    </template>-->
<!--  </el-calendar>-->
</template>

<script>
import axios from "axios";

export default {
  name: "DefaultRegistry",
  data(){
    return{
      appointDialog:false,
      hospId:0,
      deptId:0,
      doctors:[],
      range:[new Date(),new Date().setMonth(new Date().getMonth()+1)],
    }
  },
  methods:{
    registryHandle(data){
      console.log(data)
      this.appointDialog = true
    },
    registryAvailable(data){

      for (let i = 0; i < this.doctors.length; i++) {
        if ((2**((7-data.date.getDay())%7) & this.doctors[i].workingDay) > 0){
          return true
        }
        if (i === this. doctors.length - 1)
          return false
      }

    }
  },
  watch:{
    '$route' (to, from){
      this.hospId = this.$route.query.hospId
      this.deptId = this.$route.query.deptId
      axios.get("http://localhost/doctors/getByDeptId?deptId="+this.deptId).then(res=>{
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].qualification){
            this.doctors.push(res.data[i])
          }
        }
      })
    }
  },
  mounted() {
    this.hospId = this.$route.query.hospId
    this.deptId = this.$route.query.deptId
    axios.get("http://localhost/doctors/getByDeptId?deptId="+this.deptId).then(res=>{
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].qualification){
          this.doctors.push(res.data[i])
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