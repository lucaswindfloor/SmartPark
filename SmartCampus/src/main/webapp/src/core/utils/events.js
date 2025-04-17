// events.js
// 事件总线 - 用于跨平台/组件间通信

/**
 * 事件总线类 - 实现发布订阅模式
 */
class EventBus {
  constructor() {
    // 事件映射表
    this.events = {};
  }

  /**
   * 注册事件监听器
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   * @returns {Function} - 用于移除事件监听的函数
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    this.events[eventName].push(callback);
    
    // 返回一个用于移除此监听器的函数
    return () => this.off(eventName, callback);
  }

  /**
   * 注册一次性事件监听器，触发后自动移除
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   * @returns {Function} - 用于移除事件监听的函数
   */
  once(eventName, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    
    return this.on(eventName, wrapper);
  }

  /**
   * 触发事件
   * @param {string} eventName - 事件名称
   * @param {...any} args - 传递给回调函数的参数
   * @returns {boolean} - 是否有监听器被触发
   */
  emit(eventName, ...args) {
    const callbacks = this.events[eventName];
    if (!callbacks || callbacks.length === 0) {
      console.warn(`没有监听器注册到事件: ${eventName}`);
      return false;
    }
    
    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`事件 ${eventName} 处理器执行出错:`, error);
      }
    });
    
    return true;
  }

  /**
   * 移除事件监听器
   * @param {string} eventName - 事件名称
   * @param {Function} [callback] - 可选，特定的回调函数。不提供时移除该事件的所有监听器
   * @returns {boolean} - 是否成功移除
   */
  off(eventName, callback) {
    if (!this.events[eventName]) {
      return false;
    }
    
    if (!callback) {
      // 如果没有指定回调，删除该事件的所有监听器
      delete this.events[eventName];
      return true;
    }
    
    // 找到并移除特定的回调
    const index = this.events[eventName].indexOf(callback);
    if (index !== -1) {
      this.events[eventName].splice(index, 1);
      
      // 如果该事件没有监听器了，删除该事件
      if (this.events[eventName].length === 0) {
        delete this.events[eventName];
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * 清除所有事件监听器
   */
  clear() {
    this.events = {};
  }
}

// 创建并导出全局事件总线实例
const eventBus = new EventBus();

/**
 * 在两个平台间发送消息
 * @param {string} targetPlatform - 目标平台 ('comprehensive', 'public-service', 'system-admin')
 * @param {string} eventName - 事件名称
 * @param {any} data - 要发送的数据
 */
export function sendToPlatform(targetPlatform, eventName, data) {
  const fullEventName = `platform:${targetPlatform}:${eventName}`;
  eventBus.emit(fullEventName, data);
}

/**
 * 监听来自特定平台的消息
 * @param {string} sourcePlatform - 源平台 ('comprehensive', 'public-service', 'system-admin')
 * @param {string} eventName - 事件名称
 * @param {Function} callback - 回调函数
 * @returns {Function} - 用于取消监听的函数
 */
export function listenFromPlatform(sourcePlatform, eventName, callback) {
  const fullEventName = `platform:${sourcePlatform}:${eventName}`;
  return eventBus.on(fullEventName, callback);
}

// 导出基本的事件总线API
export const events = {
  on: eventBus.on.bind(eventBus),
  once: eventBus.once.bind(eventBus),
  emit: eventBus.emit.bind(eventBus),
  off: eventBus.off.bind(eventBus),
  clear: eventBus.clear.bind(eventBus)
};

// 默认导出事件总线实例
export default events; 