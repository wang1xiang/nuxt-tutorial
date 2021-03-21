import { request } from '../plugins/request'

// 用户相关接口
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    timeout: 30000,
    data
  })
}

export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    timeout: 30000,
    data
  })
}