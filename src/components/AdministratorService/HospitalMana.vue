<template>
  <el-tabs type="border-card" style="position:fixed;left: 200px">
    <el-tab-pane label="已入驻医院">
      <el-table ref="verifiedHospitalData" :data="verifiedHospitalData.slice((currentPage-1)*pageSize,(currentPage-1)*pageSize+pageSize)" highlight-current-row style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc;margin-top: 20px" height="500">
        <el-table-column label="序号" width="100px" prop="rowId" />
        <el-table-column label="医院名称" width="200px" prop="hospitalName" />
        <el-table-column label="医院简述"  prop="hospitalDescription" >
          <template #default="scope">
            <el-text truncated>{{scope.row.hospitalDescription}}</el-text>
            <el-popover placement="top" width="500" trigger="click" @hide="this.description = ''">
              <template #reference>
                <el-link :underline="false" @click="description = scope.row.hospitalDescription" style="position:fixed;margin-top: 8px;right: 620px "><el-icon><More /></el-icon></el-link>
              </template>
              <el-input type="textarea" :rows="5" v-model="description" disabled></el-input>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="left" width="300px">
          <template #header>
            <el-select
                v-model="selectedHospital"
                style="width: 200px"
                filterable
                remote
                placeholder="输入医院名字搜索"
                :remote-method="hospSearch"
                :loading="isLoad"
                clearable
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.hospitalName"
                :value="item.hospitalName"
            />
            </el-select>
            <el-button round color="#DBEAFFFF" style="position:fixed;color: #409EFF" @click="searchHosp">搜索</el-button>
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
          :total="verifiedHospitalData.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="margin-top: 10px;margin-left: 300px"
      />
    </el-tab-pane>
    <el-tab-pane label="资质审核">
      <el-table :data="applyData" style="width: 1000px;background-color: #FAFAFA" height="500" >
        <el-table-column label="序号" width="100px" prop="rowId" />
        <el-table-column label="处理情况" width="120px" prop="applyState" />
        <el-table-column label="申请者名称" width="180px" prop="initiatorName" />
        <el-table-column label="申请类型" prop="applyType" />
        <el-table-column label="申请时间" prop="applyTime" />
        <el-table-column label="操作" width="230px" prop="handle" >
          <template #default="scope">
            <el-button size="small" @click="showDetails(scope.row.rowId-1, scope.row)"
            >查看详细</el-button
            >
            <el-button
                size="small"
                type="success"
                @click="passQual(scope.row.rowId-1, scope.$index)"
            >通过</el-button
            >
            <el-button
                size="small"
                type="danger"
                @click="rejectQual(scope.row.rowId-1, scope.$index)"
            >驳回</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="large" style="float: right" @click="handledApplyDialog = true">查看已处理申请</el-button>
      <el-dialog v-model="detailImgDialog" title="详细信息" draggable>
        <el-image v-for="src in imgSrc" :src=src :preview-src-list="imgPreview"></el-image>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="detailImgDialog = false">关闭</el-button>
      </span>
        </template>
      </el-dialog>
      <el-dialog v-model="handledApplyDialog" title="已处理申请" draggable width="1100px">
        <el-table :data="handledData" style="width: 1300px;background-color: #FAFAFA" height="500" >
          <el-table-column label="序号" width="100px" prop="rowId" />
          <el-table-column label="处理情况" width="120px" prop="applyState" />
          <el-table-column label="申请者名称" prop="initiatorName" />
          <el-table-column label="申请类型" prop="applyType" />
          <el-table-column label="申请时间" prop="applyTime" />
          <el-table-column label="处理时间" prop="handleTime" />
          <el-table-column label="处理者" prop="handlerName" />
          <el-table-column label="操作"  prop="handle" >
            <template #default="scope">
              <el-button size="small" @click="reHandle(scope.row.rowId-1, scope.$index)">重审</el-button>
              <el-popconfirm title="确定要删除该记录吗？" width="250px" @confirm="deleteHistory(scope.row.rowId-1, scope.$index)">
                <template #reference>
                  <el-button size="small" type="danger" >删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import axios from "../../utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "HospitalMana",
  data(){
    return{
      description:"",
      selectedHospital:"",
      handledApplyDialog:false,
      detailImgDialog:false,
      applyDTO:{},
      imgSrc:[""],
      imgPreview:[""],
      verifiedHospitalData:[],
      verifiedHospitals:[],
      applyData:[],
      applications:[],
      handledData:[],
      handledApplications:[],
      options:[],
      pageSize:10,
      currentPage:1,
      isLoad:false,
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
    hospSearch(val){
      let hit = false
      if (val){
        this.isLoad = true
        setTimeout(()=>{
          this.isLoad = false
          for (let i = 0; i < this.verifiedHospitals.length; i++) {
            if (this.verifiedHospitals[i].hospitalName.toLowerCase().includes(val.toLowerCase())) {
              this.options.push(this.verifiedHospitals[i])
              hit = true
            }
          }
          if (!hit){
            this.options.splice(0,this.options.length)
          }
        }, 600)
      }else{
        this.options.splice(0,this.options.length)
      }
    },
    searchHosp(){
      let index
      if (this.selectedHospital !== null && this.selectedHospital !== ''){
        for (let i = 0; i < this.verifiedHospitals.length; i++) {
          if (this.verifiedHospitals[i].hospitalName === this.selectedHospital){
            index = i
            break
          }
        }
        this.currentPage = Math.floor((index/this.pageSize))+1
        this.$refs.verifiedHospitalData.setCurrentRow(this.verifiedHospitalData[index])
      }else {
        ElMessage.warning("尚未输入医院名称！")
      }
    },
    showDetails(rowIndex,dynamicIndex){
      let src = 'http://localhost/common/downloadImg?fileName='+this.applications[rowIndex].applyImage
      this.imgSrc[0] = src
      this.imgPreview[0] = src
      this.detailImgDialog = true
    },
    passQual(rowIndex,dynamicIndex){
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
      this.applications[rowIndex].applyState = '已通过'
      this.applications[rowIndex].handleTime = new Date().toLocaleString()
      this.applyDTO.id = this.applications[rowIndex].id
      this.applyDTO.applyState = '已通过'
      this.applyDTO.handleTime = new Date().toLocaleString()
      axios.put("http://localhost/apply/update",this.applyDTO).then(res=>{
        if (res.data === 'update success') {
          ElMessage.success("处理成功")
          axios.put("http://localhost/admins/updateHospQual?hospId="+this.applications[rowIndex].initiatorId+"&qualification=true").then(res=>{
            if (res.data !== 'update success')
              ElMessage.error("系统繁忙，请稍后再试")
            else {
              this.tableDataTrans(rowIndex, 'toHandled')
            }
          })
        }
        else
          ElMessage.error("系统繁忙，请稍后再试！")
      })
    },
    rejectQual(rowIndex,dynamicIndex){
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
      this.applications[rowIndex].applyState = '被驳回'
      this.applications[rowIndex].handleTime = new Date().toLocaleString()
      this.applyDTO.id = this.applications[rowIndex].id
      this.applyDTO.applyState = '被驳回'
      this.applyDTO.handleTime = new Date().toLocaleString()
      axios.put("http://localhost/apply/update",this.applyDTO).then(res=>{
        if (res.data === 'update success') {
          ElMessage.success("处理成功")
          this.tableDataTrans(rowIndex, 'toHandled')
        }
        else
          ElMessage.error("系统繁忙，请稍后再试！")
      })
    },
    reHandle(rowIndex,dynamicIndex){
      this.handledApplications[rowIndex].applyState = '审核中'
      this.applyDTO.id = this.handledApplications[rowIndex].id
      this.applyDTO.applyState = '审核中'
      axios.put("http://localhost/apply/update",this.applyDTO).then(res=>{
        if (res.data === 'update success') {
          ElMessage.success("操作成功")
          axios.put("http://localhost/admins/updateHospQual?hospId="+this.handledApplications[rowIndex].initiatorId+"&qualification=false").then(res=>{
            if (res.data !== 'update success')
              ElMessage.error("系统繁忙，请稍后再试")
            else {
              this.tableDataTrans(rowIndex, 'toUnHandle')
            }
          })
        }
        else
          ElMessage.error("系统繁忙，请稍后再试！")
      })
    },
    deleteHistory(rowIndex, dynamicIndex){
      axios.delete("http://localhost/admins/deleteApplication?id="+this.handledApplications[rowIndex].id).then(res=>{
        if (res.data === 'delete success') {
          ElMessage.success("删除成功！")
          this.handledApplications.splice(rowIndex, 1)
          this.handledData.splice(0, this.handledData.length)
          for (let i = 0; i < this.handledApplications.length; i++) {
            this.handledApplications[i].applyTime = new Date(this.handledApplications[i].applyTime).toLocaleString()
            this.handledData.push({
              rowId: i + 1,
              applyState: this.handledApplications[i].applyState,
              initiatorName: this.handledApplications[i].initiatorName,
              applyType: this.handledApplications[i].applyType,
              applyTime: this.handledApplications[i].applyTime,
              handleTime: this.handledApplications[i].handleTime,
              handlerName: this.handledApplications[i].handlerName
            })
          }
        }else {
          ElMessage.error("系统繁忙，请稍后再试！")
        }
      })

    },
    tableDataTrans(rowIndex, direction){
      if (direction === 'toHandled') {
        this.handledApplications.push(this.applications[rowIndex])
        this.applications.splice(rowIndex, 1)
      }else if (direction === 'toUnHandle'){
        this.applications.unshift(this.handledApplications[rowIndex])
        this.handledApplications.splice(rowIndex, 1)
      }
      this.applyData.splice(0, this.applyData.length)
      this.handledData.splice(0, this.handledData.length)
      for (let i = 0; i < this.applications.length; i++) {
        this.applications[i].applyTime = new Date(this.applications[i].applyTime).toLocaleString()
        this.applyData.push({
          rowId: i+1,
          applyState: '待处理',
          initiatorName: this.applications[i].initiatorName,
          applyType: this.applications[i].applyType,
          applyTime: this.applications[i].applyTime
        })
      }
      for (let i = 0; i < this.handledApplications.length; i++) {
        this.handledApplications[i].applyTime = new Date(this.handledApplications[i].applyTime).toLocaleString()
        this.handledData.push({
          rowId: i+1,
          applyState: this.handledApplications[i].applyState,
          initiatorName: this.handledApplications[i].initiatorName,
          applyType: this.handledApplications[i].applyType,
          applyTime: this.handledApplications[i].applyTime,
          handleTime: this.handledApplications[i].handleTime,
          handlerName: this.handledApplications[i].handlerName
        })
      }
    }
  },
  mounted() {
    axios.get("http://localhost/admins/getAllHospitals").then(res=>{
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].qualification){
          this.verifiedHospitals.push(res.data[i])
        }
      }
      if (this.verifiedHospitals.length !== 0){
        for (let i = 0; i < this.verifiedHospitals.length; i++) {
          this.verifiedHospitalData.push({
            rowId: i+1,
            hospitalName: this.verifiedHospitals[i].hospitalName,
            hospitalDescription: this.verifiedHospitals[i].hospitalDescription,
          })
        }
      }
    })
    axios.get("http://localhost/admins/getApplyByType?id="+window.localStorage.getItem('adminId')+"&type=机构资质认证申请").then(res=>{
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
      for (let i = 0; i < res.data.length; i++) {
        let applyState = (res.data[i].applyState === '审核中') ? '待处理' : '已处理'
        if (applyState === '待处理') {
          this.applications.push(res.data[i])
        }else {
          this.handledApplications.push(res.data[i])
        }
      }

      for (let i = 0; i < this.applications.length; i++) {
        this.applications[i].applyTime = new Date(this.applications[i].applyTime).toLocaleString()
          this.applyData.push({
            rowId: i+1,
            applyState: '待处理',
            initiatorName: this.applications[i].initiatorName,
            applyType: this.applications[i].applyType,
            applyTime: this.applications[i].applyTime
          })
      }
      for (let i = 0; i < this.handledApplications.length; i++) {
        this.handledApplications[i].applyTime = new Date(this.handledApplications[i].applyTime).toLocaleString()
        this.handledData.push({
          rowId: i+1,
          applyState: this.handledApplications[i].applyState,
          initiatorName: this.handledApplications[i].initiatorName,
          applyType: this.handledApplications[i].applyType,
          applyTime: this.handledApplications[i].applyTime,
          handleTime: this.handledApplications[i].handleTime,
          handlerName: this.handledApplications[i].handlerName
        })
      }
    })
  }
}
</script>

<style scoped>
.a{
  color: #dbeaff;
}
::v-deep .el-table__body tr.current-row>td {
  color: #fff;
  background: #b7daff !important;
}

</style>