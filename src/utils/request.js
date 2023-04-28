import axios from 'axios'
import store from '../store'

const instance = axios.create({
    timeout:5000
})

instance.interceptors.request.use(
    config=>{
        return config
    },
    error => {
        Promise.reject(error)
    }
)
instance.interceptors.response.use(
    response=>{
        console.log(response.headers['authorization'])
        if (response.headers['authorization']) {
            console.log("in")
            store.commit('setJwt', response.headers['authorization'])
        }
        return response.status === 200 ? Promise.resolve(response) : Promise.reject(response)
    },
    error=>{

    }
)
export default instance