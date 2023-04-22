<template>
  <div style="position:fixed;left: 500px;top: 200px">
    <el-popover placement="bottom" :width="500" trigger="hover" >
        <template #reference>
          <el-text style="font-size: 22px;font-weight: bolder;position:relative;bottom: 50px">{{hospName}}</el-text>
        </template>
      <div>
        <el-text style="font-weight: bolder;font-size: 20px;">{{hospName}}</el-text><br/><br/>
        <el-text style="margin: 20px;" >{{hospDescription}}</el-text>
      </div>
    </el-popover>
    <el-form :model="submitRegistry" label-width="125px" class="demo-border"
             :rules="rules"
             ref="submitRegistry"
    >
      <el-form-item label="病情简述" prop="appointAppendix" style="position: relative;right: 40px">
        <el-input style="margin-left: 25px;" type="textarea" v-model="submitRegistry.appointAppendix" rows="6" placeholder="请简要描述患者状况或症状" aria-required="true"/>
      </el-form-item>
      <el-form-item label="是否需要救护车" prop="appendix" style="position: relative;">
        <el-radio-group  v-model="isAmbulance">
          <el-radio label="是"/>
          <el-radio label="否"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址" prop="address" style="position: relative;right: 40px" v-show="isAmbulance === '是'">
        <el-input type="text" v-model="address" style="width: 350px" placeholder="请输入接诊地址（可选）" aria-required="true"/>
        <el-popover placement="top" :width="300" trigger="hover">
          <template #reference>
            <el-icon size="17px"><QuestionFilled /></el-icon>
          </template>
          <el-text style="font-weight: bold">不填则默认是个人信息中的收货地址</el-text>
        </el-popover>
      </el-form-item>
      <el-form-item style="position: relative;margin-left: 350px">
        <el-button type="primary" @click="onSubmit">提交预约</el-button>
      </el-form-item>
    </el-form>
  </div>


</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "GreenChannelRegistry",
  data(){
    return{
      hospId:this.$route.query.hospId,
      hospName:"",
      hospDescription: "",
      address:"",
      isAmbulance:"",
      submitRegistry:{
        appointAppendix:"",
      },
      appointmentDTO: {
        initiatorId:"",
        handlerId:"",
        appointType:"绿色通道",
        appointState:"待处理",
      },
      rules:{
        appointAppendix:[
          { required: true, message: '请填写病情简述！', trigger: 'blur' },
        ],
      },

    }
  },
  methods:{
    onSubmit(){
      axios("http://localhost/users/getById?id="+window.localStorage.getItem('id')).then(res=>{
        if (this.isAmbulance === '是'){
          this.appointmentDTO.appointAppendix = this.submitRegistry.appointAppendix + '(需要救护车，接诊地址为：'+(this.address === '' ? res.data.address : this.address)+')'
        }else {
          this.appointmentDTO.appointAppendix = this.submitRegistry.appointAppendix
        }
        this.appointmentDTO.initiatorId = res.data.id
        this.appointmentDTO.handlerId = this.hospId
        axios.post("http://localhost/appointments/saveAppointment",this.appointmentDTO).then(subRes=>{
          if (subRes.data === 'save success') {
            ElMessage.success("预约成功，院方将迅速处理，您可前往个人中心/我的预约查看受理响应情况")
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
        })
      })

    },
  },
  watch:{
    '$route' (to,from){
      this.hospId = this.$route.query.hospId
      this.address = ""
      this.isAmbulance = ""
      this.submitRegistry.appointAppendix = ""
      axios.get("http://localhost/hospitals/getById?id="+this.hospId).then(res=>{
        this.hospName = res.data.hospitalName
        this.hospDescription = res.data.hospitalDescription
        console.log(this.hospDescription)
      }).catch(err =>{
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
      })
    }
  },
  mounted() {
    this.hospId = this.$route.query.hospId
    axios.get("http://localhost/hospitals/getById?id="+this.hospId).then(res=>{
      this.hospName = res.data.hospitalName
      this.hospDescription = res.data.hospitalDescription
    }).catch(err =>{
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
    })
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
  background-color: #ffffff;
}
</style>