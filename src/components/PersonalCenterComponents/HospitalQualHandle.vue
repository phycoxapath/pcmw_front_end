<template>
  <div style="position:absolute;top: 10%;left: 14%">
    <el-table :data="applyData" style="width: 1300px;background-color: #FAFAFA" height="500" >
      <el-table-column label="id" prop="id" />
      <el-table-column label="处理情况" prop="applyState" />
      <el-table-column label="申请者名称" prop="initiatorName" />
      <el-table-column label="申请类型" prop="applyType" />
      <el-table-column label="申请时间" prop="applyTime" />
      <el-table-column label="操作" prop="handle" >
        <template #default="scope">
          <el-button size="small" @click="showDetails(scope.$index, scope.row)"
          >查看详细</el-button
          >
          <el-button
              size="small"
              type="success"
              @click="passQual(scope.$index, scope.row)"
          >通过</el-button
          >
          <el-button
              size="small"
              type="danger"
              @click="rejectQual(scope.$index, scope.row)"
          >驳回</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" size="large" style="float: right" @click="handledApplyDialog = true">查看已处理申请</el-button>
  </div>
  <div>
    <el-dialog v-model="detailImgDialog" title="详细信息" draggable>
      <el-text type="danger" size="default" >所属科室：{{deptInDialog}}</el-text>
      <el-image v-for="src in imgSrc" :src=src :preview-src-list="imgPreview"></el-image>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="detailImgDialog = false">关闭</el-button>
      </span>
      </template>
    </el-dialog>
    <el-dialog v-model="handledApplyDialog" title="已处理申请" draggable width="1300px">
      <el-table :data="handledData" style="width: 1300px;background-color: #FAFAFA" height="500" >
        <el-table-column label="id" prop="id" />
        <el-table-column label="处理情况" prop="applyState" />
        <el-table-column label="申请者名称" prop="initiatorName" />
        <el-table-column label="申请类型" prop="applyType" />
        <el-table-column label="申请时间" prop="applyTime" />
        <el-table-column label="处理时间" prop="handleTime" />
        <el-table-column label="处理者" prop="handlerName" />
        <el-table-column label="操作" prop="handle" >
          <template #default="scope">
            <el-button size="small" @click="reHandle(scope.$index,scope.row)">重审</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "HospitalQualHandle",
  data(){
    return{
      imgSrc:[""],
      imgPreview:[""],
      detailImgDialog:false,
      handledApplyDialog:false,
      applyDTO:{

      },
      applyData:[],
      handledData:[],
      applications:[],
      deptInDialog:"",
    }
  },
  methods:{
    showDetails(rowIndex,row){
      let index;
      for (let i = 0; i < this.applications.length; i++) {
        if (row.id === this.applications[i].id){
          index = i
          break
        }
      }
      let src = 'http://localhost/common/downloadImg?fileName='+this.applications[index].applyImage
      axios.get("http://localhost/doctors/getById?id="+this.applications[index].initiatorId).then(res=>{
        this.deptInDialog = res.data.deptName
      })
      this.imgSrc[0] = src
      this.imgPreview[0] = src
      this.detailImgDialog = true
    },
    passQual(rowIndex,row){
      let index;
      for (let i = 0; i < this.applications.length; i++) {
        if (row.id === this.applications[i].id){
          index = i
          break
        }
      }
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
      this.applications[index].applyState = '已通过'
      this.applications[index].handleTime = new Date().toLocaleString()
      this.applyDTO.id = row.id
      this.applyDTO.applyState = '已通过'
      this.applyDTO.handleTime = new Date().toLocaleString()
      console.log(new Date().toLocaleString())
      axios.put("http://localhost/apply/update",this.applyDTO).then(res=>{
          if (res.data === 'update success') {
            ElMessage.success("处理成功")
            this.handledData.push(this.applications[index])
            this.applyData.splice(rowIndex,1)
            axios.put("http://localhost/hospitals/updateDocQual?docId="+this.applications[index].initiatorId+"&qualification=true").then(res=>{
              if (res.data !== 'update success')
                ElMessage.error("系统繁忙，请稍后再试")
            })
          }
          else
            ElMessage.error("系统繁忙，请稍后再试！")
      })
    },
    rejectQual(rowIndex,row){
      let index;
      for (let i = 0; i < this.applications.length; i++) {
        if (row.id === this.applications[i].id){
          index = i
          break
        }
      }
      this.applications[index].applyState = '被驳回'
      this.applications[index].handleTime = new Date().toLocaleString()
      this.applyDTO.id = row.id
      this.applyDTO.applyState = '被驳回'
      this.applyDTO.handleTime = new Date().toLocaleString()
      axios.put("http://localhost/apply/update",this.applyDTO).then(res=>{
        if (res.data === 'update success') {
          ElMessage.success("处理成功")
          this.handledData.push(this.applications[index])
          this.applyData.splice(rowIndex,1)

        }
        else
          ElMessage.error("系统繁忙，请稍后再试！")
      })
    },
    reHandle(rowIndex,row){
      let index;
      for (let i = 0; i < this.applications.length; i++) {
        if (row.id === this.applications[i].id){
          index = i
          break
        }
      }
      this.handledData[rowIndex].applyState = '审核中'
      this.applyDTO.id = row.id
      this.applyDTO.applyState = '审核中'
      console.log(this.applyDTO)
      axios.put("http://localhost/apply/update",this.applyDTO).then(res=>{
        if (res.data === 'update success') {
          ElMessage.success("操作成功")
          this.applyData.unshift(this.handledData[rowIndex])
          this.handledData.splice(rowIndex,1)
          axios.put("http://localhost/hospitals/updateDocQual?docId="+this.applications[index].initiatorId+"&qualification=false").then(res=>{
            if (res.data !== 'update success')
              ElMessage.error("系统繁忙，请稍后再试")
          })
        }
        else
          ElMessage.error("系统繁忙，请稍后再试！")
      })
    }
  },
  mounted() {

    axios.get("http://localhost/apply/getByHandlerId?id="+window.localStorage.getItem('id')+"&role="+window.localStorage.getItem('loginRole')).then(res=>{
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
      this.applications = res.data
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].applyTime = new Date(res.data[i].applyTime).toLocaleString()
        let applyState = (res.data[i].applyState === '审核中') ? '待处理' : '已处理'
        if (applyState === '待处理') {
          this.applyData.push({
            id: res.data[i].id,
            applyState: applyState,
            initiatorName: res.data[i].initiatorName,
            applyType: res.data[i].applyType,
            applyTime: res.data[i].applyTime
          })
        }else {
          this.handledData.push({
            id: res.data[i].id,
            applyState: res.data[i].applyState,
            initiatorName: res.data[i].initiatorName,
            applyType: res.data[i].applyType,
            applyTime: res.data[i].applyTime,
            handleTime: res.data[i].handleTime,
            handlerName: res.data[i].handlerName
          })
        }
      }

    })

  }
}
</script>

<style scoped>

</style>