<template>
  <div style="position: fixed;left: 340px;top: 100px">
    <el-button-group v-show="appointType === '普通预约'">
      <el-button type="" plain color="#02cec9" @click="switchToValid">未赴约</el-button>
      <el-button type="" plain color="#02cec9" @click="switchToOverdue">已过期</el-button>
    </el-button-group>
    <el-button-group v-show="appointType !== '普通预约'">
      <el-button type="" plain color="#02cec9" @click="switchToValid">未处理</el-button>
      <el-button type="" plain color="#02cec9" @click="switchToOverdue">已处理</el-button>
    </el-button-group>
    <el-radio-group v-model="appointType" size="default" fill="#02cec9" style="position:relative;left: 650px">
      <el-radio-button label="普通预约" />
      <el-radio-button label="绿色通道预约" />
    </el-radio-group>
    <el-table :data="defaultData.slice(pageSize*(currentPage-1),pageSize+pageSize*(currentPage-1))" style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc" height="500" v-show="appointType === '普通预约'">
      <el-table-column label="序号" width="100px" prop="rowId" >
      </el-table-column>
      <el-table-column label="预约类型" width="120px" prop="appointType" />
      <el-table-column label="医生姓名" width="120px" prop="handlerName" />
      <el-table-column label="医生科室" width="150px" prop="handlerDept" />
      <el-table-column label="备注" width="120px" prop="appointAppendix" >
        <template #default="scope">
            <el-popover placement="bottom" width="400" trigger="click">
              <template #reference>
                <el-button size="small" @click="appendix = scope.row.appointAppendix">点击查看</el-button>
              </template>
              <el-input type="textarea" :rows="5" v-model="appendix" disabled ></el-input>
            </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" prop="appointTime" />
      <el-table-column label="操作" prop="handle" >
        <template #default="scope">
          <el-popconfirm title="您确定要取消预约吗？" width="200px" @confirm="cancelAppoint(scope.row.rowId-1,scope.row)" confirm-button-type="danger">
            <template #reference>
              <el-button size="small"  :disabled="isOverdue">取消预约</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="greenChannelData.slice((currentPage-1)*pageSize,(currentPage-1)*pageSize+pageSize)" style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc" height="500" v-show="appointType === '绿色通道预约'">
      <el-table-column label="序号" width="100px" prop="rowId" />
      <el-table-column label="预约类型" prop="appointType" />
      <el-table-column label="发起时间" width="200px" prop="operateTime" />
      <el-table-column label="医院名称" prop="handlerName" />
      <el-table-column label="症状简述" prop="appointAppendix" >
        <template #default="scope">
          <el-popover placement="bottom" width="400" trigger="click">
            <template #reference>
              <el-button size="small" @click="appendix = scope.row.appointAppendix">点击查看</el-button>
            </template>
            <el-input type="textarea" :rows="5" v-model="appendix" disabled ></el-input>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="受理情况" prop="appointState" >
        <template #default="scope">
          <span>{{scope.row.appointState}}</span>
          <el-popover placement="top" :width="300" trigger="hover">
            <template #reference>
              <el-icon size="17px"><QuestionFilled /></el-icon>
            </template>
            <el-text style="margin-left: 20px">受理状况有：</el-text><el-text type="danger">待处理|已响应|已处理</el-text><el-text>三种，当医院响应您的预约后受理状况将变为已响应，当您入院得到治疗后将变为已处理</el-text>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="handle" >
        <template #default="scope">
          <el-popconfirm title="您确定要取消预约吗？" width="200px" @confirm="cancelAppoint(scope.row.rowId-1,scope.row)" confirm-button-type="danger">
            <template #reference>
              <el-button size="small"  :disabled="isOverdue">取消预约</el-button>
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
        :total="appointType === '普通预约' ? defaultData.length : greenChannelData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 10px;margin-left: 300px"
    />
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "UserAppointMana",
  data(){
    return{
      currentPage:1,
      pageSize:10,
      isOverdue:false,
      isConfirmCancel:false,
      appendix:"",
      appointType:"普通预约",
      defaultData:[],
      greenChannelData:[],
      validAppointments:[],
      overdueAppointments:[],
      validGreenCh:[],
      overdueGreenCh:[],
      total:"",
    }
  },
  methods:{
    cancelAppoint(rowIndex,row){
      if (this.isOverdue === true){
        ElMessage.error("无法操作已过期预约！")
        return
      }
      axios.delete("http://localhost/appointments/deleteAppointment?id="+(this.appointType === '普通预约' ? this.validAppointments[rowIndex].id : this.validGreenCh[rowIndex].id)).then(res=>{
        if (res.data === 'delete success') {
          ElMessage.success("取消预约成功")
          if (this.appointType === '普通预约') {
            this.validAppointments.splice(rowIndex, 1)
            this.defaultData.splice(rowIndex, 1)
          }else {
            this.validGreenCh.splice(rowIndex,1)
            this.greenChannelData.splice(rowIndex,1)
          }
        }else {
          ElMessage.error("系统繁忙，请稍后再试")
        }
      })
    },
    switchToOverdue(){
      this.isOverdue = true
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
      this.defaultData.splice(0,this.defaultData.length)
      console.log(this.overdueAppointments)
      for (let i = 0; i < this.overdueAppointments.length; i++) {

        this.defaultData.push({
          rowId:i+1,
          appointType:this.overdueAppointments[i].appointType,
          handlerName:this.overdueAppointments[i].handlerName,
          handlerDept:this.overdueAppointments[i].handlerDept.deptName,
          appointAppendix:this.overdueAppointments[i].appointAppendix,
          appointTime:this.overdueAppointments[i].appointTime.toLocaleString()
        })
      }
      this.greenChannelData.splice(0,this.greenChannelData.length)
      for (let i = 0; i < this.overdueGreenCh.length; i++) {
          this.greenChannelData.push({
            rowId: i + 1,
            handlerName: this.overdueGreenCh[i].handlerName,
            operateTime: new Date(this.overdueGreenCh[i].operateTime).toLocaleString(),
            appointType: this.overdueGreenCh[i].appointType,
            appointAppendix: this.overdueGreenCh[i].appointAppendix,
            appointState: this.overdueGreenCh[i].appointState
          })
        }


    },
    switchToValid(){
      this.isOverdue = false
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
      this.defaultData.splice(0,this.defaultData.length)
      for (let i = 0; i < this.validAppointments.length; i++) {
        this.defaultData.push({
          rowId:i+1,
          appointType:this.validAppointments[i].appointType,
          handlerName:this.validAppointments[i].handlerName,
          handlerDept:this.validAppointments[i].handlerDept.deptName,
          appointAppendix:this.validAppointments[i].appointAppendix,
          appointTime:this.validAppointments[i].appointTime.toLocaleString()
        })
      }

      this.greenChannelData.splice(0,this.greenChannelData.length)
      for (let i = 0; i < this.validGreenCh.length; i++) {

          this.greenChannelData.push({
            rowId: i + 1,
            handlerName: this.validGreenCh[i].handlerName,
            operateTime: new Date(this.validGreenCh[i].operateTime).toLocaleString(),
            appointType: this.validGreenCh[i].appointType,
            appointAppendix: this.validGreenCh[i].appointAppendix,
            appointState: this.validGreenCh[i].appointState
          })

      }
    },
    handleSizeChange(value){
      this.pageSize = value
      this.currentPage = 1
    },
    handleCurrentChange(value){
      this.currentPage = value
    }
  },
  mounted() {

    axios.get("http://localhost/appointments/getValidByInitiatorId?initiatorId="+window.localStorage.getItem('id')+"&type=普通预约").then(res =>{
      this.validAppointments = res.data
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
      for (let i = 0; i < this.validAppointments.length; i++) {
        this.defaultData.push({
          rowId:i+1,
          appointType:this.validAppointments[i].appointType,
          handlerName:this.validAppointments[i].handlerName,
          handlerDept:this.validAppointments[i].handlerDept.deptName,
          appointAppendix:this.validAppointments[i].appointAppendix,
          appointTime:this.validAppointments[i].appointTime.toLocaleString()
        })
      }
    })
    axios.get("http://localhost/appointments/getOverdueByInitiatorId?initiatorId="+window.localStorage.getItem('id')+"&type=普通预约").then(res =>{
      this.overdueAppointments = res.data
    })
    axios.get("http://localhost/appointments/getValidByInitiatorIdAndType?initiatorId="+window.localStorage.getItem('id')+"&type=绿色通道").then(res=>{
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
        if (res.data[i].appointState === '已处理'){
          this.overdueGreenCh.push(res.data[i])
        }else {
          this.validGreenCh.push(res.data[i])
        }
      }
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].appointState !== '已处理') {
          this.greenChannelData.push({
            rowId: i + 1,
            handlerName: res.data[i].handlerName,
            operateTime: new Date(res.data[i].operateTime).toLocaleString(),
            appointType: res.data[i].appointType,
            appointAppendix: res.data[i].appointAppendix,
            appointState: res.data[i].appointState
          })
        }
        // rowId" />
        //     ="appointType" />
        //     ="handlerName" />
        //     ="appointAppendix
        //     ="appointState" /
      }
    })
  }
}
</script>

<style scoped>
.a{
  color: #02cec9;
}
</style>