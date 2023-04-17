<template>
  <div class="text-four" v-show="loginRole === 'hospitals'">
    <el-text class="mx-1" size="large" style="font-size: 18px;">
      请在下方上传能够证明机构资质的文件，您的机构经管理员审批通过后方可上线入驻
    </el-text>
  </div>
  <div class="text-five" v-show="loginRole === 'doctors'">
    <el-text class="mx-1" size="large" style="font-size: 18px;">
      请在下方上传能够证明您在医院从业的文件，经院方审批通过后您即可受理预约和线上问诊
    </el-text>
  </div>
  <div class="text-one" v-show="loginRole === 'users'">
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
  <div class="text-two" v-show="loginRole === 'users'">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <el-text class="mx-1" size="large">
      拥有该资质您可以享受：
    </el-text>
    <br/><br/>
    <el-text class="mx-1" size="large" type="primary">
      ①免挂号快速预约；②（新冠爆发期时）优先受理预约以及优先分配病房；③（新冠爆发期时）可以呼叫救护车；
    </el-text>
  </div>
  <div class="text-three" v-show="loginRole === 'users'">
    <el-text class="mx-1" size="large">
      您可以在下方上传文件区域上传可以证明您基础疾病或年龄的文件(可以是医院检查报告图片、身份证出生日期的图片等)
    </el-text>
  </div>
  <el-upload
      v-model:file-list="fileList"
      ref="upload"
      class="upload-demo"
      :action="requestURL"
      multiple
      :data="extraData"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :before-upload="beforeAvatarUpload"
      :limit="1"
      :auto-upload="false"
      :drag="true"
      :disabled="fileList.length !== 0 && applyState !== '被驳回'"
  >
    <template #trigger>
      <el-button type="primary" @click="isUpload"><el-icon><Upload /></el-icon>点击或拖拽文件到此处上传</el-button>
    </template>
    <template #tip>
      <div class="el-upload__tip">
        上传的jpg/png文件大小不能超过2MB
      </div>
    </template>
    <el-button type="success" @click="uploadFile" style="position:relative;left: 212px">确认上传</el-button>
  </el-upload>
  <div style="position:absolute;top: 494px;left: 710px;">
    <el-button type="warning" @click="handleStateQuery">查询审核状态</el-button>
  </div>

  <el-dialog v-model="examineText" title="审核状态" draggable>
    <el-text >您目前的资质审核状态是：</el-text>
    <el-text :type=textType >{{applyState}}</el-text>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="examineText = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="imgEchoDialog" title="文件预览" draggable>
    <el-image v-for="src in imageSrc" :src="src" :preview-src-list="imagePreview"></el-image>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="imgEchoDialog = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {ElMessage} from "element-plus";
import axios from "axios";

export default {
  name: "userQualification",
  data(){
    return{
      textType:"",
      applyState:"",
      examineText:false,
      imageSrc:[],
      imagePreview:[],
      fileName:"",
      imgEchoDialog:false,
      loginRole:"",
      requestURL:"",
      fileList:[

      ],
      extraData:{
        id:""
      },
      applyData:{
        applyType:"",
        initiatorId:"",
        handlerId:"",
        applyState:"审核中",
        applyImage:"",
      },
    }
  },
  methods:{
    handleStateQuery(){
      axios.get("http://localhost/apply/getByInitiatorId?id="+window.localStorage.getItem('id')+"&role="+window.localStorage.getItem('loginRole')).then(res=>{
        console.log(res.data)
        this.applyState = res.data[res.data.length-1].applyState
        this.textType = this.applyState === '审核中' ? 'warning' : (this.applyState === '已通过' ? 'success' : 'danger')
      })
      this.examineText = true
    },
    handlePreview(file){
      console.log(file)
      this.imageSrc.splice(0,this.imageSrc.length)
      this.imagePreview.splice(0,this.imageSrc.length)
      let src = 'http://localhost/common/downloadImg?fileName='+this.fileName+"&role="+window.localStorage.getItem('loginRole')
      this.imageSrc.push(src)
      this.imagePreview.push(src)
      this.imgEchoDialog = true
    },

    handleSuccess(response,file,fileList){
      ElMessage.success('文件上传成功，请等待管理员审核')
      this.fileName = response
      this.applyData.applyImage = response
      axios.post("http://localhost/apply/save",this.applyData).then(res=>{
        if (res.data === 'insert fail'){
          ElMessage.error("系统繁忙，请稍后再试！")
        }
      })
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
    isUpload(){
      if (this.fileList.length !== 0 && this.applyState === '审核中'){
        ElMessage.warning("您已经上传过认证文件了！文件正在审核中，请勿重复上传！")
      }
      else if (this.applyState === '已通过'){
        ElMessage.success("恭喜您已经通过资质审核！")
      }
      else if (this.applyState === '被驳回'){
        this.fileList.pop()
      }
    }
  },

  mounted() {
    this.extraData.id = window.localStorage.getItem('id')
    this.loginRole = window.localStorage.getItem('loginRole')
    this.requestURL = "http://localhost/"+this.loginRole+"/upload"
    axios.get("http://localhost/"+this.loginRole+"/getById?id="+this.extraData.id).then(res=>{
      //页面加载完成后读取并展示已上传资质认证文件
      if (res.data.qualImage !== null && res.data.qualImage !== '') {
        this.fileName = res.data.qualImage
        let originFileName = res.data.qualImage.substring(res.data.qualImage.lastIndexOf('/')+37)
        this.fileList.push({
          name: originFileName,
          url: ""
        })
      }
      //简单封装一些基本的数据到applyData中
      if (this.loginRole === 'doctors'){
        this.applyData.handlerId = res.data.hospId
        this.applyData.applyType = '从业资格认证申请'
        this.applyData.initiatorId = this.extraData.id
      }else if (this.loginRole === 'users'){
        this.applyData.applyType = '免挂号绿色通道预约资质申请'
        this.applyData.initiatorId = this.extraData.id
        //admin id
      }else if (this.loginRole === 'hospitals'){
        this.applyData.applyType = '机构资质认证申请'
        this.applyData.initiatorId = this.extraData.id
        //admin id
      }
    })
    axios.get("http://localhost/apply/getByInitiatorId?id="+window.localStorage.getItem('id')+"&role="+window.localStorage.getItem('loginRole')).then(res=>{
      this.applyState = res.data[res.data.length-1].applyState
      this.textType = this.applyState === '审核中' ? 'warning' : (this.applyState === '已通过' ? 'success' : 'danger')
    })


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
.text-four{
  position: absolute;
  top: 40%;
  left: 35%;
}
.text-five{
  position: absolute;
  top: 40%;
  left: 35%;
}
.mx-1{
  font-size: 18px;
}
</style>