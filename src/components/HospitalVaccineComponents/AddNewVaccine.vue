<template>
  <el-form :model="submitNewVaccine" label-width="150px" class="demo-border"
           :rules="rules"
           ref="submitNewVaccine"
  >
    <el-form-item label="请选择疫苗名称：" prop="vaccineName">
      <el-select allow-create filterable @change="vaccineNameOnChange" v-model="submitNewVaccine.vaccineName" placeholder="选择疫苗名称或输入疫苗名称新建" style="width: 330px">
        <el-option v-for="(item,index) in vaccineOption" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="研发公司：" v-show="submitNewVaccine.vaccineName" prop="prepareCompany">
      <el-input :disabled="optionIndex >= 0" placeholder="请输入研发公司" v-model="submitNewVaccine.prepareCompany" ></el-input>
    </el-form-item>
    <el-form-item label="添加疫苗详细说明：" prop="vaccineDescription">
      <el-input type="textarea" :rows="6" v-model="submitNewVaccine.vaccineDescription"></el-input>
    </el-form-item>
    <el-form-item label="选择每周接种时间：" prop="vaccinateDay">
      <el-checkbox-group v-model="vaccinateDay" >
        <el-checkbox-button label="周一"/>
        <el-checkbox-button label="周二"/>
        <el-checkbox-button label="周三"/>
        <el-checkbox-button label="周四"/>
        <el-checkbox-button label="周五"/>
        <el-checkbox-button label="周六"/>
        <el-checkbox-button label="周日"/>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="设定接种价格：">
      <el-input-number :precision="2" controls-position="right" :step="5" v-model="submitNewVaccine.vaccinePrice" min="0"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" style="margin-left: 400px">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "AddNewVaccine",
  data(){
    return{
      vaccinateDay:[],
      submitNewVaccine:{
        vaccineName:"",
        prepareCompany:"",
        vaccineDescription:"",
        vaccinateDay:0,
        vaccinePrice:0,
        hospId:"",
      },
      rules:{
        vaccineDescription:[
          { required: true, message: '请输入疫苗详细说明！', trigger: 'blur' },
        ],
        vaccineName:[
          { required: true, message: '请选择疫苗名称！', trigger: 'blur' },
        ],
        vaccinateDay:[
          { required: true, message: '请选择疫苗名称！', trigger: 'blur' },
        ],
        prepareCompany:[
          { required: true, message: '请输入研发公司名称！', trigger: 'blur' }
        ]
      },
      vaccineOption:[
        {label:"克尔来福（CoronaVac）",value:"克尔来福（CoronaVac）"},
        {label:"新型冠状病毒肺炎灭活疫苗（Vero 细胞）",value:"新型冠状病毒肺炎灭活疫苗（Vero 细胞）"},
        {label:"科维福新型冠状病毒灭活疫苗",value:"科维福新型冠状病毒灭活疫苗"},
        {label:"重组新型冠状病毒疫苗（CHO细胞）",value:"重组新型冠状病毒疫苗（CHO细胞）"},
        {label:"重组新型冠状病毒疫苗（腺病毒载体）（Ad5-nCoV）",value:"重组新型冠状病毒疫苗（腺病毒载体）（Ad5-nCoV）"},
      ],
      optionIndex:-1,
      companies:["北京科兴中维生物技术有限公司","国药集团中国生物北京生物制品研究所","中国医学科学院医学生物学研究所","中国科学院微生物研究所","中国人民解放军军事科学院军事医学研究院"]
    }
  },
  methods:{
    vaccineNameOnChange(val){
      for (let i = 0; i < this.vaccineOption.length; i++) {
        if (val === this.vaccineOption[i].label){
          this.optionIndex = i
          this.submitNewVaccine.prepareCompany = this.companies[i]
          break
        }
        if (i === this.vaccineOption.length-1) {
          this.optionIndex = -1
        }
      }
    },
    onSubmit(){
      if (this.vaccinateDay.length === 0){
        ElMessage.error("请绑定至少一天为接种时间！")
        return
      }
      axios.get("http://localhost/vaccines/getByHospId?hospId="+window.localStorage.getItem('id')).then(queryRes=>{
        for (let i = 0; i < queryRes.data.length; i++) {
          if (this.submitNewVaccine.vaccineName === queryRes.data[i].vaccineName){
            ElMessage.error("请不要重复添加相同疫苗！")
            return
          }
        }
        this.$refs.submitNewVaccine.validate(isValid => {
          if (isValid){
            for (let i = 0; i < this.vaccinateDay.length; i++) {
              switch (this.vaccinateDay[i]){
                case '周一':{
                  this.submitNewVaccine.vaccinateDay |= 64
                  break
                }
                case '周二':{
                  this.submitNewVaccine.vaccinateDay |= 32
                  break
                }
                case '周三':{
                  this.submitNewVaccine.vaccinateDay |= 16
                  break
                }
                case '周四':{
                  this.submitNewVaccine.vaccinateDay |= 8
                  break
                }
                case '周五':{
                  this.submitNewVaccine.vaccinateDay |= 4
                  break
                }
                case '周六':{
                  this.submitNewVaccine.vaccinateDay |= 2
                  break
                }
                case '周日':{
                  this.submitNewVaccine.vaccinateDay |= 1
                  break
                }
              }
            }
            this.submitNewVaccine.hospId = window.localStorage.getItem('id')
            axios.post("http://localhost/vaccines/saveVaccine",this.submitNewVaccine).then(res=>{
              if (res.data === 'save success'){
                ElMessage.success("新增成功！")
                this.submitNewVaccine.vaccineName = ''
                this.submitNewVaccine.vaccineDescription = ''
                this.submitNewVaccine.vaccinePrice = 0
                this.vaccinateDay.splice(0,this.vaccinateDay.length)
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
          }
        })
      })

    },

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
  margin-top: 100px;
}
</style>