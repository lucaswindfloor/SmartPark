/**
 * @file stores/user.js
 * @description 用户状态管理
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login, getUserInfo, logout as apiLogout } from '../services/auth';
import { setToken, getToken, removeToken } from '../core/utils/auth';

// 定义用户Store
export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(getToken() || '');
  const userInfo = ref({});
  const roles = ref([]);
  const permissions = ref([]);
  const isLoggedIn = ref(!!getToken());
  
  // 标记该store需要持久化
  const $persistState = true;
  
  // 计算属性
  const userId = computed(() => userInfo.value?.id || '');
  const username = computed(() => userInfo.value?.username || '');
  const avatar = computed(() => userInfo.value?.avatar || '');
  
  // 方法
  // 登录
  async function loginAction(loginForm) {
    try {
      const res = await login(loginForm);
      if (res.code === 200) {
        const { token: userToken, ...rest } = res.data;
        
        // 设置token
        token.value = userToken;
        setToken(userToken);
        
        // 更新登录状态
        isLoggedIn.value = true;
        
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  // 获取用户信息
  async function getUserInfoAction() {
    try {
      const res = await getUserInfo();
      if (res.code === 200) {
        userInfo.value = res.data;
        roles.value = res.data.roles || [];
        permissions.value = res.data.permissions || [];
        
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  // 退出登录
  async function logoutAction() {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      resetState();
    }
  }
  
  // 重置状态
  function resetState() {
    token.value = '';
    userInfo.value = {};
    roles.value = [];
    permissions.value = [];
    isLoggedIn.value = false;
    removeToken();
  }
  
  // 检查是否有权限
  function hasPermission(permission) {
    if (!permission) return true;
    
    if (Array.isArray(permission)) {
      return permission.some(p => permissions.value.includes(p));
    }
    
    return permissions.value.includes(permission);
  }
  
  // 检查是否有角色
  function hasRole(role) {
    if (!role) return true;
    
    if (Array.isArray(role)) {
      return role.some(r => roles.value.includes(r));
    }
    
    return roles.value.includes(role);
  }
  
  return {
    // 状态
    token,
    userInfo,
    roles,
    permissions,
    isLoggedIn,
    $persistState,
    
    // 计算属性
    userId,
    username,
    avatar,
    
    // 方法
    loginAction,
    getUserInfoAction,
    logoutAction,
    resetState,
    hasPermission,
    hasRole
  };
}); 