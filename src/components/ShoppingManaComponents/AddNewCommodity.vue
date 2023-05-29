<template>
  <el-form :model="newCommodityData" label-width="100px" class="demo-border"
           :rules="rules"
           ref="newCommodityData"
  >
    <el-form-item label="商品名称" prop="commodityName">
      <el-input placeholder="商品名称" v-model="newCommodityData.commodityName"></el-input>
    </el-form-item>
    <el-form-item label="商品类别" prop="commodityCategory">
      <el-select allow-create filterable v-model="newCommodityData.commodityCategory">
        <el-option label="抗疫药品" value="抗疫药品"></el-option>
        <el-option label="防疫日用品" value="防疫日用品"></el-option>
        <el-option label="感染自检用品" value="感染自检用品"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商品描述" prop="commodityDescription">
      <el-input type="textarea" rows="5" placeholder="添加商品描述" v-model="newCommodityData.commodityDescription"></el-input>
    </el-form-item>
    <el-form-item label="商品价格" prop="commodityPrice">
      <el-input-number :precision="2" controls-position="right" :step="5" min="0" v-model="newCommodityData.commodityPrice"></el-input-number>
    </el-form-item>
    <el-form-item label="商品库存" prop="commodityStock">
      <el-input-number  controls-position="right" :step="100" min="0" max="9999" v-model="newCommodityData.commodityStock"></el-input-number>
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
      <el-button  type="primary" @click="onSubmit">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {ElMessage} from "element-plus";
import axios from "../../utils/request";

export default {
  name: "AddNewCommodity",
  data(){
    var priceAndStockValidator = (rule, value, callback) =>{
      if (value === 0){
        callback(new Error("价格和库存不能为0！"));
      }else
        callback();
    }
    return{
      isUploadImg:false,
      imageUrl:"",
      fileList:[

      ],
      newCommodityData:{
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
      }
    }
  },
  methods:{
    beforeAvatarUpload(rawFile){
      if(rawFile.size / 1024 / 1024 > 2){
        ElMessage.error('文件大小不能超过2MB!')
        return false
      }
      return true;
    },
    handleSuccess(response,file,fileList){
      this.newCommodityData.commodityImage = response
      this.imageUrl = "http://localhost/common/downloadImg?fileName="+response
      this.isUploadImg = true
    },
    handleRemove(selectFile){
      axios.delete("http://localhost/admins/removeImg?fileName="+this.newCommodityData.commodityImage).then(()=>{
        this.isUploadImg = false
        this.newCommodityData.commodityImage = ""
        this.imageUrl = ""
      })

    },
    onSubmit(){
      this.$refs.newCommodityData.validate( isValid => {
        if (isValid){
          axios.post("http://localhost/admins/saveCommodity",this.newCommodityData).then(res=>{
            if (res.data === "save success"){
              ElMessage.success("新增商品成功！")
              for (const key in this.newCommodityData) {
                this.newCommodityData[key] = ""
              }
              this.isUploadImg = false
              this.imageUrl = ""
              this.fileList.splice(0,this.fileList.length)
            }
          })
        }
      })
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.demo-border{
  border-top: 2px solid var(--el-border-color);
  border-bottom: 2px solid var(--el-border-color);
  border-left: 2px solid var(--el-border-color);;
  border-right: 2px solid var(--el-border-color);;
  border-radius: 20px;
  width: 600px;
  padding: 25px;
  background-color: #FAFAFA;
  position: fixed;
  margin-left: 500px;
  margin-top: 50px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>
<style>
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.avatar-uploader .el-upload {
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
</style>