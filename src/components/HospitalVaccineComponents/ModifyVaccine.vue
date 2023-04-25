<template>
<div style="position: fixed;left: 340px;top: 100px">
  <el-table :data="vaccineData.slice(pageSize*(currentPage-1),pageSize+pageSize*(currentPage-1))" style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc" height="500">
    <el-table-column label="序号"  prop="rowId" />
    <el-table-column label="疫苗名称"  prop="vaccineName" />
    <el-table-column label="疫苗价格"  prop="vaccinePrice" >
      <template #default="scope">
        <span>{{scope.row.vaccinePrice}} 元/剂</span>
        <el-popover placement="top" width="250" trigger="click">
          <template #reference>
            <el-link :underline="false"  style="margin-left: 10px"><el-icon  size="18px"><Edit /></el-icon></el-link>
          </template>
          <el-input-number :precision="2" controls-position="right" :step="5" v-model="price" :model-value="scope.row.vaccinePrice"></el-input-number>
          <el-button type="primary" color=" #ecf5ff" size="small"  @click="modifyAttribute(scope.row.rowId-1,scope.row)" style="float: right;margin-top: 7px">保存</el-button>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="疫苗描述"  prop="vaccineDescription" >
      <template #default="scope">
        <el-popover placement="bottom" width="500" trigger="click" @hide="isDescriptionModify = true">
          <template #reference>
            <el-button size="small" @click="description = scope.row.vaccineDescription">点击查看</el-button>
          </template>
          <el-input type="textarea" :rows="5" v-model="description" :disabled="isDescriptionModify" ></el-input>
          <el-button style="float: right"  color=" #ecf5ff" @click="isDescriptionModify = false" v-show="isDescriptionModify">修改</el-button>
          <el-button v-show="!isDescriptionModify"  color=" #ecf5ff" @click="modifyAttribute(scope.row.rowId-1,scope.row)" style="float: right">保存</el-button>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="研制公司"  prop="prepareCompany" />
    <el-table-column label="操作" >
      <template #default="scope">
        <el-popconfirm title="确定要删除该疫苗吗？" width="200px" @confirm="deleteVaccine(scope.row.rowId-1)" confirm-button-type="danger">
          <template #reference>
            <el-button type="danger" >删除</el-button>
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
      :total="vaccineData.length"
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
  name: "ModifyVaccine",
  data(){
    return{
      price:0,
      isDescriptionModify:true,
      description:"",
      pageSize:10,
      currentPage:1,
      vaccineData:[],
      queryVaccines:[],
      vaccineDTO:{},
    }
  },
  methods:{
    deleteVaccine(rowIndex){
      axios.delete("http://localhost/vaccines/deleteVaccine?id="+this.queryVaccines[rowIndex].id).then(res=>{
        if (res.data === 'delete success'){
          ElMessage.success("删除成功")
          this.vaccineData.splice(rowIndex,1)
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
        ElMessage.error("系统繁忙，请稍后再试！")
      })
    },
    modifyAttribute(rowIndex, row){

      this.vaccineDTO.id = this.queryVaccines[rowIndex].id
      this.vaccineDTO.vaccinePrice = this.price
      this.vaccineDTO.vaccineDescription = this.description
      axios.put("http://localhost/vaccines/updateVaccine",this.vaccineDTO).then(res=>{
        if (res.data === 'update success'){
          ElMessage.success("修改成功！")
          if (this.price !== 0 ){
            row.vaccinePrice = this.price
          }
          if (this.description !== ""){
            row.vaccineDescription = this.description
          }
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
        ElMessage.error("系统繁忙，请稍后再试！")
      })
    },
    handleSizeChange(value){
      this.pageSize = value
      this.currentPage = 1
    },
    handleCurrentChange(value){
      this.currentPage = value
    },
  },
  mounted() {
    axios.get("http://localhost/vaccines/getByHospId?hospId="+window.localStorage.getItem('id')).then(res=>{
      this.queryVaccines = res.data
      for (let i = 0; i < res.data.length; i++) {
        this.vaccineData.push({
          rowId: i+1,
          vaccineName: res.data[i].vaccineName,
          vaccinePrice: res.data[i].vaccinePrice,
          vaccineDescription: res.data[i].vaccineDescription,
          prepareCompany: res.data[i].prepareCompany,
        })
      }
    })
  }
}
</script>

<style scoped>

</style>