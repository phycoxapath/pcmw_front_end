<template>
  <div  v-show="show">
    <el-menu
      active-text-color="#337ecc"
      background-color="#FAFCFF"
      class="el-menu-vertical-demo"
      text-color="#303133"
      @open="handleOpen"
      @close="handleClose"
  >

    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>预约挂号</span>
      </template>
      <el-menu-item-group title="入驻医院">

        <el-sub-menu index="1-1" >
          <template #title>医院1</template>
          <el-menu-item index="1-1-1">科室1</el-menu-item>
          <el-menu-item index="1-1-2">科室2</el-menu-item>
          <el-menu-item index="1-1-3">科室3</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="1-2" >
          <template #title>医院2</template>
          <el-menu-item index="1-2-1">科室1</el-menu-item>
          <el-menu-item index="1-2-2">科室2</el-menu-item>
          <el-menu-item index="1-2-3">科室3</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="1-3" >
          <template #title>医院3</template>
          <el-menu-item index="1-3-1">科室1</el-menu-item>
          <el-menu-item index="1-3-2">科室2</el-menu-item>
          <el-menu-item index="1-3-3">科室3</el-menu-item>
        </el-sub-menu>


      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><location /></el-icon>
        <span>重症绿色挂号通道</span>
      </template>
      <el-menu-item-group title="Group One">
        <el-menu-item index="1-1" >item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
  </div>
    <el-dialog
        v-model="loginPrompt"
        title=""
        width="30%"
        align-center
        :before-close="closeRedirect"
    >
      <span>您还未登录，请先登录!</span>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onCLick">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>



</template>

<script>
export default {
  name: "MedicalService",
  data(){
    return{
      loginState:"",
      show:false,
      loginPrompt:false,
    }
  },
  methods:{
    onCLick(){
      this.$router.push('/login')
    },
    closeRedirect(done){
      this.$router.push('/login')
    }
  },
  mounted() {

    if (!window.localStorage.getItem('loginState')){
      this.loginPrompt = true
      //this.$router.push('/login')
    }else {
      this.show = true
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo{
  width: 200px;
  height: 700px;
}
</style>