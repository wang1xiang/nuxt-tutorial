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
//获取当前登陆用户
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/api/user',
  })
}

//获取用户个人信息
export const getProfile = username => {
  return request({
    method: 'GET',
    url: `api/profiles/${username}`,
  })
}

// 更新用户信息
export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data,
  })
}