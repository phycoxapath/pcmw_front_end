<template>
  <el-descriptions
      class="margin-top"
      title="编辑信息"
      :column="1"
      size="large"
      border
  >
    <el-descriptions-item width="300"  v-for="(attr,index) in hospitalData" :key="index">
      <template #label>
        {{index}}
      </template>
      <span v-show="index !== '医院简介'">{{attr}}</span>
      <el-input v-model="newValue" :value=attr v-if="index === lineIndex && index!=='医院简介'"></el-input>
      <el-input v-model="newValue" type="textarea" rows="5" :placeholder="attr" v-if="index === lineIndex && index==='医院简介'"></el-input>
      <!--      <el-input v-model="newAge" v-if="index ==='年龄'"></el-input>-->
      <!--      <el-input v-model="newAddr" v-if="index ==='收货地址'"></el-input>-->
      <el-link style="margin-left: 7px"  :underline="false" @click="modify(index)" v-if="attr !== '' &&attr!== null && index!=='id' && index!== '是否取得资质' && index!== '资质类型' && index!==lineIndex" type="primary" color=" #ecf5ff" ><el-icon size="18px"><Edit/></el-icon></el-link>
      <el-link style="margin-left: 7px"  :underline="false" @click="modify(index)" v-else-if="index!=='id' && index!== '是否取得资质' && index!== '资质类型' && index !== lineIndex" type="primary" color=" #ecf5ff" ><el-icon size="18px"><CirclePlus /></el-icon></el-link>
      <el-button @click="save(index,newValue)" type="primary" color=" #ecf5ff" v-show="index === lineIndex">保存</el-button>
      <el-button @click="cancel" type="primary" color=" #ecf5ff" v-show="index === lineIndex">取消</el-button>
    </el-descriptions-item>
  </el-descriptions>
  <div class="transfer-style">
    <el-text size="large" style="font-size: 17px ; position:relative; left: 220px;bottom: 12px">请选择科室绑定</el-text>
    <el-transfer v-model="bindingDept" :data="data1"
                 :titles="['可选科室', '已选科室']"
                 :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
                 filterable
                 filter-placeholder="输入科室名搜索"

    >
      <template #right-footer>
        <el-button class="transfer-footer" color="#ecf5ff" size="large" @click="binding"><el-icon><Finished /></el-icon>绑定</el-button>
      </template>
      <template #left-footer>
        <el-button class="transfer-footer" color="#ecf5ff" size="large" @click="diyDialog = true"><el-icon><Finished /></el-icon>新建科室</el-button>
      </template>
      <template #default="{ option }">
        <div v-if="option.label.endsWith(')')">
          <el-tooltip  content="双击解绑" placement="left-start" effect="light">
            <span @dblclick="deBind(option)">{{ option.label }}</span>
          </el-tooltip>
        </div>
        <div v-else>
          <span>{{ option.label }}</span>
        </div>

      </template>
    </el-transfer>
  </div>
  <div>
    <el-dialog v-model="diyDialog" title="自定义科室" draggable>
      <el-input type="text" v-model="newDeptName" placeholder="请输入科室名"></el-input>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="diyDialog = false">取消</el-button>
        <el-button type="primary" @click="newDept">
          保存
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
  name: "HospitalInfoEdit",
  data(){
    return{
      id:"",
      diyDialog:false,
      newDeptName:"",
      bindingDept:[],
      submitArray:[],
      boundArray:[],
      data1:[
        {key:'外科',label:"外科",disabled:false},
        {key:'内科',label:"内科",disabled:false},
        {key:'儿科',label:"儿科",disabled:false},
        {key:'妇产科',label:"妇产科",disabled:false},
        {key:'骨科',label:"骨科",disabled:false},
        {key:'肿瘤科',label:"肿瘤科",disabled:false},
        {key:'耳鼻咽喉科',label:"耳鼻咽喉科",disabled:false},
        {key:'眼科',label:"眼科",disabled:false},
        {key:'口腔科',label:"口腔科",disabled:false},
        {key:'皮肤科',label:"皮肤科",disabled:false},
        {key:'放射科',label:"放射科",disabled:false},
        {key:'麻醉医学科',label:"麻醉医学科",disabled:false},
        {key:'中医科',label:"中医科",disabled:false},
        {key:'营养科',label:"营养科",disabled:false},
        {key:'康复科',label:"康复科",disabled:false},
      ],
      lineIndex:"",
      newValue:"",
      hospitalData:{
        id:"",
        医院名称:"",
        医院简介:"",
        是否取得资质:"",
        资质类型:""
      },
      hospital:{
        id:"",
        hospitalName:"",
        hospitalDescription:"",
      }
    }
  },
  methods :{
    modify(type,input){
      this.lineIndex = type
    },
    cancel(){
      this.lineIndex = ""
    },
    save(type,newValue){
      this.hospital.id = window.localStorage.getItem('id')
      if (type === '医院名称') {
        this.hospitalData.医院名称 = newValue
        this.hospital.hospitalName = newValue
      }
      if (type === '医院简介') {
        this.hospitalData.医院简介 = newValue
        this.hospital.hospitalDescription = newValue
      }
      axios.put("http://localhost/hospitals",this.hospital).then(res =>{
        if (res.data === 'update success'){
          ElMessage.success("保存成功")
          window.localStorage.setItem('loginState',newValue)
        }else if (res.data === 'update fail'){
          ElMessage.error("系统繁忙，保存失败，请稍后再试！")
        }else
          ElMessage.error("系统繁忙，保存失败，请稍后再试！")
      })
      this.lineIndex = ""
    },
    binding(){
      if (!this.bindingDept.length){
        ElMessage.warning("还未选择科室，请重新选择！")
      }else{
        for (let i = 0; i < this.bindingDept.length; i++) {
          this.submitArray.push({
            deptName:this.bindingDept[i],
            hospId:window.localStorage.getItem('id')
          })
        }
        console.log(this.submitArray)
        axios.post("http://localhost/hospitals/bindDept",this.submitArray).then(res=>{
          if (res.data === 'insert success'){
            ElMessage.success("绑定成功！")
            this.submitArray = []
            this.bindingDept = []
            axios.get("http://localhost/hospitals/getById?id="+window.localStorage.getItem('id')).then(res=>{
              console.log(res.data)
              this.boundArray = res.data.departments
              for (let i = 0; i < this.boundArray.length; i++) {
                for (let j = 0; j < this.data1.length; j++) {
                  if (this.boundArray[i].deptName === this.data1[j].key && !this.data1[j].disabled) {
                    this.data1[j].disabled = true
                    this.data1[j].label = this.data1[j].label+"(已绑定)"
                    break
                  }
                }
              }
            })

          }
          else if (res.data === 'insert fail'){
            ElMessage.error("系统繁忙，请稍后再试！")
          }
          else
            ElMessage.error("系统繁忙，请稍后再试！")
        })
      }
    },
    newDept(){
      this.diyDialog = false
      this.data1.push({
        key: this.newDeptName,
        label: this.newDeptName,
        disabled: false
      })
      this.newDeptName = ""
    },
    deBind(option){
      axios.delete("http://localhost/hospitals/deleteDept?deptName="+option.key+"&hospId="+this.id).then(res=>{
        if (res.data === 'delete success'){
          option.disabled = false
          option.label = option.label.substring(0,option.label.lastIndexOf('('))
        }
        else
          ElMessage.error("系统繁忙，请稍后再试！")
      })

    }
  },
  mounted() {
    this.id = window.localStorage.getItem('id')
    axios.get("http://localhost/"+window.localStorage.getItem('loginRole')+"/getByName?name="+window.localStorage.getItem('loginState')).then(res =>{
      let i = 0,j = 0;
      for (const resKey in res.data) {
        if (resKey === 'password') {
          continue;
        }
        i++;
        for (const userKey in this.hospitalData) {
          j++;
          if (i === j){
            if (res.data[resKey] === true || res.data[resKey] === false){
              this.hospitalData[userKey] = res.data[resKey] === true ? '是' : '否'
            }else {
              this.hospitalData[userKey] = res.data[resKey];
            }
            j = 0
            break;
          }
        }
        if (resKey === 'qualType')
          break;
      }
      for (const userDataKey in this.hospitalData) {
        if (this.hospitalData[userDataKey] === "" || this.hospitalData[userDataKey] === null){
          this.infoCompletion = true;
          break;
        }
      }
    })
    axios.get("http://localhost/hospitals/getById?id="+window.localStorage.getItem('id')).then(res=>{
      this.boundArray = res.data.departments
      console.log(this.boundArray)
      for (let i = 0; i < this.boundArray.length; i++) {
        console.log(this.boundArray[i].deptName)
        for (let j = 0; j < this.data1.length; j++) {
          if (this.boundArray[i].deptName === this.data1[j].key) {
            console.log(i+"+"+j)
            this.data1[j].disabled = true
            this.data1[j].label = this.data1[j].label+"(已绑定)"
            break
          }
          if (j === this.data1.length-1){
            this.data1.push({
              key: this.boundArray[i].deptName,
              label: this.boundArray[i].deptName+"(已绑定)",
              disabled: true
            })
            break
          }
        }
      }
    })

  },
}
</script>

<style scoped>
.margin-top{
  position: absolute;
  top: 200px;
  left: 250px;
}
.transfer-style{
  position: absolute;
  top: 200px;
  left: 950px;
}
.transfer-footer {
  margin-left: 15px;
  padding: 6px 5px;
  position: relative;
}
</style>