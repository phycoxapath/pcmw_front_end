<template>
  <div>
    <el-tabs type="border-card" style="position:fixed;left: 200px" @tab-change="tabSwitchHandle">
      <el-tab-pane label="用户列表">
        <el-table ref="userData" :data="userData.slice((currentPage-1)*pageSize,(currentPage-1)*pageSize+pageSize)" highlight-current-row style="width: 1100px;background-color: #FAFAFA;border:2px solid #c8c9cc;margin-top: 20px" height="500">
          <el-table-column label="序号" width="120px" prop="rowId" />
          <el-table-column label="账号"  prop="loginName" />
          <el-table-column label="姓名"  prop="userName" />
          <el-table-column label="性别" width="80px" prop="gender" />
          <el-table-column label="年龄" width="80px" prop="age" />
          <el-table-column label="地址"  width="200px" prop="address" >
            <template #default="scope">
              <el-popover trigger="hover" placement="top" width="200">
                <template #reference>
                  <el-text truncated>{{scope.row.address}}</el-text>
                </template>
                <el-text >{{scope.row.address}}</el-text>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="资质" width="100px" prop="qualification" >
            <template #default="scope">
              <span>{{scope.row.qualification ? "是": "否" }}</span>
            </template>
          </el-table-column>

          <el-table-column align="left" width="300px">
            <template #header>
              <el-select
                  v-model="selectedUser"
                  style="width: 200px"
                  filterable
                  remote
                  placeholder="输入账号搜索"
                  :remote-method="userSearch"
                  :loading="isLoad"
                  clearable
              >
                <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.loginName"
                    :value="item.loginName"
                />
              </el-select>
              <el-button round color="#DBEAFFFF" style="position:fixed;color: #409EFF" @click="searchUser">搜索</el-button>
            </template>
            <template #default="scope">
              <el-popconfirm title="确定要撤销此用户的资质吗？" width="250" @confirm="revokeQual(scope.row.rowId-1, scope.row)" cancel-button-type="primary" confirm-button-type="warning">
                <template #reference>
                  <el-button size="small" type="warning">撤销资质</el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm title="确定要注销此账户吗？" width="250" @confirm="deleteUser(scope.row.rowId-1,scope.$index)" icon="WarningFilled" cancel-button-type="primary" confirm-button-type="danger">
                <template #reference>
                  <el-button size="small" type="danger">注销</el-button>
                </template>
              </el-popconfirm>
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
            :total="userData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            style="margin-top: 10px;margin-left: 300px"
        />
      </el-tab-pane>
      <el-tab-pane label="资质管理">
        <el-table :data="applyData" style="width: 1000px;background-color: #FAFAFA" height="500" >
          <el-table-column label="序号" width="100px" prop="rowId" />
          <el-table-column label="处理情况" width="120px" prop="applyState" />
          <el-table-column label="申请者名称" width="180px" prop="initiatorName" >
            <template #default="scope">
              <el-popover placement="top" width="200">
                <template #reference >
                  <el-link :underline="false" @click="showUserDetails(scope.row.rowId-1, scope.$index)">{{scope.row.initiatorName}}</el-link>
                </template>
                <p> 点击查看用户详细信息</p>
              </el-popover>
            </template>
          </el-table-column>
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
      </el-tab-pane>
    </el-tabs>
  </div>
<div>
  <el-dialog v-model="detailImgDialog" title="详细信息" draggable>
    <el-image v-for="src in imgSrc" :src=src :preview-src-list="imgPreview"></el-image>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="detailImgDialog = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="用户详细" v-model="initiatorDetail" draggable>
    <el-descriptions
        class="margin-top"
        title="用户信息"
        :column="1"
        size="default"
        border

    >
      <el-descriptions-item width="300"  v-for="(attr,index) in showData" :key="index">
        <template #label>
          {{index}}
        </template>
        <span>{{attr}}</span>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button type="primary" @click="initiatorDetail = false">关闭</el-button>
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
</div>

</template>

