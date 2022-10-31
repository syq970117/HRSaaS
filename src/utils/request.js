import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
// import { response } from 'express'

const tout = 3600 // 设置超时时间

const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  // 设置axios请求的基础地址
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 定义5s超时
})

// 请求拦截器
service.interceptors.request.use(config => {
  // config是请求的配置信息
  // 注入token
  if (store.getters.token) {
    // 存在token的情况下，才会去检查时间戳是否超时
    if (isCheckTimeOut()) {
      // token超时
      store.dispatch('user/logout') // 登出
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token过期，请重新登录'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // 必须要返回的
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  // 根据success的成功与否决定下面操作
  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当code=10002时，表示后端告知我token过期了
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入catch
})

function isCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > tout
}

export default service
