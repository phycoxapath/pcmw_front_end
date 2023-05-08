<template>
  <el-menu
      active-text-color="#337ecc"
      default-active="1"
      background-color="#FAFCFF"
      class="el-menu-vertical-demo"
      text-color="#303133"
      @select=selectHandle
  >
    <el-menu-item index="GreenCh">
      <el-icon><Checked /></el-icon>
      <span>绿色通道预约处理</span>
    </el-menu-item>
  </el-menu>
  <div style="position: fixed;left: 340px;top: 100px" v-show="isQualified">
    <el-table :data="showData.slice(pageSize*(currentPage-1),pageSize+pageSize*(currentPage-1))" style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc" height="500">
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
      <el-table-column label="发起时间" width="200px" prop="operateTime"></el-table-column>
      <el-table-column label="受理状况" prop="appointState" :filter-method="filterHandler" :filters="[{text:'待处理',value:'待处理'},{text:'已响应',value:'已响应'},{text:'已处理',value:'已处理'},]">
        <template #default="scope">
          <span>{{scope.row.appointState}}</span>
          <el-popover placement="top" :width="300" trigger="hover">
            <template #reference>
              <el-icon size="17px"><QuestionFilled /></el-icon>
            </template>
            <el-text style="margin-left: 20px">受理状况有：</el-text><el-text type="danger">待处理|已响应|已处理</el-text><el-text>三种，当医院响应预约后受理状况将变为已响应，当患者入院得到治疗后将变为已处理</el-text>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-popconfirm title="确定要响应预约吗？" width="200px" @confirm="updateState(scope.row.rowId-1,scope.row)" confirm-button-type="danger">
            <template #reference>
              <el-button type="danger"  v-show="scope.row.appointState === '待处理'">响应</el-button>
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
        :total="showData.length"
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
      <el-descriptions-item width="300"  v-for="(attr,index) in userData" :key="index">
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
import {ElMessage} from "element-plus";

export default {
  name: "GreenChannelManaView",
  data(){
    return{
      isQualified:false,
      initiatorDetail:false,
      appendix:"",
      currentPage:1,
      pageSize:10,
      showData:[],
      greenChData:[],
      vaccineData:[],
      userData:{
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

    },
    handleSizeChange(value){
      this.pageSize = value
      this.currentPage = 1
    },
    handleCurrentChange(value){
      this.currentPage = value
    },
    updateState(rowIndex,row){
      axios.put("http://localhost/appointments/updateAppointmentState?id="+this.greenChData[rowIndex].id+"&state=已响应").then(res=>{
        if (res.data === 'update success'){
          ElMessage.success("响应成功")
          this.showData[rowIndex].appointState = '已响应'
        }else {
          ElMessage.error("系统繁忙，请稍后再试！")
        }
      }).catch(err=>{
        if (err.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', err.message);
        }
        console.log(err.config);
      })
    },
    filterHandler(value,row,column){
      return row.appointState === value
    },
    showInitiatorDetail(rowIndex,row) {
      this.initiatorDetail = true
        axios.get("http://localhost/users" + "/getById?id=" + this.greenChData[rowIndex].initiatorId).then(res => {
          let i = 0, j = 0
          for (const resKey in res.data) {
            if (resKey === 'id') {
              continue;
            }
            if (resKey === 'password') {
              continue;
            }
            i++;
            for (const userKey in this.userData) {
              j++;
              if (i === j) {
                if (res.data[resKey] === true || res.data[resKey] === false) {
                  this.userData[userKey] = res.data[resKey] === true ? '是' : '否'
                } else {
                  this.userData[userKey] = res.data[resKey];
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
  },
  mounted() {
    axios.get("http://localhost/hospitals/getById?id="+window.localStorage.getItem('id')).then(res=>{
      if (res.data.qualification){
        this.isQualified = true
      }else {
        ElMessage.error("您尚未认证机构资质，请先申请认证资质！")
        setTimeout( () =>{
          window.location.href = 'http://localhost:8080/#/personalCenter/userQualification'
        },1200)
      }
    })
    axios.get("http://localhost/appointments/getValidByHandlerIdAndType?handlerId="+window.localStorage.getItem('id')+"&type=绿色通道").then(res =>{
      this.greenChData = res.data
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
        this.showData.push({
          rowId:i+1,
          appointType: res.data[i].appointType,
          initiatorName: res.data[i].initiatorName,
          appointAppendix: res.data[i].appointAppendix,
          operateTime: new Date(res.data[i].operateTime).toLocaleString(),
          appointState: res.data[i].appointState,

        })
      }

    })
  },
}
</script>

<style scoped>
.el-menu-vertical-demo{
  position: fixed;
  width: 200px;
  height: 700px;
}
</style>