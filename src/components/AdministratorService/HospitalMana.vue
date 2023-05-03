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
      verifiedHospitalData:[],
      verifiedHospitals:[],
      applyData:[],
      applies:[],
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