<script>
import axios from "../../utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "UserMana",
  data(){
    return{
      handledApplyDialog:false,
      detailImgDialog:false,
      initiatorDetail:false,
      selectedUser:"",
      imgSrc:[""],
      imgPreview:[""],
      userData:[],
      users:[],
      applyData:[],
      applications:[],
      handledData:[],
      handledApplications:[],
      options:[],
      pageSize:10,
      currentPage:1,
      isLoad:false,
      applyDTO:{},
      showData:{
        用户名:"",
        姓名:"",
        性别:"",
        年龄:"",
        收货地址:"",
        是否取得资质:"",
        资质类型:"",
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
    tabSwitchHandle(){

    },
    showUserDetails(rowIndex,row) {
      this.initiatorDetail = true
        axios.get("http://localhost/users/getById?id=" + this.applications[rowIndex].initiatorId).then(res => {
          let i = 0, j = 0
          for (const resKey in res.data) {
            if (resKey === 'id') {
              continue;
            }
            if (resKey === 'password') {
              continue;
            }
            i++;
            for (const userKey in this.showData) {
              j++;
              if (i === j) {
                if (res.data[resKey] === true || res.data[resKey] === false) {
                  this.showData[userKey] = res.data[resKey] === true ? '是' : '否'
                } else {
                  this.showData[userKey] = res.data[resKey];
                }
                j = 0
                break;
              }
            }
            if (resKey === 'qualType')
              break;
          }
        })

    },
    userSearch(val){
      let hit = false
      if (val){
        this.isLoad = true
        setTimeout(()=>{
          this.isLoad = false
          for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].loginName.toLowerCase().includes(val.toLowerCase())) {
              this.options.push(this.users[i])
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
    searchUser(){
      let index
      if (this.selectedUser !== null && this.selectedUser !== ''){
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].loginName === this.selectedUser){
            index = i
            break
          }
        }
        this.currentPage = Math.floor((index/this.pageSize))+1
        this.$refs.userData.setCurrentRow(this.userData[index])
      }else {
        ElMessage.warning("尚未输入医院名称！")
      }
    },
    revokeQual(rowIndex, row){
      if (!this.users[rowIndex].qualification){
        ElMessage.warning("该用户未拥有资质！")
        return
      }
      axios.put("http://localhost/admins/updateUserQual?userId="+this.users[rowIndex].id+"&qualification=false").then(res=>{
        if (res.data === 'update success'){
          ElMessage.success("撤销成功！")
          this.users[rowIndex].qualification = false
          row.qualification = false
        }
      })
    },
    deleteUser(rowIndex, dynamicIndex){
      axios.delete("http://localhost/admins/deleteUserById?id="+this.users[rowIndex].id).then(res=>{
        if (res.data === 'delete success'){
          ElMessage.success("注销成功！")
          this.userData.splice(dynamicIndex,1)
        }
      })
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
          axios.put("http://localhost/admins/updateUserQual?userId="+this.applications[rowIndex].initiatorId+"&qualification=true").then(res=>{
            if (res.data !== 'update success')
              ElMessage.error("系统繁忙，请稍后再试")
            else {
              for (let i = 0; i < this.userData.length; i++) {
                if (this.applications[rowIndex].loginName === this.userData[i].loginName){
                  this.userData[i].qualification = true
                }
              }
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
          for (let i = 0; i < this.userData.length; i++) {
            if (this.applications[rowIndex].loginName === this.userData[i].loginName){
              this.userData[i].qualification = false
            }
          }
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
          axios.put("http://localhost/admins/updateUserQual?userId="+this.handledApplications[rowIndex].initiatorId+"&qualification=false").then(res=>{
            if (res.data !== 'update success')
              ElMessage.error("系统繁忙，请稍后再试")
            else {
              for (let i = 0; i < this.userData.length; i++) {
                if (this.handledApplications[rowIndex].loginName === this.userData[i].loginName){
                  this.userData[i].qualification = false
                  break
                }
              }
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
    axios.get("http://localhost/admins/getAllUsers").then(res=>{
      this.users = res.data
      for (let i = 0; i < this.users.length; i++) {
        this.userData.push({
          rowId: i+1,
          loginName: this.users[i].loginName,
          userName: this.users[i].userName,
          gender: this.users[i].gender,
          age: this.users[i].age,
          address: this.users[i].address,
          qualification: this.users[i].qualification,
        })
      }
    })
    axios.get("http://localhost/admins/getApplyByType?id="+window.localStorage.getItem('adminId')+"&type=免挂号绿色通道预约资质申请").then(res=>{
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
::v-deep .el-table__body tr.current-row>td {
  color: #fff;
  background: #b7daff !important;
}
</style>