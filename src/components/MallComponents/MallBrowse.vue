<template>
  <div style="position: fixed;margin-top: 50px;margin-left: 300px;">
    <el-breadcrumb separator=">" style="position:fixed;top: 80px; left: 250px">
      <el-breadcrumb-item @click="browseSpecificCommodity = false" :to="'/shoppingMall/mallBrowse'">商城主页</el-breadcrumb-item>
      <el-breadcrumb-item v-show="browseSpecificCommodity">

      </el-breadcrumb-item>

    </el-breadcrumb>
    <el-table ref="commodityData" :data="commodityData.slice((currentPage-1)*pageSize,(currentPage-1)*pageSize+pageSize)" highlight-current-row style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc;" height="590">
      <el-table-column width="1px" prop="rowId" >
        <template #default="scope">
          <span>{{}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="commodityImage" width="300px">
        <template #header>

          <el-select v-model="categoryFilter" style="width: 150px" placeholder="筛选类别" clearable>
            <el-option label="抗疫药品" value="抗疫药品"></el-option>
            <el-option label="防疫日用品" value="防疫日用品"></el-option>
            <el-option label="感染自检用品" value="感染自检用品"></el-option>
          </el-select>
          <el-button style="margin-left: 10px" size="small" type="primary">筛选</el-button>
          <el-button size="small" >重置</el-button>
        </template>
        <template #default="scope">
          <el-image :src="imgSrc+scope.row.commodityImage" style="width: 50%;height: 50%"></el-image>
        </template>
      </el-table-column>
      <el-table-column  prop="commodityName">

        <template #default="scope">
          <el-link style="font-size: 20px">{{scope.row.commodityName}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="commodityPrice"  align="right">
        <template #header>
          <el-select
              v-model="searchCommodity"
              style="width: 200px;margin-right: 55px"
              filterable
              remote
              placeholder="输入商品名称搜索"
              :remote-method="remoteHandler"
              :loading="isLoad"
              clearable
          >
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.commodityName"
                :value="item.commodityName"
            />
          </el-select>
          <el-button round color="#DBEAFFFF" style="position:fixed;color: #409EFF;right: 240px" @click="searchHandler">搜索</el-button>
        </template>
        <template #default="scope">
          <el-text style="color: #fd503e;font-size: 18px">￥</el-text><el-text style="font-size: 25px;color: #fd503e">{{scope.row.commodityPrice}}</el-text>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[2, 4, 7, 10]"
        :small="false"
        :disabled="false"
        :background="true"
        layout="prev, pager, next, jumper, sizes"
        :total="commodityData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 10px;margin-left: 300px"
    />
  </div>

</template>

<script>
import axios from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "MallBrowse",
  data(){
    return{
      browseSpecificCommodity:false,
      searchCommodity:"",
      categoryFilter:"",
      imgSrc:"http://localhost/common/downloadImg?fileName=",
      commodityData:[],
      commodities:[],
      options:[],
      pageSize:4,
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
    remoteHandler(val){
      let hit = false
      if (val){
        this.isLoad = true
        setTimeout(()=>{
          this.isLoad = false
          for (let i = 0; i < this.commodities.length; i++) {
            if (this.commodities[i].commodityName.toLowerCase().includes(val.toLowerCase())) {
              this.options.push(this.commodities[i])
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
    searchHandler(){
      let index
      if (this.searchCommodity !== null && this.searchCommodity !== ''){
        for (let i = 0; i < this.commodities.length; i++) {
          if (this.commodities[i].commodityName === this.searchCommodity){
            index = i
            break
          }
        }
        this.currentPage = Math.floor((index/this.pageSize))+1
        this.$refs.commodityData.setCurrentRow(this.commodityData[index])
      }else {
        ElMessage.warning("尚未输入商品名称！")
      }
    }
  },
  mounted() {
    axios.get("http://localhost/commodities/getAllCommodity").then(res=>{
      this.commodities = res.data
      for (let i = 0; i < this.commodities.length; i++) {
        this.commodityData.push({
          rowId:i+1,
          commodityImage:this.commodities[i].commodityImage,
          commodityName:this.commodities[i].commodityName,
          commodityPrice:this.commodities[i].commodityPrice,
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