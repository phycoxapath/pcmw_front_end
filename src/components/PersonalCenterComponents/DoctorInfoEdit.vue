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
      <span v-show="index !== '医生简介'">{{attr}}</span>
      <el-input v-model="newValue" :value="attr" v-if="index === lineIndex && index!=='性别' && index!=='医生简介'  " ></el-input>
      <el-input v-model="newValue" type="textarea" :placeholder="attr" v-if="index === lineIndex && index==='医生简介'"></el-input>
      <el-radio-group v-if="index === '性别' &&index === lineIndex" v-model="newGender">
        <el-radio label="男" size="large">男</el-radio>
        <el-radio label="女" size="large">女</el-radio>
      </el-radio-group>
      <el-link style="margin-left: 7px"  :underline="false" @click="modify(index)" v-if="attr !== '' &&attr!== null && index !=='id' && index !=='工号'&& index!== '是否取得资质' && index!== '资质类型' && index!==lineIndex" type="primary" color=" #ecf5ff" ><el-icon size="18px"><Edit/></el-icon></el-link>
      <el-link style="margin-left: 7px"  :underline="false" @click="modify(index)" v-else-if="index!=='id' && index!== '是否取得资质' && index !=='工号' && index!== '资质类型' && index !== lineIndex" type="primary" color=" #ecf5ff" ><el-icon size="18px"><CirclePlus/></el-icon></el-link>
      <el-button @click="save(index,newValue)" type="primary" color=" #ecf5ff" v-show="index === lineIndex">保存</el-button>
      <el-button @click="cancel" type="primary" color=" #ecf5ff" v-show="index === lineIndex">取消</el-button>
    </el-descriptions-item>
  </el-descriptions>
  <div class="deptSelector">
    <p>请选择并绑定您的科室</p>
    <el-cascader v-model="department" :options="deptProps" clearable />&nbsp;
    <el-button type="primary" color=" #ecf5ff" @click="deptSave">保存</el-button>
  </div>

  <div>
    <p style="position:absolute; left: 60%;top: 48%">请选择您的工作日(单击选择/取消) <el-button type="primary" color=" #ecf5ff" @click="workingDaySave">保存</el-button></p>
    <el-table :header-cell-style="{background:'#F5F7FA',textAlign:'center'}" :data="weeks" height="88" stripe border style="width: 561px;position:absolute;left: 60%;top: 54%;background-color: #FAFAFA"
    :row-style="{height:80}" :cell-class-name="tableCellClassName" @cell-click="clickHandler"
    >
      <el-table-column prop="1" label="星期一" width="80" >
        <template #default="scope">
          <div style="display: flex; align-items: center" v-show="weekShow[scope.column.property]">
            <el-tooltip  content="单击选择/取消" placement="bottom-end" effect="light">
              <el-icon size="30px" color="#95d475" style="position: relative;left: 28%"><Select /></el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="2" label="星期二" width="80" >
        <template #default="scope">
          <div style="display: flex; align-items: center" v-show="weekShow[scope.column.property]">
            <el-tooltip  content="单击选择/取消" placement="bottom-end" effect="light">
              <el-icon size="30px" color="#95d475" style="position: relative;left: 28%"><Select /></el-icon>
            </el-tooltip>

          </div>
        </template>
      </el-table-column>
      <el-table-column prop="3" label="星期三" width="80" >
        <template #default="scope">
          <div style="display: flex; align-items: center" v-show="weekShow[scope.column.property]">
            <el-tooltip  content="单击选择/取消" placement="bottom-end" effect="light">
              <el-icon size="30px" color="#95d475" style="position: relative;left: 28%"><Select /></el-icon>
            </el-tooltip>

          </div>
        </template>
      </el-table-column>
      <el-table-column prop="4" label="星期四" width="80" >
        <template #default="scope">
          <div style="display: flex; align-items: center" v-show="weekShow[scope.column.property]">
            <el-tooltip  content="单击选择/取消" placement="bottom-end" effect="light">
              <el-icon size="30px" color="#95d475" style="position: relative;left: 28%"><Select /></el-icon>
            </el-tooltip>

          </div>
        </template>
      </el-table-column>
      <el-table-column prop="5" label="星期五" width="80" >
        <template #default="scope">
          <div style="display: flex; align-items: center" v-show="weekShow[scope.column.property]">
            <el-tooltip  content="单击选择/取消" placement="bottom-end" effect="light">
              <el-icon size="30px" color="#95d475" style="position: relative;left: 28%"><Select /></el-icon>
            </el-tooltip>

          </div>
        </template>
      </el-table-column>
      <el-table-column prop="6" label="星期六" width="80" >
        <template #default="scope">
          <div style="display: flex; align-items: center" v-show="weekShow[scope.column.property]">
            <el-tooltip  content="单击选择/取消" placement="bottom-end" effect="light">
              <el-icon size="30px" color="#95d475" style="position: relative;left: 28%"><Select /></el-icon>
            </el-tooltip>

          </div>
        </template>
      </el-table-column>
      <el-table-column prop="7" label="星期日" width="80" >
        <template #default="scope">
          <div style="display: flex; align-items: center" v-show="weekShow[scope.column.property]">
            <el-tooltip  content="单击选择/取消" placement="bottom-end" effect="light">
              <el-icon size="30px" color="#95d475" style="position: relative;left: 28%"><Select /></el-icon>
            </el-tooltip>

          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>
    <div>
      <el-dialog title="重要提示" v-model="rebindDialog" draggable>
        <el-text type="danger" size="large">您已上传资质认证，重新绑定科室将需要重新上传认证，您确定要这么做吗？</el-text>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="danger" @click="confirmReBind">确定</el-button>
            <el-button type="success" @click="rebindDialog = false ">
              取消
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>

