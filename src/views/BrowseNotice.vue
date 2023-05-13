<template>
  <div style=" position: fixed;">
    <el-scrollbar style="height: 100%">
      <el-menu
          default-active="0"
          active-text-color="#337ecc"
          background-color="#FAFCFF"
          class="el-menu-vertical-demo"
          text-color="#303133"
          @select="handleSelect"
      >
        <el-menu-item :index=index.toString() v-for="(hospital,index) in hospitals" :key="index">{{ hospital.hospitalName }}</el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
  <div>
    <el-breadcrumb separator=">" style="position:fixed;top: 100px; left: 250px">
      <el-breadcrumb-item @click="browseSpecificNotice = false" :to="'/browseNotice'">{{ selectedHospital.hospitalName }}</el-breadcrumb-item>
      <el-breadcrumb-item v-show="browseSpecificNotice">
        {{specificNotice.noticeTitle}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div style="position: fixed;left: 280px;top: 130px" v-show="!browseSpecificNotice">
    <el-table  ref="noticeData" :data="noticeData.slice((currentPage-1)*pageSize,(currentPage-1)*pageSize+pageSize)" style="width: 1100px;background-color: #ffffff;margin-top: 20px" height="500">
      <el-table-column prop="id" width="1">
        <template #default="scope">
          <span>{{}}</span>
        </template>
      </el-table-column>
      <el-table-column width="800" prop="noticeTitle" >
        <template #default="scope"  >
          <el-link :underline="false" @click="showSpecificNotice(scope.row.id)" style="font-size: 18px">{{scope.row.noticeTitle}} </el-link>
        </template>
      </el-table-column>
      <el-table-column  align="right" prop="noticePublisher" >
        <template #default="scope">
          <el-text style="font-size: 14px;color: #909399">{{scope.row.noticePublisher}}</el-text>
        </template>
      </el-table-column>
      <el-table-column align="left"  prop="postTime" >
        <template #default="scope">
          <el-text style="font-size: 14px;color: #909399">{{scope.row.postTime}}</el-text>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[2, 5, 7, 10]"
        :small="false"
        :disabled="false"
        :background="true"
        layout="prev, pager, next, jumper, sizes"
        :total="noticeData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 10px;margin-left: 300px"
    />
  </div>
  <div style="position: fixed;left: 280px;top: 180px;border: 2px solid #c8c9cc;width: 1080px;height: 560px;background-color: #f4f4f5" v-show="browseSpecificNotice">
    <div >
      <el-text style="display: block;text-align: center;font-size: 22px;font-weight: bold;font-family:'Microsoft JhengHei UI Light';margin-top: 10px">{{specificNotice.noticeTitle}}</el-text>
    </div>
    <div>
      <el-text style="display: block;text-align: center;">{{specificNotice.noticePublisher}} {{specificNotice.postTime}}</el-text>
    </div>
    <el-divider></el-divider>
    <div style="margin-top: 20px">
      <el-text v-for="p in paragraph" style="display: block;font-size: 17px; text-indent: 34px">{{p}}<br/></el-text>
    </div>


  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BrowseNotice",
  data(){
    return{
      browseSpecificNotice:false,
      hospitals:[],
      noticeData:[],
      notices:[],
      paragraph:[],
      pageSize:10,
      currentPage:1,
      selectedHospital:{

      },
      specificNotice:{

      }
    }
  },
  methods:{
    handleSizeChange(value){
      this.pageSize = value
      this.currentPage = 1
    },
    handleCurrentChange(value){
      this.currentPage = value
    },
    handleSelect(key){
      this.selectedHospital = this.hospitals[key]
      this.browseSpecificNotice = false
      this.notices.splice(0,this.notices.length)
      this.noticeData.splice(0,this.noticeData.length)
      axios.get("http://localhost/hospitals/getNoticeListByHospId?hospId="+this.hospitals[key].id).then(res=>{
        Date.prototype.toLocaleString = function (){
          let monthLessTen = this.getMonth() < 10 ? "0": ""
          let dateLessTen = this.getDate() < 10 ? "0" : ""
          return (
              this.getFullYear() +
              "-" +monthLessTen+
              (this.getMonth() + 1) +
              "-" +dateLessTen+
              this.getDate()
          );
        }
        this.notices = res.data
        for (let i = 0; i < this.notices.length; i++) {
          this.noticeData.push({
            id: this.notices[i].id,
            noticeTitle: this.notices[i].noticeTitle,
            noticePublisher: this.notices[i].noticePublisher,
            postTime: new Date(this.notices[i].postTime).toLocaleString()
          })
        }
      })
    },
    showSpecificNotice(noticeId){
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
            this.getDate()+
            " " +hourLessTen+
            this.getHours() +
            ":" +minuteLessTen+
            this.getMinutes() +
            ":" +secondLessTen+
            this.getSeconds()
        );
      }
      axios.get("http://localhost/hospitals/getSpecificNoticeById?id="+noticeId).then(res=>{
        res.data.postTime = new Date(res.data.postTime).toLocaleString()
        this.specificNotice = res.data
        this.paragraph = this.specificNotice.noticeMain.split("\n")
        this.browseSpecificNotice = true
      })
    },
  },
  mounted() {
    axios.get("http://localhost/hospitals/getAllHospital").then(res=>{
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].qualification){
          this.hospitals.push(res.data[i])
        }
      }
      this.handleSelect(0)
    })
  }
}
</script>

<style scoped>
.el-menu-vertical-demo{
  width: 200px;
  height: 700px;
}
</style>