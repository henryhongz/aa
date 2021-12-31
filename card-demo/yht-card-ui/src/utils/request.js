import axios from 'axios'
import store from '@/store'
// import storage from 'store'
import { Message } from 'element-ui'
import { VueAxios } from './axios'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const createOptions = {
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_TDT_BASE_URL,
  timeout: 60000 // 请求超时时间
}
if (process.env.NODE_ENV === 'development') {
  createOptions['validateStatus'] = () => {
    return true
  }
}
const request = axios.create(createOptions)

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = getToken()
    if (error.response.status === 403) {
      Message.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      Message.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

request.defaults.headers.post['Content-Type'] = 'application/json'

// request interceptor
request.interceptors.request.use(config => {
  // const token = getToken()
  // // 如果 token 存在
  // // 让每个请求携带自定义 token
  // if (token) {
  //   config.headers['Authorization'] = 'Bearer ' + token
  // }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  if (response.status !== 200) {
    return Promise.reject(response.data)
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