</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "DoctorInfoEdit",
  data(){
    return{
      applyState: "",
      isReBind:false,
      rebindDialog:false,
      department:[],
      deptProps:[],
      weeks:[""],
      weekShow:["",false,false,false,false,false,false,false],
      newGender:"",
      lineIndex:"",
      newValue:"",
      docBasicData:{
        id:"",
        工号:"",
        姓名:"",
        性别:"",
        医生简介:"",
        是否取得资质:"",
        资质类型:""
      },
      docSubmitData:{
        id:"",
        jobId:"",
        docName:"",
        gender:"",
        workingDay:"",
        docProfile:"",
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
      if (type === '医生简介'){
        this.docBasicData.医生简介 = this.newValue
        this.docSubmitData.docProfile = this.newValue
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
      if (this.department.length < 2){
        ElMessage.error("还未选择科室！")
        return
      }

      if (this.isReBind){
        this.rebindDialog = true
        return false
      }
      if (this.docBasicData.是否取得资质 === '是' || this.applyState === '审核中'){
        this.rebindDialog = true
        return
      }
        this.docSubmitData.id = window.localStorage.getItem('id')
        this.docSubmitData.deptId = this.department[1]
        axios.put("http://localhost/doctors", this.docSubmitData).then(res => {
          if (res.data === 'update success') {
            ElMessage.success("保存成功")

          } else if (res.data === 'update fail') {
            ElMessage.error("系统繁忙，保存失败，请稍后再试！")
          } else
            ElMessage.error("系统繁忙，保存失败，请稍后再试！")
        })


    },
    tableCellClassName({row, column, rowIndex, columnIndex}){

    },
    clickHandler(row, column, cell, event){
      if (!this.weekShow[column.property]){
        this.weekShow[column.property] = true
        this.docSubmitData.workingDay |= 2**(7-column.property)
        console.log(this.docSubmitData.workingDay.toString(2))
        return
      }
      if (this.weekShow[column.property]){
        this.weekShow[column.property] = false
        this.docSubmitData.workingDay &= ~(2**(7-column.property))
        console.log(this.docSubmitData.workingDay.toString(2))
        return;
      }
    },
    workingDaySave(){
      if (this.docSubmitData.workingDay === 0){
        ElMessage.error("你总得上一天班吧？")
      }else {
        axios.put("http://localhost/doctors",this.docSubmitData).then(res=>{
          if (res.data === 'update success'){
            ElMessage.success("保存成功")

          }else if (res.data === 'update fail'){
            ElMessage.error("系统繁忙，保存失败，请稍后再试！")
          }else
            ElMessage.error("系统繁忙，保存失败，请稍后再试！")
        })

      }
    },
    confirmReBind(){
      this.isReBind = false
      this.rebindDialog = false
      this.docSubmitData.id = window.localStorage.getItem('id')
      this.docSubmitData.deptId = this.department[1]
      axios.put("http://localhost/doctors", this.docSubmitData).then(res => {
        if (res.data === 'update success') {
          ElMessage.success("保存成功")

        } else if (res.data === 'update fail') {
          ElMessage.error("系统繁忙，保存失败，请稍后再试！")
        } else
          ElMessage.error("系统繁忙，保存失败，请稍后再试！")
      })
      axios.put("http://localhost/hospitals/updateDocQual?docId="+this.docBasicData.id+"&qualification=false").then(res=>{
        if (res.data !== 'update success')
          ElMessage.error("系统繁忙，请稍后再试")
      })
      axios.get("http://localhost/apply/getByInitiatorId/?id="+window.localStorage.getItem('id')+"&role=doctors").then(res=>{
        let applyId = res.data[res.data.length-1].id
        let applyDTO = {
          id:applyId,
          applyState:'被驳回'
        }
        axios.put("http://localhost/apply/update",applyDTO)
      })



    },


  },
  mounted() {
    this.docSubmitData.id = window.localStorage.getItem('id')
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
          this.docSubmitData.workingDay = res.data[resKey]
          let i = 64 ,j=1;
          while (i > 0){
            this.weekShow[j] = (i & res.data[resKey]) > 0
            j++;
            i = i/2;
          }
          continue;
        }
        i++;
        for (const userKey in this.docBasicData) {
          j++;
          if (i === j){
            console.log(userKey+"+"+resKey)
            if (res.data[resKey] === true || res.data[resKey] === false){
              this.docBasicData[userKey] = res.data[resKey] === true ? '是' : '否'
            }else {
              this.docBasicData[userKey] = res.data[resKey];
            }
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
    axios.get("http://localhost/apply/getByInitiatorId/?id="+window.localStorage.getItem('id')+"&role=doctors").then(res=>{
      this.applyState = res.data[res.data.length-1].applyState
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