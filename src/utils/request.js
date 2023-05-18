import axios from 'axios'
import {ElMessage} from "element-plus";

const instance = axios.create({
    timeout:5000,
    headers:{
        Authorization:window.localStorage.getItem('jwt')
    }
})
const errorHandler = (status,info)=>{
    switch (status){
        case 400:{
            console.log('请求语法错误，请检查url或json格式')
            break
        }
        case 401:{
            ElMessage.error("Token认证失败！请重新登录")
            window.localStorage.removeItem('loginState')
            window.localStorage.removeItem('loginRole')
            window.localStorage.removeItem('jwt')
            setTimeout(()=>{
                window.location.href = "http://localhost:8080/#/administratorLogin"
            },1200)
            break
        }
        case 403:{
            ElMessage.error("非法访问！")
            break
        }
        case 404:{
            ElMessage.error("未找到请求的资源！")
            break
        }
        case 500:{
            ElMessage.error("服务器内部错误！")
            break
        }
        default:
            console.log(info)
            break
    }
}
instance.interceptors.request.use(
    config=>{
        config.headers['Authorization'] = window.localStorage.getItem('jwt')
        return config
    },
    error => {
        Promise.reject(error)
    }
)
instance.interceptors.response.use(
    response=>{
        if (response.headers['authorization']) {
            window.localStorage.setItem('jwt',response.headers['authorization'])
        }
        if (response.headers['tokenexpired']){
            ElMessage.warning("token已过期，请重新登录!")
            setTimeout(()=>{
                window.location.href = "http://localhost:8080/#/administratorLogin"
            },1200)
        }
        return response.status === 200 ? Promise.resolve(response) : Promise.reject(response)
    },
    error=>{
        console.log(error)
        errorHandler(error.response.status,error.message)
    }
)
export default instance