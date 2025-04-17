// request.js
// API请求封装工具

import axios from 'axios';

// 创建一个axios实例
const service = axios.create({
  baseURL: '/api', // API基础URL
  timeout: 15000 // 请求超时
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前处理
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 处理请求错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 处理响应数据
    const res = response.data;
    
    // 根据业务状态码处理响应
    if (res.code && res.code !== 200) {
      // 处理各种业务错误
      if (res.code === 401) {
        // 未授权，重定向到登录页
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(res.message || '未知错误'));
    } else {
      return res;
    }
  },
  error => {
    // 处理响应错误
    console.error('响应错误:', error);
    
    if (error.response) {
      // 根据HTTP状态码处理错误
      switch (error.response.status) {
        case 401:
          // 未授权，重定向到登录页
          window.location.href = '/login';
          break;
        case 403:
          // 无权限
          console.error('无权限访问该资源');
          break;
        case 404:
          // 资源不存在
          console.error('请求的资源不存在');
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误');
          break;
        default:
          console.error(`HTTP错误: ${error.response.status}`);
      }
    }
    
    return Promise.reject(error);
  }
);

// 封装GET请求
export function get(url, params) {
  return service({
    url,
    method: 'get',
    params
  });
}

// 封装POST请求
export function post(url, data) {
  return service({
    url,
    method: 'post',
    data
  });
}

// 封装PUT请求
export function put(url, data) {
  return service({
    url,
    method: 'put',
    data
  });
}

// 封装DELETE请求
export function del(url, params) {
  return service({
    url,
    method: 'delete',
    params
  });
}

// 导出请求工具
export default service; 