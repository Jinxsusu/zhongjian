import axios from 'axios'

import vue from '../main.js'
// vue axios路由跳转取消所有请求 https://juejin.im/post/5c3ea11c51882525aa507f0d
const CancelToken = axios.CancelToken

axios.defaults.baseURL = window.SITE_CONFIG.serverUrl
axios.defaults.withCredentials = true

// http request 拦截器
axios.interceptors.request.use(
  config => {
    let axiosPromiseCancelArrs = []
    // 这个是 取消重点
    config.cancelToken = new CancelToken((cancel) => {
      axiosPromiseCancelArrs.push(cancel)
    })

    vue.$store.commit('setAxiosPromiseCancel', axiosPromiseCancelArrs)
    vue.$store.commit('startLoading')
    return config
  },
  err => {
    vue.$notify.error({
      title: '错误',
      message: '系统出现错误，请重试----！'
    })

    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  response => {
    vue.$store.commit('endLoading')
    return response.data
  },
  error => {
    vue.$store.commit('endLoading')

    if (axios.isCancel(error)) {
      // 为了终结promise链 就是实际请求 不会走到.catch(rej=>{});这样就不会触发错误提示之类了。
      return new Promise(() => {})
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          vue.$store.commit('loginOut')
          vue.$router.replace({
            path: 'login',
            query: {
              redirect: vue.$router.currentRoute.fullPath
            }
          })
          return
        case 888: // UserFriendlyException
          vue.$message.error(error.response.data.message)
          return Promise.reject(error.response.data)
        default:
          let msg = '系统出现错误，请重试'
          vue.$message.error(msg)
          return Promise.reject(msg)
      }
    }
  })

export default axios
