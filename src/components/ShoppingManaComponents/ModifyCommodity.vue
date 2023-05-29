<template>
  <div style="margin-top: 20px;margin-left: 300px;position: fixed">
    <el-table ref="commodityData" :data="commodityData.slice((currentPage-1)*pageSize,(currentPage-1)*pageSize+pageSize)" highlight-current-row style="width: 1000px;background-color: #FAFAFA;border:2px solid #c8c9cc;" height="550">
      <el-table-column label="序号" width="100px" prop="rowId" />
      <el-table-column prop="commodityImage">
        <template #default="scope">
          <el-image :src="imgSrc+scope.row.commodityImage" style="width: 50%;height: 50%"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="commodityName"></el-table-column>
      <el-table-column label="商品类型" prop="commodityCategory" :filters="[{text:'抗疫药品',value:'抗疫药品'},{text:'防疫日用品',value:'防疫日用品'},{text:'感染自检用品',value:'感染自检用品'}]" :filter-method="filterHandler"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" type="warning" @click="modifyHandler(scope.row.rowId-1)">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
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
  <div>
    <el-dialog title="商品编辑" v-model="showModifyDialog" draggable>
      <el-form :model="modifyCommodityData" label-width="100px" class="demo-border"
               :rules="rules"
               ref="newCommodityData"
      >
        <el-form-item label="商品名称" prop="commodityName">
          <el-input placeholder="商品名称" v-model="modifyCommodityData.commodityName"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" prop="commodityCategory">
          <el-select allow-create filterable v-model="modifyCommodityData.commodityCategory">
            <el-option label="抗疫药品" value="抗疫药品"></el-option>
            <el-option label="防疫日用品" value="防疫日用品"></el-option>
            <el-option label="感染自检用品" value="感染自检用品"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="commodityDescription">
          <el-input type="textarea" rows="5" placeholder="添加商品描述" v-model="modifyCommodityData.commodityDescription"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="commodityPrice">
          <el-input-number :precision="2" controls-position="right" :step="5" min="0" v-model="modifyCommodityData.commodityPrice"></el-input-number>
        </el-form-item>
        <el-form-item label="商品库存" prop="commodityStock">
          <el-input-number  controls-position="right" :step="100" min="0" max="9999" v-model="modifyCommodityData.commodityStock"></el-input-number>
        </el-form-item>
        <el-form-item label="上传商品图片" prop="commodityImage">
          <el-upload
              class="avatar-uploader"
              action="http://localhost/admins/upload"
              limit="1"
              :file-list="fileList"
              list-type="picture-card"
              :on-success="handleSuccess"
              :before-upload="beforeAvatarUpload"
              :before-remove="handleRemove"
          >

            <el-icon v-if="!isUploadImg" class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button  type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "../../utils/request";
import {ElMessage} from "element-plus";


export default {
  name: "ModifyCommodity",
  data(){
    const priceAndStockValidator = (rule, value, callback) =>{
      if (value === 0){
        callback(new Error("价格和库存不能为0！"));
      }else
        callback();
    }
    return{
      isUploadImg:true,
      showModifyDialog:false,
      modifyCommodityData:{
        commodityName:"",
        commodityCategory:"",
        commodityDescription:"",
        commodityPrice:"",
        commodityStock:"",
        commodityImage:"",
      },
      rules:{
        commodityName: [
          { required: true, message: '商品名称不能为空！', trigger: 'blur' }
        ],
        commodityCategory: [
          { required: true, message: '请选择商品类别！', trigger: 'blur' }
        ],
        commodityDescription: [
          { required: true, message: '商品描述不能为空！', trigger: 'blur' }
        ],
        commodityPrice: [
          {validator: priceAndStockValidator, required: true, trigger: 'blur' }
        ],
        commodityStock: [
          { validator: priceAndStockValidator, required: true, trigger: 'blur' }
        ],
        commodityImage: [
          { message: '请上传商品图片！', required: true, trigger: 'blur' }
        ],
      },
      fileList:[],
      imgSrc:"http://localhost/common/downloadImg?fileName=",
      commodityData:[],
      commodities:[],
      pageSize:4,
      currentPage:1,
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
    filterHandler(value, row){
      return row.commodityCategory === value
    },
    modifyHandler(index){
      this.showModifyDialog = true
      let selectedCommodity = this.commodities[index]
      for (const key in selectedCommodity) {
        this.modifyCommodityData[key] = selectedCommodity[key]
      }
      this.fileList.splice(0,this.fileList.length)
      this.fileList.push({
        name:"",
        url:"http://localhost/common/downloadImg?fileName="+selectedCommodity.commodityImage
      })
    },
    beforeAvatarUpload(rawFile){
      if(rawFile.size / 1024 / 1024 > 2){
        ElMessage.error('文件大小不能超过2MB!')
        return false
      }
      return true;
    },
    handleSuccess(response,file,fileList){
      this.modifyCommodityData.commodityImage = response
      this.isUploadImg = true
    },
    handleRemove(selectFile){
      axios.delete("http://localhost/admins/removeImg?fileName="+this.modifyCommodityData.commodityImage).then(()=>{
        this.isUploadImg = false
        this.modifyCommodityData.commodityImage = ""
      })

    },
  },
  mounted() {
    axios.get("http://localhost/admins/getAllCommodity").then(res=>{
      this.commodities = res.data
      for (let i = 0; i < this.commodities.length; i++) {
        this.commodityData.push({
          rowId:i+1,
          commodityImage:this.commodities[i].commodityImage,
          commodityName:this.commodities[i].commodityName,
          commodityCategory:this.commodities[i].commodityCategory
        })
      }
    })
  }
}
</script>

<style scoped>

</style>