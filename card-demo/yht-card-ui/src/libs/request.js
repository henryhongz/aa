// axios的配置
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { Message } from 'element-ui'
// 创建 axios 实例
const createOptions = {
    // API 请求的默认前缀
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 60000 // 请求超时时间
}
const request = axios.create(createOptions)
// 异常拦截处理器
const errorHandler = (error) => {
    if (error.message === 'unknown') return
    Message.error(error.message)
    return Promise.reject(error)
}

request.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器
request.interceptors.request.use(config => {
    // const token = getToken()
    // // 如果 token 存在
    // // 让每个请求携带自定义 token
    // if (token) {
    //   config.headers['Authorization'] = 'Bearer ' + token
    // }
    if (!config.url) throw new Error('unknown')
    return config
}, errorHandler)

// 响应拦截器
request.interceptors.response.use((response) => {
    if (response.status !== 200) {
        return Promise.reject(response.data)
    }
    return response.data
}, errorHandler)

const installer = {
    vm: {},
    install (Vue) {
        Vue.use(axios, request)
    }
}

export default request

export {
    installer as VueAxios,
    request as axios
}
