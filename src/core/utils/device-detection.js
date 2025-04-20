/**
 * 设备检测工具类
 * 提供设备类型、屏幕尺寸、浏览器能力等检测功能
 */

/**
 * 检测是否为移动设备
 * @returns {Boolean} 是否为移动设备
 */
export function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // 检测常见移动设备标识
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  // 屏幕宽度检测（小于768px视为移动设备）
  const isSmallScreen = window.innerWidth < 768;
  
  return mobileRegex.test(userAgent) || isSmallScreen;
}

/**
 * 检测是否为平板设备
 * @returns {Boolean} 是否为平板设备
 */
export function isTabletDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // iPad或Android平板的特征检测
  const tabletRegex = /iPad|Android(?!.*Mobile)/i;
  
  // 屏幕尺寸检测（768px-1024px范围视为平板）
  const isTabletScreen = window.innerWidth >= 768 && window.innerWidth <= 1024;
  
  return tabletRegex.test(userAgent) || isTabletScreen;
}

/**
 * 检测是否为桌面设备
 * @returns {Boolean} 是否为桌面设备
 */
export function isDesktopDevice() {
  return !isMobileDevice() && !isTabletDevice();
}

/**
 * 获取当前设备类型
 * @returns {String} 设备类型：'mobile', 'tablet', 'desktop'
 */
export function getDeviceType() {
  if (isMobileDevice()) return 'mobile';
  if (isTabletDevice()) return 'tablet';
  return 'desktop';
}

/**
 * 检测是否支持触摸事件
 * @returns {Boolean} 是否支持触摸
 */
export function isTouchEnabled() {
  return 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    navigator.msMaxTouchPoints > 0;
}

/**
 * 获取屏幕方向
 * @returns {String} 'portrait' 或 'landscape'
 */
export function getScreenOrientation() {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * 获取设备像素比
 * @returns {Number} 设备像素比
 */
export function getDevicePixelRatio() {
  return window.devicePixelRatio || 1;
}

/**
 * 检测是否支持特定CSS功能
 * @param {String} feature CSS特性名称
 * @returns {Boolean} 是否支持
 */
export function supportsCSSFeature(feature) {
  return CSS && CSS.supports && CSS.supports(feature);
}

/**
 * 检测浏览器类型
 * @returns {Object} 包含浏览器信息的对象
 */
export function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = '';
  
  // Chrome
  if (/Chrome/.test(userAgent) && !/Chromium|Edge|Edg|OPR|HeadlessChrome/.test(userAgent)) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
  }
  // Firefox
  else if (/Firefox/.test(userAgent)) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
  }
  // Safari
  else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || '';
  }
  // Edge
  else if (/Edge|Edg/.test(userAgent)) {
    browserName = 'Edge';
    browserVersion = userAgent.match(/Edge\/(\d+\.\d+)|Edg\/(\d+\.\d+)/)?.[1] || '';
  }
  // IE
  else if (/MSIE|Trident/.test(userAgent)) {
    browserName = 'Internet Explorer';
    browserVersion = userAgent.match(/MSIE (\d+\.\d+)/)?.[1] || 
                     userAgent.match(/rv:(\d+\.\d+)/)?.[1] || '';
  }
  // Opera
  else if (/OPR/.test(userAgent)) {
    browserName = 'Opera';
    browserVersion = userAgent.match(/OPR\/(\d+\.\d+)/)?.[1] || '';
  }
  
  return {
    name: browserName,
    version: browserVersion,
    userAgent: userAgent,
    isModern: !(/MSIE|Trident/.test(userAgent)) // 非IE视为现代浏览器
  };
} 