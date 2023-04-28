import { createStore } from 'vuex'

export default createStore({
  state: {
    jwt:null
  },
  getters: {
  },
  mutations: {
    setJwt(state,jwt){
      state.jwt = jwt
    }
  },
  actions: {
  },
  modules: {
  }
})
