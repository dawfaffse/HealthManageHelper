import axios from 'axios'

import { ElMessage } from 'element-plus'
// @ts-ignore
import {useAdminStore} from '@/store/admin'

const service = axios.create({
  baseURL: "/api",
  timeout: 5000,
  
})

service.interceptors.request.use(
  config => {
      // 检查是否是登录或注册请求，如果是则不添加token
    const isAuthRequest = config.url?.includes('/login') || config.url?.includes('/user/add')
    if (!isAuthRequest) {
      // 从 admin 键中获取 token
      const adminStr = localStorage.getItem('admin')
      let token = ''
      if (adminStr) {
        try {
          const admin = JSON.parse(adminStr)
          token = admin.token || ''
        } catch (e) {
          console.error('解析 admin 存储失败:', e)
        }
      }
      // 只有当token不为空时才添加token请求头
      if (token) {
        config.headers['token'] = token
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const {data} = response
    console.log('响应数据:', data)
    console.log('响应配置:', response.config)
    console.log('响应状态码:', response.status)
    
    // 处理不同的响应格式
    if (data.code === 200 || data.success === true) {
      return data.data || data
    } else {
      // 处理错误情况
      const errorMsg = data.msg || data.message || '请求失败'
      console.log('响应错误:', errorMsg)
      console.log('响应码:', data.code)
      
      // 处理登录过期 - 只有当明确是认证错误时才跳转到登录页面
      if((data.code === '-1' || data.code === 401) && !response.config.url?.includes('/login')){
        // 检查是否是认证错误
        if(data.msg?.includes('登录') || data.msg?.includes('token') || data.message?.includes('登录') || data.message?.includes('token')){
          // 直接操作localStorage，避免在响应拦截器中使用Pinia
          localStorage.removeItem('admin')
          ElMessage.error(errorMsg)
          window.location.href = '/auth/login'
        } else {
          // 其他错误，只显示错误信息，不跳转到登录页面
          ElMessage.error(errorMsg)
        }
      } else {
        ElMessage.error(errorMsg)
      }
      
      return Promise.reject(errorMsg)
    }
  },
  error => {
    // 处理网络错误
    console.error('网络错误:', error)
    console.error('错误响应:', error.response)
    console.error('错误配置:', error.config)
    console.error('错误状态码:', error.response?.status)
    const errorMsg = error.message || '网络错误'
    ElMessage.error(errorMsg)
    return Promise.reject(errorMsg)
  }
)



export default service
