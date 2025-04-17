// storage.js
// 本地存储工具函数
// 提供 localStorage、sessionStorage、Cookie 的操作方法

/**
 * localStorage 操作封装
 */
export const localStorage = {
  /**
   * 设置本地存储
   * @param {string} key - 存储键名
   * @param {any} value - 存储值，会被自动序列化为 JSON 字符串
   * @param {number} [expires] - 过期时间（毫秒），可选
   */
  set(key, value, expires) {
    const data = {
      value,
      expires: expires ? new Date().getTime() + expires : null
    };
    window.localStorage.setItem(key, JSON.stringify(data));
  },

  /**
   * 获取本地存储
   * @param {string} key - 存储键名
   * @returns {any} 存储值，如果已过期或不存在则返回 null
   */
  get(key) {
    const json = window.localStorage.getItem(key);
    if (!json) return null;
    
    try {
      const data = JSON.parse(json);
      if (data.expires && data.expires < new Date().getTime()) {
        this.remove(key);
        return null;
      }
      return data.value;
    } catch (e) {
      return null;
    }
  },

  /**
   * 移除本地存储
   * @param {string} key - 存储键名
   */
  remove(key) {
    window.localStorage.removeItem(key);
  },

  /**
   * 清空所有本地存储
   */
  clear() {
    window.localStorage.clear();
  }
};

/**
 * sessionStorage 操作封装
 */
export const sessionStorage = {
  /**
   * 设置会话存储
   * @param {string} key - 存储键名
   * @param {any} value - 存储值，会被自动序列化为 JSON 字符串
   */
  set(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify({value}));
  },

  /**
   * 获取会话存储
   * @param {string} key - 存储键名
   * @returns {any} 存储值，如果不存在则返回 null
   */
  get(key) {
    const json = window.sessionStorage.getItem(key);
    if (!json) return null;
    
    try {
      const data = JSON.parse(json);
      return data.value;
    } catch (e) {
      return null;
    }
  },

  /**
   * 移除会话存储
   * @param {string} key - 存储键名
   */
  remove(key) {
    window.sessionStorage.removeItem(key);
  },

  /**
   * 清空所有会话存储
   */
  clear() {
    window.sessionStorage.clear();
  }
};

/**
 * Cookie 操作封装
 */
export const cookies = {
  /**
   * 设置 Cookie
   * @param {string} key - Cookie 名称
   * @param {string} value - Cookie 值
   * @param {Object} [options] - Cookie 选项
   * @param {number} [options.expires] - 过期时间（天数）
   * @param {string} [options.path] - Cookie 路径，默认为 '/'
   * @param {string} [options.domain] - Cookie 域名
   * @param {boolean} [options.secure] - 是否只在 HTTPS 下发送 Cookie
   * @param {string} [options.sameSite] - SameSite 属性，可选值：Strict、Lax、None
   */
  set(key, value, options = {}) {
    let cookieStr = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    
    if (options.expires) {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookieStr += `; expires=${date.toUTCString()}`;
    }
    
    if (options.path) cookieStr += `; path=${options.path}`;
    else cookieStr += '; path=/';
    
    if (options.domain) cookieStr += `; domain=${options.domain}`;
    if (options.secure) cookieStr += '; secure';
    if (options.sameSite) cookieStr += `; samesite=${options.sameSite}`;
    
    document.cookie = cookieStr;
  },

  /**
   * 获取 Cookie
   * @param {string} key - Cookie 名称
   * @returns {string|null} Cookie 值，如果不存在则返回 null
   */
  get(key) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split('=');
      const name = decodeURIComponent(parts[0]);
      
      if (name === key) {
        return decodeURIComponent(parts[1] || '');
      }
    }
    return null;
  },

  /**
   * 移除 Cookie
   * @param {string} key - Cookie 名称
   * @param {Object} [options] - Cookie 选项
   * @param {string} [options.path] - Cookie 路径，默认为 '/'
   * @param {string} [options.domain] - Cookie 域名
   */
  remove(key, options = {}) {
    this.set(key, '', {
      ...options,
      expires: -1
    });
  }
};

// 默认导出所有工具
export default {
  localStorage,
  sessionStorage,
  cookies
}; 