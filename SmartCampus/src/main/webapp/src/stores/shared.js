/**
 * @file stores/shared.js
 * @description 跨平台共享状态管理 - 用于平台间数据共享和状态同步
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useSharedStore = defineStore('shared', () => {
  // 标记状态需要持久化
  const $persistState = true;

  // 跨平台共享的状态
  const platformStatuses = ref({
    'comprehensive': { status: 'online', lastUpdated: null },
    'public-service': { status: 'online', lastUpdated: null },
    'system-admin': { status: 'online', lastUpdated: null }
  });
  
  // 全局通知消息 - 最小实现
  const globalNotifications = ref([]);
  
  // 计算属性
  const onlinePlatforms = computed(() => {
    return Object.entries(platformStatuses.value)
      .filter(([_, data]) => data.status === 'online')
      .map(([platform]) => platform);
  });
  
  // 方法
  // 更新平台状态
  function updatePlatformStatus(platform, status) {
    if (!platformStatuses.value[platform]) {
      console.warn(`未知平台: ${platform}`);
      return false;
    }
    
    platformStatuses.value[platform] = {
      status,
      lastUpdated: new Date().toISOString()
    };
    
    return true;
  }
  
  // 添加全局通知
  function addGlobalNotification(notification) {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    globalNotifications.value.unshift(newNotification);
    
    // 限制通知数量，避免内存占用过大
    if (globalNotifications.value.length > 50) {
      globalNotifications.value = globalNotifications.value.slice(0, 50);
    }
    
    return newNotification.id;
  }
  
  // 标记通知为已读
  function markNotificationAsRead(id) {
    const notification = globalNotifications.value.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }
  
  // 获取未读通知数
  const unreadNotificationsCount = computed(() => {
    return globalNotifications.value.filter(n => !n.read).length;
  });
  
  return {
    // 状态
    platformStatuses,
    globalNotifications,
    $persistState,
    
    // 计算属性
    onlinePlatforms,
    unreadNotificationsCount,
    
    // 方法
    updatePlatformStatus,
    addGlobalNotification,
    markNotificationAsRead
  };
}); 