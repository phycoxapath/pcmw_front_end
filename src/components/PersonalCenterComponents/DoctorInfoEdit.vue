<template>
  <el-descriptions
      class="margin-top"
      title="编辑基本信息"
      :column="1"
      size="large"
      border
  >
    <el-descriptions-item width="300"  v-for="(attr,index) in docBasicData" :key="index">
      <template #label>
        {{index}}
      </template>
      {{attr}}<el-input v-model="newValue" :value=attr v-if="index === lineIndex && index!=='性别'"></el-input>

      <el-radio-group v-if="index === '性别' &&index === lineIndex" v-model="newGender">
        <el-radio label="男" size="large">男</el-radio>
        <el-radio label="女" size="large">女</el-radio>
      </el-radio-group>
      <el-button @click="modify(index)" v-if="attr !== '' &&attr!== null && index !=='id' && index !=='工号'&& index!== '是否取得资质' && index!== '资质类型' && index!==lineIndex" type="primary" color=" #ecf5ff" ><el-icon><Edit/></el-icon>修改</el-button>
      <el-button @click="modify(index)" v-else-if="index!=='id' && index!== '是否取得资质' && index !=='工号' && index!== '资质类型' && index !== lineIndex" type="primary" color=" #ecf5ff" ><el-icon><Edit/></el-icon>添加</el-button>
      <el-button @click="save(index,newValue)" type="primary" color=" #ecf5ff" v-show="index === lineIndex">保存</el-button>
      <el-button @click="cancel" type="primary" color=" #ecf5ff" v-show="index === lineIndex">取消</el-button>
    </el-descriptions-item>
  </el-descriptions>
  <div class="deptSelector">
    <p>请选择并绑定您的科室</p>
    <el-cascader v-model="department" :options="deptProps"  />
    <el-button type="primary" color=" #ecf5ff" @click="deptSave">保存</el-button>
  </div>
  <div>
    <el-table :header-cell-style="{background:'#F5F7FA'}" :data="weeks" height="100" stripe border style="width: 39%;position:absolute;left: 550px;top: 480px;background-color: #FAFAFA"
    :row-style="{height:80}"
    >
      <el-table-column prop="Mon" label="星期一" width="80" />
      <el-table-column prop="Tues" label="星期二" width="80" />
      <el-table-column prop="Wed" label="星期三" width="80" />
      <el-table-column prop="Thur" label="星期四" width="80" />
      <el-table-column prop="Fri" label="星期五" width="80" />
      <el-table-column prop="Sat" label="星期六" width="80" />
      <el-table-column prop="Sun" label="星期日" width="80" />

    </el-table>
  </div>

</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "DoctorInfoEdit",
  data(){
    return{
      department:[],
      deptProps:[],
      weeks:[{Mon:"1"}],
      newGender:"",
      lineIndex:"",
      newValue:"",
      docBasicData:{
        id:"",
        工号:"",
        姓名:"",
        性别:"",
        是否取得资质:"",
        资质类型:""
      },
      docSubmitData:{
        id:"",
        jobId:"",
        docName:"",
        gender:"",
        workingDay:"",
        deptId:"",
        qualification:"",
        qualType:""
      }
    }
  },
  methods:{
    modify(type,input){
      this.lineIndex = type
    },
    cancel(){
      this.lineIndex = ""
    },
    save(type,newValue){
      this.docSubmitData.id = window.localStorage.getItem('id')
      this.docSubmitData.jobId = this.docBasicData.工号
      if (type === '姓名'){
        this.docBasicData.姓名 = newValue
        this.docSubmitData.docName = newValue
      }
      if (type === '性别'){
        this.docBasicData.性别 = this.newGender
        this.docSubmitData.gender = this.newGender
      }
      console.log(this.docSubmitData)
      axios.put("http://localhost/doctors",this.docSubmitData).then(res =>{
        if (res.data === 'update success'){
          ElMessage.success("保存成功")
          // for (const key in this.docSubmitData) {
          //   if (this.docSubmitData[key] !== '' || this.docSubmitData[key] !== null)
          //     this.docSubmitData[key] = ""
          // }
        }else if (res.data === 'update fail'){
          ElMessage.error("系统繁忙，保存失败，请稍后再试！")
        }else
          ElMessage.error("系统繁忙，保存失败，请稍后再试！")
      })
      this.lineIndex = ""
    },
    deptSave(){
      this.docSubmitData.id = window.localStorage.getItem('id')
      this.docSubmitData.deptId = this.department[1]
      axios.put("http://localhost/doctors",this.docSubmitData).then(res=> {
        if (res.data === 'update success'){
          ElMessage.success("保存成功")

        }else if (res.data === 'update fail'){
          ElMessage.error("系统繁忙，保存失败，请稍后再试！")
        }else
          ElMessage.error("系统繁忙，保存失败，请稍后再试！")
      })

    }
  },
  mounted() {
    axios.get("http://localhost/doctors/getById?id="+window.localStorage.getItem('id')).then(res=>{
      let i = 0,j = 0;
      //跳过展示密码，并将其他属性对齐
      for (const resKey in res.data) {
        if (resKey === 'password') {
          continue;
        }
        if (resKey === 'deptName') {
          continue;
        }
        if (resKey === 'workingDay') {
          continue;
        }
        i++;
        for (const userKey in this.docBasicData) {
          j++;
          if (i === j){
            console.log(userKey+"+"+resKey)
            this.docBasicData[userKey] = res.data[resKey];
            j = 0
            break;
          }
        }
        if (resKey === 'qualType')
          break;
      }
    })
    axios.get("http://localhost/hospitals/getAllHospital").then(res=>{

      for (let i = 0; i < res.data.length; i++) {
        this.deptProps.push({
          value:res.data[i].hospitalName,
          label:res.data[i].hospitalName,
          children:[]
        })
        for (let j = 0; j < res.data[i].departments.length; j++) {
          this.deptProps[i].children.push({
            value:res.data[i].departments[j].id,
            label:res.data[i].departments[j].deptName,
        })
        }
      }
    })
  }
}
</script>

<style scoped>
.margin-top{
  position: absolute;
  top: 20%;
  left: 15%;
}
.deptSelector{
  position: absolute;
  top: 20%;
  left: 60%;
}
</style>