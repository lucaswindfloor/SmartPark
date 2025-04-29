/**
 * @file stores/notification.js
 * @description 通知公告状态管理
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getNotifications, getNotificationDetail, markAsRead } from '../services/notification';

export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref([]);
  const unreadCount = ref(0);
  const currentNotification = ref(null);
  const loading = ref(false);
  const total = ref(0);
  const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    type: null,
    status: null,
    keyword: ''
  });
  
  // 计算属性
  const hasUnread = computed(() => unreadCount.value > 0);
  
  // 方法
  // 获取通知列表
  async function fetchNotifications(params = {}) {
    loading.value = true;
    try {
      // 合并查询参数
      const mergedParams = { ...queryParams.value, ...params };
      queryParams.value = mergedParams;
      
      const res = await getNotifications(mergedParams);
      if (res.code === 200) {
        notifications.value = res.data.list || [];
        total.value = res.data.total || 0;
        unreadCount.value = res.data.unreadCount || 0;
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res);
      }
    } catch (error) {
      return Promise.reject(error);
    } finally {
      loading.value = false;
    }
  }
  
  // 获取通知详情
  async function fetchNotificationDetail(id) {
    loading.value = true;
    try {
      const res = await getNotificationDetail(id);
      if (res.code === 200) {
        currentNotification.value = res.data;
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res);
      }
    } catch (error) {
      return Promise.reject(error);
    } finally {
      loading.value = false;
    }
  }
  
  // 标记通知为已读
  async function markNotificationAsRead(id) {
    try {
      const res = await markAsRead(id);
      if (res.code === 200) {
        // 更新本地状态
        if (currentNotification.value && currentNotification.value.id === id) {
          currentNotification.value.isRead = true;
        }
        
        // 更新通知列表中的已读状态
        const index = notifications.value.findIndex(item => item.id === id);
        if (index !== -1) {
          notifications.value[index].isRead = true;
        }
        
        // 更新未读数量
        if (unreadCount.value > 0) {
          unreadCount.value--;
        }
        
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  // 重置查询参数
  function resetQueryParams() {
    queryParams.value = {
      pageNum: 1,
      pageSize: 10,
      type: null,
      status: null,
      keyword: ''
    };
  }
  
  return {
    // 状态
    notifications,
    unreadCount,
    currentNotification,
    loading,
    total,
    queryParams,
    
    // 计算属性
    hasUnread,
    
    // 方法
    fetchNotifications,
    fetchNotificationDetail,
    markNotificationAsRead,
    resetQueryParams
  };
}); 