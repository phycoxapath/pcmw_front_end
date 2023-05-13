<template>
  <div>
    <el-breadcrumb separator=">" style="position:fixed;top: 100px; left: 250px">
      <el-breadcrumb-item @click="browseSpecificNotice = false" :to="'/hospNoticeMana/hospNotice'">{{ submitNewNotice.noticePublisher }}</el-breadcrumb-item>
      <el-breadcrumb-item v-show="browseSpecificNotice">
          {{specificNotice.noticeTitle}}
      </el-breadcrumb-item>

    </el-breadcrumb>
    <el-button round @click="newNoticeDialog = true" type="primary" style="position:fixed;left: 1280px;top: 100px;font-weight: bold;">发布公告</el-button>
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
            <el-popover placement="bottom" width="60" trigger="click">
              <template #reference>
                <el-link :underline="false" ><el-icon size="18"><CaretBottom /></el-icon></el-link>
              </template>
              <el-link @click="modifyHandle(scope.row.id)" :underline="false"><el-icon size="18"><Edit /></el-icon>编辑</el-link>
              <el-popconfirm confirm-button-type="danger" @confirm="deleteNotice(scope.row.id)" title="确定要删除此公告吗？">
                <template #reference>
                  <el-link  style="margin-left: 30px" :underline="false"><el-icon><Delete /></el-icon>删除</el-link>
                </template>
              </el-popconfirm>
            </el-popover>
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
            <el-text v-for="p in passage" style="display: block;font-size: 17px; text-indent: 34px">{{p}}<br/></el-text>
        </div>


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
      <el-dialog title="编辑" v-model="modifyNoticeDialog" width="1200" draggable>
        <el-form :model="modifyNotice" label-width="150px" class="demo-border"
                 :rules="modifyRules"
                 ref="modifyNotice"
        >
          <el-form-item prop="noticeTitle" label="标题">
            <el-input v-model="modifyNotice.noticeTitle" style="width: 800px"></el-input>
          </el-form-item>
          <el-form-item prop="noticeMain" label="正文">
            <el-input type="textarea" style="width: 800px" :rows="15" v-model="modifyNotice.noticeMain"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="position: relative;left: 740px" type="primary" @click="doUpdate" round>保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </div>

</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "HospNotice",
  data(){
    return{
      browseSpecificNotice: false,
      modifyNoticeDialog:false,
      newNoticeDialog:false,
      notices:[],
      noticeData:[],
      passage:[],
      pageSize:10,
      currentPage:1,
      noticeCount:0,
      submitNewNotice:{
        hospId:0,
        noticePublisher:"",
        noticeTitle:"",
        noticeMain:"",
      },
      modifyNotice:{
        id:0,
        noticeTitle:"",
        noticeMain:"",
        postTime:"",
      },
      specificNotice:{
        // id:"",
        // hospId:0,
        // noticePublisher:"",
        // noticeTitle:"",
        // noticeMain:"",
        // postTime:"",
      },
      rules: {
        noticeTitle:[
          { required: true, message: '标题不能为空！', trigger: 'blur' },
        ],
        noticeMain:[
          { required: true, message: '正文内容不能为空！', trigger: 'blur' },
        ],
      },
      modifyRules:{
        noticeTitle:[
          { required: true, message: '标题不能为空！', trigger: 'blur' },
        ],
        noticeMain:[
          { required: true, message: '正文内容不能为空！', trigger: 'blur' },
        ],
      },
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
    doSubmit(){
      this.$refs.submitNewNotice.validate(isValid => {
        if (isValid) {
          axios.post("http://localhost/hospitals/insertNotice", this.submitNewNotice).then(res => {
            if (res.data === 'insert success') {
              ElMessage.success("发布成功")
              this.noticeCount++
              this.submitNewNotice.noticeTitle = ""
              this.submitNewNotice.noticeMain = ""
              this.newNoticeDialog = false
            }
          })
        }
      })

    },
    modifyHandle(noticeId){
      axios.get("http://localhost/hospitals/getSpecificNoticeById?id="+noticeId).then(res=>{
        this.modifyNotice.noticeTitle = res.data.noticeTitle
        this.modifyNotice.noticeMain = res.data.noticeMain
        this.modifyNotice.id = noticeId
        this.modifyNoticeDialog = true
      })
    },
    doUpdate(){
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
      this.$refs.modifyNotice.validate(isValid => {
        if (isValid){
          this.modifyNotice.postTime = new Date().toLocaleString()
          axios.put("http://localhost/hospitals/updateNotice",this.modifyNotice).then(res=>{
            if (res.data === 'update success'){
              ElMessage.success("保存成功！")
              this.modifyNoticeDialog = false
              this.noticeCount++
            }

          })
        }
      })
    },
    deleteNotice(noticeId){
      axios.delete("http://localhost/hospitals/deleteNoticeById?noticeId="+noticeId).then(res=>{
        if (res.data === 'delete success'){
          ElMessage.success("删除成功！")
          this.noticeCount--
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
        this.passage = this.specificNotice.noticeMain.split("\n")
        this.browseSpecificNotice = true
      })
    }

  },
  watch:{
    noticeCount(val, oldVal){
      this.notices.splice(0,this.notices.length)
      this.noticeData.splice(0,this.noticeData.length)
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
            id: this.notices[i].id,
            noticeTitle: this.notices[i].noticeTitle,
            noticePublisher: this.notices[i].noticePublisher,
            postTime: new Date(this.notices[i].postTime).toLocaleString()
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
          id: this.notices[i].id,
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