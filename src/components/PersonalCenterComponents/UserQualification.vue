<template>
  <div class="text-one">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <el-text class="mx-1" size="large" >
      在
    </el-text>
    <el-text class="mx-1" size="large" type="danger">
      ①患有心、脑、肺、肾等基础器官的基础性疾病或患有导致免疫功能低下或缺陷的基础性疾病、②年龄65周岁（含）以上
    </el-text>
    <br/> <br/>
    <el-text class="mx-1" size="large" >
      两项条件中满足
    </el-text>
    <el-text class="mx-1" size="large" type="danger">
      任意一个
    </el-text>
    <el-text class="mx-1" size="large" >
      或以上的用户，可以申请免挂号绿色通道预约资质。
    </el-text>
  </div>
  <div class="text-two">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <el-text class="mx-1" size="large">
      拥有该资质您可以享受：
    </el-text>
    <br/><br/>
    <el-text class="mx-1" size="large" type="primary">
      ①免挂号快速预约；②（新冠爆发期时）优先受理预约以及优先分配病房；③（新冠爆发期时）可以呼叫救护车；
    </el-text>
  </div>
  <div class="text-three">
    <el-text class="mx-1" size="large">
      您可以在下方上传文件区域上传可以证明您基础疾病或年龄的文件(可以是医院检查报告图片、身份证出生日期的图片等)
    </el-text>
  </div>
  <el-upload
      v-model:file-list="fileList"
      ref="upload"
      class="upload-demo"
      action="http://localhost/users/upload"
      multiple
      :data="extraData"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      :limit="3"
      :on-exceed="handleExceed"
      :auto-upload="false"
      :drag="true"
  >
    <template #trigger>
      <el-button type="primary"><el-icon><Upload /></el-icon>点击或拖拽文件到此处上传</el-button>
    </template>
    <template #tip>
      <div class="el-upload__tip">
        上传的jpg/png文件大小不能超过2MB
      </div>
    </template>
    <el-button type="success" @click="uploadFile" style="position:relative; left: 212px">确认上传</el-button>
  </el-upload>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "userQualification",
  data(){
    return{
      fileList:[

      ],
      extraData:{
        loginName:""
      }
    }
  },
  methods:{
    handlePreview(file){
      console.log(this.fileList)
      console.log(file.size)

    },
    handleRemove(){

    },
    beforeRemove(){

    },
    handleExceed(){

    },
    handleSuccess(){
      ElMessage.success('文件上传成功，请等待管理员审核')
    },
    beforeAvatarUpload(rawFile){
      if(rawFile.size / 1024 / 1024 > 2){
        ElMessage.error('文件大小不能超过2MB!')
        return false
      }
      return true;
    },
    uploadFile(){
      this.$refs.upload.submit()
    },

  },

  mounted() {
    this.extraData.loginName = window.localStorage.getItem('loginState')
  }
}
</script>

<style scoped>
.upload-demo{
  position: absolute;
  top: 380px;
  left: 710px;
  width: 300px;
}
.text-one{
  position: absolute;
  top: 120px;
  left: 230px;
}.text-two{
  position: absolute;
  top: 210px;
  left: 230px;
}
.text-three{
  position: absolute;
  top: 320px;
  left: 380px;
}
.mx-1{
  font-size: 18px;
}
</style>