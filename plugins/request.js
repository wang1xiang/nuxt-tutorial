/**
 * 基于axios封装的请求模块
 */

import axios from 'axios'

// 创建请求对象
export const request = axios.create({
  baseURL: 'https://conduit.productionready.io/',
  timeout: 60000
})

// 通过插件机制获取到上下文对象
// export default (context)
export default ({ store }) => {
  // console.log(context)
  // 请求拦截器
  // 任何请求都要经过请求拦截器
  // 可以在拦截器中做公共业务处理 如设置token
  request.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 请求就会经过这里
    /**
     * 需要拿到vuex中的user对象
     * import store from '@/store'
     * 因为store都是通过export按需导出
     * 需要按需加载import { state } from '@/store'
     * 此时拿到的state是一个函数 需要调用一下此函数
     * 这样拿到的数据永远是null
     * 不同于客户端渲染 所以需要放入到plugins中
     */
    const { user } = store.state
  
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
  
    // 返回 config 请求配置对象
    return config
  }, function (error) {
    // 如果请求失败(此时请求还没有发出去)就会进入这里
    // Do something with request error
    return Promise.reject(error)
  })
}

// 响应拦截器