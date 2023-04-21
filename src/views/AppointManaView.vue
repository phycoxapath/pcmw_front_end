<template>
  <div>
    <el-menu
        active-text-color="#337ecc"
        default-active="1"
        background-color="#FAFCFF"
        class="el-menu-vertical-demo"
        text-color="#303133"
        @select=selectHandle
    >
      <el-menu-item index="valid">
        <el-icon><Checked /></el-icon>
        <span>待处理预约</span>
      </el-menu-item>
      <el-menu-item index="overdue">
        <el-icon><Failed /></el-icon>
        <span>已过期预约</span>
      </el-menu-item>
    </el-menu>
  </div>
  <div style="position: fixed;left: 340px;top: 100px">
    <el-table :data="defaultData.slice(pageSize*(currentPage-1),pageSize+pageSize*(currentPage-1))" style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc" height="500" v-show="appointState === '普通预约'">
      <el-table-column label="序号"  prop="rowId" >
      </el-table-column>
      <el-table-column label="预约类型"  prop="appointType" />
      <el-table-column label="患者姓名"  prop="initiatorName" >
        <template #default="scope">
          <el-tooltip
              class="box-item"
              effect="light"
              content="点击查看患者详细信息"
              placement="right-start"
          >
          <el-button text @click="showInitiatorDetail(scope.row.rowId-1,scope.row)">{{scope.row.initiatorName}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="患者备注"  prop="appointAppendix" >
        <template #default="scope">
          <el-popover placement="bottom" width="400" trigger="click">
            <template #reference>
              <el-button size="small" @click="appendix = scope.row.appointAppendix">点击查看</el-button>
            </template>
            <el-input type="textarea" :rows="5" v-model="appendix" disabled ></el-input>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" prop="appointTime" sortable/>
<!--      <el-table-column label="操作" prop="handle" >-->
<!--        <template #default="scope">-->
<!--          <el-popconfirm title="您确定要取消预约吗？" width="200px" @confirm="cancelAppoint(scope.row.rowId-1,scope.row)" confirm-button-type="danger">-->
<!--            <template #reference>-->
<!--              <el-button size="small"  :disabled="isOverdue">取消预约</el-button>-->
<!--            </template>-->
<!--          </el-popconfirm>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[2, 5, 7, 10]"
        :small="false"
        :disabled="false"
        :background="true"
        layout="prev, pager, next, jumper, sizes"
        :total="defaultData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 10px;margin-left: 300px"
    />
  </div>
  <el-dialog title="患者详细" v-model="initiatorDetail" draggable>
    <el-descriptions
        class="margin-top"
        title="患者信息"
        :column="1"
        size="default"
        border

    >
      <el-descriptions-item width="300"  v-for="(attr,index) in showData" :key="index">
        <template #label>
          {{index}}
        </template>
        <span v-show="index !== '工作日'">{{attr}}</span>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button type="primary" @click="initiatorDetail = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "AppointManaView",
  data(){
    return{
      initiatorDetail:false,
      currentPage:1,
      pageSize:10,
      isOverdue:false,
      isConfirmCancel:false,
      appendix:"",
      appointState:"普通预约",
      defaultData:[],
      greenChannelData:[],
      validAppointments:[],
      overdueAppointments:[],
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
    selectHandle(key){
      if (key === 'valid'){
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
            initiatorName:this.validAppointments[i].initiatorName,
            appointAppendix:this.validAppointments[i].appointAppendix,
            appointTime:this.validAppointments[i].appointTime.toLocaleString()
          })
        }
      } else if (key === 'overdue'){
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
        for (let i = 0; i < this.overdueAppointments.length; i++) {
          this.defaultData.push({
            rowId:i+1,
            appointType:this.overdueAppointments[i].appointType,
            initiatorName:this.overdueAppointments[i].initiatorName,
            appointAppendix:this.overdueAppointments[i].appointAppendix,
            appointTime:this.overdueAppointments[i].appointTime.toLocaleString()
          })
        }
      }
    },
    handleSizeChange(value){
      this.pageSize = value
      this.currentPage = 1
    },
    handleCurrentChange(value){
      this.currentPage = value
    },
    showInitiatorDetail(rowIndex,row) {
      this.initiatorDetail = true
      let date = new Date(row.appointTime.replace('-','/'))
      if (date > new Date()) {
        axios.get("http://localhost/users" + "/getById?id=" + this.validAppointments[rowIndex].initiatorId).then(res => {
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
      }else {
        axios.get("http://localhost/users" + "/getById?id=" + this.overdueAppointments[rowIndex].initiatorId).then(res => {
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
      }
    }
  },
  mounted() {
    axios.get("http://localhost/appointments/getValidByHandlerId?handlerId="+window.localStorage.getItem('id')+"&role="+window.localStorage.getItem('loginRole')).then(res =>{
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
          initiatorName:this.validAppointments[i].initiatorName,
          appointAppendix:this.validAppointments[i].appointAppendix,
          appointTime:this.validAppointments[i].appointTime.toLocaleString()
        })
      }
    })
    axios.get("http://localhost/appointments/getOverdueByHandlerId?handlerId="+window.localStorage.getItem('id')+"&role="+window.localStorage.getItem('loginRole')).then(res =>{
      this.overdueAppointments = res.data
    })
  }

}
</script>

<style scoped>
.el-menu-vertical-demo{
  position: fixed;
  width: 200px;
  height: 700px;
}
</style>