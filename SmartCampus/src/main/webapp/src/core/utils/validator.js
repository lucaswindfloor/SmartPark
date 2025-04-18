// validator.js
// 数据验证工具函数

/**
 * 检查值是否为空（null, undefined, '', [], {}）
 * @param {*} value - 要检查的值
 * @returns {boolean} 是否为空
 */
export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  
  return false;
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export function isEmail(email) {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return reg.test(email);
}

/**
 * 验证手机号格式（中国大陆）
 * @param {string} mobile - 手机号码
 * @returns {boolean} 是否有效
 */
export function isMobile(mobile) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(mobile);
}

/**
 * 验证URL格式
 * @param {string} url - URL
 * @returns {boolean} 是否有效
 */
export function isUrl(url) {
  const reg = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}(\/[a-zA-Z0-9-./?%&=]*)?$/;
  return reg.test(url);
}

/**
 * 验证身份证号码（中国大陆）
 * @param {string} idCard - 身份证号码
 * @returns {boolean} 是否有效
 */
export function isIdCard(idCard) {
  // 18位身份证正则
  const reg = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/;
  
  if (!reg.test(idCard)) {
    return false;
  }
  
  // 验证校验位
  if (idCard.length === 18) {
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    let ai = 0;
    let wi = 0;
    
    for (let i = 0; i < 17; i++) {
      ai = idCard[i];
      wi = factor[i];
      sum += ai * wi;
    }
    
    const last = parity[sum % 11];
    return last === idCard[17].toUpperCase();
  }
  
  return true;
}

/**
 * 验证是否为数字（包括小数）
 * @param {*} value - 要检查的值
 * @returns {boolean} 是否为数字
 */
export function isNumber(value) {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return !isNaN(Number(value));
  }
  return false;
}

/**
 * 验证是否为整数
 * @param {*} value - 要检查的值
 * @returns {boolean} 是否为整数
 */
export function isInteger(value) {
  if (typeof value === 'number') {
    return Number.isInteger(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return /^-?\d+$/.test(value);
  }
  return false;
}

/**
 * 验证是否为正数
 * @param {*} value - 要检查的值
 * @returns {boolean} 是否为正数
 */
export function isPositive(value) {
  if (!isNumber(value)) {
    return false;
  }
  return Number(value) > 0;
}

/**
 * 验证是否为中文字符
 * @param {string} value - 要检查的字符串
 * @returns {boolean} 是否全部为中文字符
 */
export function isChinese(value) {
  const reg = /^[\u4e00-\u9fa5]+$/;
  return reg.test(value);
}

/**
 * 验证密码强度
 * 至少8位，包含大小写字母和数字
 * @param {string} password - 密码
 * @returns {boolean} 是否有效
 */
export function isStrongPassword(password) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return reg.test(password);
}

/**
 * 验证IP地址格式
 * @param {string} ip - IP地址
 * @returns {boolean} 是否有效
 */
export function isIp(ip) {
  const reg = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!reg.test(ip)) {
    return false;
  }
  
  const parts = ip.split('.');
  for (let i = 0; i < 4; i++) {
    if (parts[i] < 0 || parts[i] > 255) {
      return false;
    }
  }
  
  return true;
}

export default {
  isEmpty,
  isEmail,
  isMobile,
  isUrl,
  isIdCard,
  isNumber,
  isInteger,
  isPositive,
  isChinese,
  isStrongPassword,
  isIp
};
