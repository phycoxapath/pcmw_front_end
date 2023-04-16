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
    <el-dialog v-model="detailImgDialog" title="详细信息">
      <el-image v-for="src in imgSrc" :src=src :preview-src-list="imgPreview"></el-image>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="detailImgDialog = false">关闭</el-button>
      </span>
      </template>
    </el-dialog>
    <el-dialog v-model="handledApplyDialog" title="已处理申请">
      <el-table :data="handledData" style="width: 1000px;background-color: #FAFAFA" height="500">
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

    }
  },
  methods:{
    showDetails(rowIndex,row){

      let src = 'http://localhost/common/downloadImg?fileName='+this.applications[rowIndex].applyImage
      this.imgSrc[0] = src
      this.imgPreview[0] = src
      this.detailImgDialog = true
    },
    passQual(rowIndex,row){
      Date.prototype.toLocaleString = function (){
        return (
            this.getFullYear() +
            "-" +
            (this.getMonth() + 1) +
            "-" +
            this.getDate() +
            " " +
            this.getHours() +
            ":" +
            this.getMinutes() +
            ":" +
            this.getSeconds()

        );
      }
      this.applications[rowIndex].applyState = '已通过'
      this.applications[rowIndex].handleTime = new Date().toLocaleString()
      this.applyDTO.id = this.applyData[rowIndex].id
      this.applyDTO.applyState = '已通过'
      this.applyDTO.handleTime = new Date().toLocaleString()
      axios.put("http://localhost/apply/update",this.applyDTO).then(res=>{
          if (res.data === 'update success') {
            ElMessage.success("处理成功")
            this.handledData.push(this.applications[rowIndex])
            this.applyData.splice(rowIndex,1)
          }
          else
            ElMessage.error("系统繁忙，请稍后再试！")
      })
    },
    rejectQual(rowIndex,row){

    },
    reHandle(rowIndex,row){
      this.handledData[rowIndex].applyState = '待审核'
      this.applyData.unshift(this.handledData[rowIndex])
      this.handledData.splice(rowIndex,1)
    }
  },
  mounted() {
    Date.prototype.toLocaleString = function (){
      return (
          this.getFullYear() +
          "-" +
          (this.getMonth() + 1) +
          "-" +
          this.getDate() +
          " " +
          this.getHours() +
          ":" +
          this.getMinutes() +
          ":" +
          this.getSeconds()

      );
    }
    axios.get("http://localhost/apply/getByHandlerId?id="+window.localStorage.getItem('id')+"&role="+window.localStorage.getItem('loginRole')).then(res=>{
      this.applications = res.data
      for (let i = 0; i < res.data.length; i++) {
        let applyState = (res.data[i].applyState === '审核中') ? '待处理' : '已处理'
        this.applyData.push({
          id:res.data[i].id,
          applyState:applyState,
          initiatorName:res.data[i].initiatorName,
          applyType:res.data[i].applyType,
          applyTime:new Date(res.data[i].applyTime).toLocaleString()
        })
      }

    })

  }
}
</script>

<style scoped>

</style>