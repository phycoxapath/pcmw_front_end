<template>
  <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      action="http://localhost/users/upload"
      multiple
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="3"
      :on-exceed="handleExceed"
      :auto-upload="true"
      :drag="true"
  >
    <el-button type="primary">Click to upload</el-button>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500KB.
      </div>
    </template>
  </el-upload>
</template>

<script>
export default {
  name: "userQualification",
  data(){
    return{
      fileList:[

      ]
    }
  },
  methods:{
    handlePreview(){

    },
    handleRemove(){

    },
    beforeRemove(){

    },
    handleExceed(){

    },
  }
}
</script>

<style scoped>
.upload-demo{
  position: absolute;
  top: 300px;
  left: 750px;
}

</style>