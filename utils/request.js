/**
 * 基于axios封装的请求模块
 */

import axios from 'axios'

// 创建请求对象
const request = axios.create({
  baseURL: 'http://realworld.api.fed.lagounews.com'
})

export default request
// 请求拦截器

// 响应拦截器