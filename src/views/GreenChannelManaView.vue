<template>
  <el-menu
      active-text-color="#337ecc"
      default-active="1"
      background-color="#FAFCFF"
      class="el-menu-vertical-demo"
      text-color="#303133"
      @select=selectHandle
  >
    <el-menu-item index="GreenCh">
      <el-icon><Checked /></el-icon>
      <span>绿色通道预约处理</span>
    </el-menu-item>
    <el-menu-item index="vaccine">
      <el-icon><Checked /></el-icon>
      <span>疫苗预约处理</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "GreenChannelManaView",
  data(){
    return{

    }
  },
  methods:{
    selectHandle(key){

    }
  },
  mounted() {

  },
}
</script>

<style scoped>
.el-menu-vertical-demo{
  position: fixed;
  width: 200px;
  height: 700px;
}
</style>