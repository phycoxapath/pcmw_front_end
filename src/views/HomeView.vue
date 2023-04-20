<template>
<h1 style="text-align: center">欢迎访问pcmw后疫情时代特供向医疗服务网站！</h1>
</template>

<script>

import axios from "axios";

export default {
  name: 'HomeView',
  components: {

  },
  watch:{
    '$route' (to , from){
      if (window.localStorage.getItem('loginState') !== '' || window.localStorage.getItem('loginState') !== null) {
        axios.get("http://localhost/" + window.localStorage.getItem('loginRole') + "/getByName?name="+window.localStorage.getItem('loginState')).then(res => {
          window.localStorage.setItem('id', res.data.id)
        })
      }
    }
  },
  mounted() {
    if (window.localStorage.getItem('loginState') !== '' || window.localStorage.getItem('loginState') !== null) {
      axios.get("http://localhost/" + window.localStorage.getItem('loginRole') + "/getByName?name="+window.localStorage.getItem('loginState')).then(res => {
        window.localStorage.setItem('id', res.data.id)
      })
    }
  }
}
</script>
