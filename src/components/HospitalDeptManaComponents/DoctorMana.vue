<template>
<div style="position: fixed;left: 340px;top: 100px">
  <el-select v-model="selectedDept" placeholder="请选择科室" clearable @change="showDoctorsByDept">
    <el-option v-for="(dept,index) in options" :key="index" :label="dept.deptName" :value="dept.id" />
  </el-select>
  <el-table ref="docData" :data="docData.slice((currentPage-1)*pageSize,(currentPage-1)*pageSize+pageSize)" highlight-current-row style="width: 1100px;background-color: #FAFAFA;border:2px solid #c8c9cc;margin-top: 20px" height="500">
    <el-table-column label="序号" width="120px" prop="rowId" />
    <el-table-column label="工号"  prop="jobId" />
    <el-table-column label="姓名"  prop="docName" />
    <el-table-column label="性别"  prop="gender" />
    <el-table-column label="职称"  prop="docTitle" />
    <el-table-column label="简介"  prop="docProfile" >
      <template #default="scope">
        <el-popover width="250" placement="top" trigger="hover">
          <template #reference>
            <el-text truncated>{{scope.row.docProfile}}</el-text>
          </template>
          <el-text>{{scope.row.docProfile}}</el-text>
        </el-popover>
      </template>

    </el-table-column>
    <el-table-column label="资质"  prop="qualification" >
      <template #default="scope">
        <span>{{scope.row.qualification ? "是" : "否"}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="250">
      <template #default="scope">
        <el-popconfirm title="确定要撤销此用户的资质吗？" width="250" @confirm="revokeQual(scope.row.rowId-1, scope.row)" cancel-button-type="primary" confirm-button-type="warning">
          <template #reference>
            <el-button size="small" type="warning">撤销资质</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm title="确定要注销此账户吗？" width="250" @confirm="deleteDoctor(scope.row.rowId-1,scope.$index)" icon="WarningFilled" cancel-button-type="primary" confirm-button-type="danger">
          <template #reference>
            <el-button size="small" type="danger">注销</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      v-show="docData.length > 0"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[2, 5, 7, 10]"
      :small="false"
      :disabled="false"
      :background="true"
      layout="prev, pager, next, jumper, sizes"
      :total="docData.length"
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
  name: "DoctorMana",
  data(){
    return{
      selectedDept:"",
      options:[],
      doctors:[],
      docData:[],
      pageSize:10,
      currentPage:1,
      isLoad:false,
    }
  },
  methods:{
    showDoctorsByDept(val){
      axios.get("http://localhost/hospitals/getDoctorsByDeptId?deptId="+val).then(res=>{
        this.docData.splice(0,this.docData.length)
        this.doctors.splice(0,this.doctors.length)
        this.doctors = res.data
        for (let i = 0; i < res.data.length; i++) {
          this.docData.push({
            rowId: i+1,
            jobId: res.data[i].jobId,
            docName: res.data[i].docName,
            gender: res.data[i].gender,
            docTitle: res.data[i].docTitle,
            docProfile: res.data[i].docProfile,
            qualification: res.data[i].qualification
          })
        }
      })
    },
    handleSizeChange(value){
      this.pageSize = value
      this.currentPage = 1
    },
    handleCurrentChange(value){
      this.currentPage = value
    },
    revokeQual(rowIndex, row){
      if (!this.doctors[rowIndex].qualification){
        ElMessage.warning("该用户未拥有资质！")
        return
      }
      axios.put("http://localhost/hospitals/updateDocQual?docId="+this.doctors[rowIndex].id+"&qualification=false").then(res=>{
        if (res.data === 'update success'){
          ElMessage.success("撤销成功！")
          this.doctors[rowIndex].qualification = false
          row.qualification = false
        }
      })
    },
    deleteDoctor(rowIndex, dynamicIndex){
      axios.delete("http://localhost/admins/deleteDoctorById?id="+this.doctors[rowIndex].id).then(res=>{
        if (res.data === 'delete success'){
          ElMessage.success("注销成功！")
          this.docData.splice(dynamicIndex,1)
        }
      })
    },
  },
  mounted() {
    axios.get("http://localhost/hospitals/getById?id="+window.localStorage.getItem('id')).then(res=>{
      this.options = res.data.departments
    })
  }
}
</script>

<style scoped>

</style>