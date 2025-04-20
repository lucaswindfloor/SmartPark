/**
 * @file stores/app.js
 * @description 应用全局状态管理
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  // 状态
  const currentPlatform = ref('public-service'); // 默认平台是公共服务平台
  const sidebar = ref({
    opened: true,
    withoutAnimation: false
  });
  const device = ref('desktop');
  const size = ref('default');
  const language = ref(localStorage.getItem('language') || 'zh-CN');
  const theme = ref(localStorage.getItem('theme') || 'light');
  
  // 标记该store需要持久化
  const $persistState = true;
  
  // 方法
  // 切换侧边栏状态
  function toggleSidebar() {
    sidebar.value.opened = !sidebar.value.opened;
    sidebar.value.withoutAnimation = false;
  }
  
  // 关闭侧边栏
  function closeSidebar(withoutAnimation) {
    sidebar.value.opened = false;
    sidebar.value.withoutAnimation = withoutAnimation;
  }
  
  // 切换设备类型
  function toggleDevice(val) {
    device.value = val;
  }
  
  // 设置尺寸
  function setSize(val) {
    size.value = val;
  }
  
  // 切换语言
  function setLanguage(lang) {
    language.value = lang;
    localStorage.setItem('language', lang);
  }
  
  // 切换主题
  function setTheme(newTheme) {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    
    // 在body上应用主题类
    document.body.className = `theme-${newTheme}`;
  }
  
  // 设置当前平台
  function setPlatform(platform) {
    currentPlatform.value = platform;
  }
  
  return {
    // 状态
    currentPlatform,
    sidebar,
    device,
    size,
    language,
    theme,
    $persistState,
    
    // 方法
    toggleSidebar,
    closeSidebar,
    toggleDevice,
    setSize,
    setLanguage,
    setTheme,
    setPlatform
  };
}); 