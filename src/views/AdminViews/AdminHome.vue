<template>
<h1>admin home</h1>
  <h2>{{$store.state.jwt}}</h2>
</template>

<script>
import store from '../../store'
export default {
  name: "AdminHome",
  data(){
    return{

    }
  },
  mounted() {
    console.log(store.state.jwt)
  }
}
</script>

<style scoped>

</style>