/**
 * @file request.js
 * @description API请求工具类，基于axios封装
 */

import axios from 'axios';
import { message } from 'antd';
import { getToken, refreshToken, logout } from './auth';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 请求前获取token并添加到请求头
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    
    // 根据业务状态码判断请求是否成功
    if (res.code !== 200 && res.code !== 0) {
      message.error(res.message || '请求失败');
      
      // 401: Token失效
      if (res.code === 401) {
        // 尝试刷新token
        return refreshToken().then(newToken => {
          if (newToken) {
            // 使用新token重新请求
            const config = response.config;
            config.headers['Authorization'] = `Bearer ${newToken}`;
            return service(config);
          } else {
            // 刷新失败，登出处理
            logout();
            window.location.href = '/login';
            return Promise.reject(new Error('登录已过期，请重新登录'));
          }
        }).catch(() => {
          logout();
          window.location.href = '/login';
          return Promise.reject(new Error('登录已过期，请重新登录'));
        });
      }
      
      // 403: 权限不足
      if (res.code === 403) {
        message.error('权限不足，无法访问此资源');
      }
      
      return Promise.reject(new Error(res.message || '请求失败'));
    } else {
      return res;
    }
  },
  error => {
    console.error('响应错误:', error);
    const { status } = error.response || {};
    
    switch (status) {
      case 401:
        message.error('登录已过期，请重新登录');
        logout();
        window.location.href = '/login';
        break;
      case 403:
        message.error('权限不足，无法访问此资源');
        break;
      case 404:
        message.error('请求的资源不存在');
        break;
      case 500:
        message.error('服务器错误，请联系管理员');
        break;
      default:
        message.error(error.message || '请求失败，请稍后重试');
    }
    
    return Promise.reject(error);
  }
);

/**
 * 封装GET请求
 * @param {string} url - 请求URL
 * @param {object} params - 请求参数
 * @param {object} config - 额外配置项
 * @returns {Promise} - 返回Promise对象
 */
export function get(url, params = {}, config = {}) {
  return service({
    url,
    method: 'get',
    params,
    ...config
  });
}

/**
 * 封装POST请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求体数据
 * @param {object} config - 额外配置项
 * @returns {Promise} - 返回Promise对象
 */
export function post(url, data = {}, config = {}) {
  return service({
    url,
    method: 'post',
    data,
    ...config
  });
}

/**
 * 封装PUT请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求体数据
 * @param {object} config - 额外配置项
 * @returns {Promise} - 返回Promise对象
 */
export function put(url, data = {}, config = {}) {
  return service({
    url,
    method: 'put',
    data,
    ...config
  });
}

/**
 * 封装DELETE请求
 * @param {string} url - 请求URL
 * @param {object} params - 请求参数
 * @param {object} config - 额外配置项
 * @returns {Promise} - 返回Promise对象
 */
export function del(url, params = {}, config = {}) {
  return service({
    url,
    method: 'delete',
    params,
    ...config
  });
}

/**
 * 封装文件上传请求
 * @param {string} url - 上传URL
 * @param {FormData} formData - 表单数据
 * @param {object} config - 额外配置项
 * @returns {Promise} - 返回Promise对象
 */
export function upload(url, formData, config = {}) {
  return service({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  });
}

/**
 * 封装文件下载请求
 * @param {string} url - 下载URL
 * @param {object} params - 请求参数
 * @param {string} filename - 保存的文件名
 * @param {object} config - 额外配置项
 * @returns {Promise} - 返回Promise对象
 */
export function download(url, params = {}, filename, config = {}) {
  return service({
    url,
    method: 'get',
    params,
    responseType: 'blob',
    ...config
  }).then(response => {
    // 创建blob链接并触发下载
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename || 'download';
    link.click();
    window.URL.revokeObjectURL(link.href);
    
    return response;
  });
}

export default service; 