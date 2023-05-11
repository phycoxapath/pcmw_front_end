<template>
  <el-breadcrumb separator=">" style="position:fixed;top: 100px; left: 250px">
    <el-breadcrumb-item @click="" :to="'/hospNoticeMana/hospNotice'">{{ submitNewNotice.noticePublisher }}</el-breadcrumb-item>
    <el-breadcrumb-item
    ><a href="/"></a></el-breadcrumb-item
    >

  </el-breadcrumb>
  <el-button round @click="newNoticeDialog = true" type="primary" style="position:fixed;left: 1280px;top: 100px;font-weight: bold;">发布公告</el-button>
  <div style="position: fixed;left: 280px;top: 130px">
    <el-table  ref="noticeData" :data="noticeData.slice((currentPage-1)*pageSize,(currentPage-1)*pageSize+pageSize)" style="width: 1100px;background-color: #ffffff;margin-top: 20px" height="500">
      <el-table-column width="800" prop="noticeTitle" >
        <template #default="scope"  >
          <el-link :underline="false" style="font-size: 18px">{{scope.row.noticeTitle}} </el-link>
        </template>
      </el-table-column>
      <el-table-column  align="right" prop="noticePublisher" >
        <template #default="scope">
          <el-text style="font-size: 14px">{{scope.row.noticePublisher}}</el-text>
        </template>
      </el-table-column>
      <el-table-column   prop="postTime" />
    </el-table>
  </div>
  <div>
    <el-dialog title="编辑新公告" v-model="newNoticeDialog" width="1200" draggable>
      <el-form :model="submitNewNotice" label-width="150px" class="demo-border"
               :rules="rules"
               ref="submitNewNotice"
      >
        <el-form-item prop="noticeTitle" label="标题">
          <el-input v-model="submitNewNotice.noticeTitle" style="width: 800px" placeholder="输入公告标题（不超过50字）"></el-input>
        </el-form-item>
        <el-form-item prop="noticeMain" label="正文">
          <el-input type="textarea" style="width: 800px" :rows="15" v-model="submitNewNotice.noticeMain" placeholder="输入公告正文（1000字以内）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="position: relative;left: 740px" type="primary" @click="doSubmit" round>提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "HospNotice",
  data(){
    return{
      newNoticeDialog:false,
      notices:[],
      noticeData:[],
      pageSize:10,
      currentPage:1,
      submitNewNotice:{
        hospId:0,
        noticePublisher:"",
        noticeTitle:"",
        noticeMain:"",
      },
      rules: {
        noticeTitle:[
          { required: true, message: '标题不能为空！', trigger: 'blur' },
        ],
        noticeMain:[
          { required: true, message: '正文内容不能为空！', trigger: 'blur' },
        ],
      }
    }
  },
  methods:{
    doSubmit(){
      this.$refs.submitNewNotice.validate(isValid => {
        if (isValid) {
          axios.post("http://localhost/hospitals/insertNotice", this.submitNewNotice).then(res => {
            if (res.data === 'insert success') {
              ElMessage.success("发布成功")
              this.submitNewNotice.noticeTitle = ""
              this.submitNewNotice.noticeMain = ""
              this.newNoticeDialog = false
            }
          })
        }
      })

    }
  },
  mounted() {
    this.submitNewNotice.hospId = window.localStorage.getItem('id')
    axios.get("http://localhost/hospitals/getById?id="+window.localStorage.getItem('id')).then(res=>{
      console.log(res.data)
      this.submitNewNotice.noticePublisher = res.data.hospitalName
    })
    axios.get("http://localhost/hospitals/getNoticeListByHospId?hospId="+window.localStorage.getItem('id')).then(res=>{
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
          noticeTitle: this.notices[i].noticeTitle,
          noticePublisher: this.notices[i].noticePublisher,
          postTime: new Date(this.notices[i].postTime).toLocaleString()
        })
      }
    })
  }
}
</script>

<style scoped>

/*::v-deep .el-table tbody tr:hover > td {*/
/*  background-color: transparent !important;*/
/*}*/
:deep(.el-table tbody tr:hover > td){
  background-color: transparent !important;
}

</style>