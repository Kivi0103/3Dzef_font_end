import axios from 'axios'

const baseURL = '/api'
const instance = axios.create({baseURL})

//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        //请求成功
        if (result.data.code===200){
            return result.data
        }
        //请求失败
        alert(result.data.msg?result.data.msg:'服务异常')
        return Promise.reject(result.data)
    },
    err=>{
        alert('服务异常')
        return Promise.reject(err)
    }
)

export default instance