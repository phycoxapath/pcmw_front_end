<template>
  <el-form :model="submitNewVaccine" label-width="140px" class="demo-border"
           :rules="rules"
           ref="submitNewVaccine"
  >
    <el-form-item label="请选择疫苗名称：">
      <el-select @change="vaccineNameOnChange" v-model="submitNewVaccine.vaccineName" placeholder="请选择疫苗名称" style="width: 330px">
        <el-option v-for="(item,index) in vaccineOption" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="研发公司：" v-show="submitNewVaccine.vaccineName">
      <el-input disabled v-model="submitNewVaccine.prepareCompany" :model-value="companies[optionIndex]"></el-input>
    </el-form-item>
    <el-form-item label="添加疫苗详细说明：" prop="vaccineDescription">
      <el-input type="textarea" :rows="6" v-model="submitNewVaccine.vaccineDescription"></el-input>
    </el-form-item>
    <el-form-item label="设定接种价格：">
      <el-input-number :precision="2" controls-position="right" :step="5" v-model="submitNewVaccine.vaccinePrice" min="0"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "AddNewVaccine",
  data(){
    return{
      submitNewVaccine:{
        vaccineName:"",
        prepareCompany:"",
        vaccineDescription:"",
        vaccinePrice:0,
      },
      rules:{

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
          break
        }
      }
    },
    onSubmit(){
      this.$refs.submitNewVaccine.validate(isValid => {
        if (isValid){

        }
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
}
</style>