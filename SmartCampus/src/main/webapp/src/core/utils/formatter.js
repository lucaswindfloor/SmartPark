// formatter.js
// 数据格式化工具函数

/**
 * 日期格式化
 * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - 格式化模板
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  
  const d = typeof date === 'object' ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }
  
  const o = {
    'Y+': d.getFullYear(), // 年份
    'M+': d.getMonth() + 1, // 月份
    'D+': d.getDate(), // 日
    'H+': d.getHours(), // 小时
    'h+': d.getHours() % 12 || 12, // 12小时制
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    'S': d.getMilliseconds() // 毫秒
  };
  
  // 替换年份
  if (/(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  
  // 替换其他单位
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1, 
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  
  return format;
}

/**
 * 将日期格式化为友好的时间描述
 * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
 * @returns {string} 友好的时间描述
 */
export function formatTimeAgo(date) {
  if (!date) return '';
  
  const d = typeof date === 'object' ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }
  
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  // 返回格式化的字符串
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  
  if (years > 0) {
    return years + '年前';
  } else if (months > 0) {
    return months + '个月前';
  } else if (days > 0) {
    return days + '天前';
  } else if (hours > 0) {
    return hours + '小时前';
  } else if (minutes > 0) {
    return minutes + '分钟前';
  } else {
    return seconds <= 0 ? '刚刚' : seconds + '秒前';
  }
}

/**
 * 数字千分位格式化
 * @param {number} num - 数字
 * @param {number} [decimals=2] - 小数位数
 * @param {string} [dec='.'] - 小数点符号
 * @param {string} [sep=','] - 千分位分隔符
 * @returns {string} 格式化后的数字字符串
 */
export function formatNumber(num, decimals = 2, dec = '.', sep = ',') {
  if (num === null || num === undefined) return '';
  
  const toFixedFix = function (n, prec) {
    const k = Math.pow(10, prec);
    return '' + Math.round(n * k) / k;
  };
  
  num = (num + '').replace(/[^0-9+-Ee.]/g, '');
  
  const n = !isFinite(+num) ? 0 : +num;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  
  let s = '';
  
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  
  return s.join(dec);
}

/**
 * 货币格式化
 * @param {number} num - 数字
 * @param {string} [symbol='¥'] - 货币符号
 * @param {number} [decimals=2] - 小数位数
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(num, symbol = '¥', decimals = 2) {
  if (num === null || num === undefined) return '';
  return symbol + formatNumber(num, decimals);
}

/**
 * 文件大小格式化
 * @param {number} bytes - 字节数
 * @param {number} [decimals=2] - 小数位数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 截断文本并添加省略号
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 手机号码格式化
 * @param {string} mobile - 手机号码
 * @param {string} [separator=' '] - 分隔符
 * @returns {string} 格式化后的手机号码
 */
export function formatMobile(mobile, separator = ' ') {
  if (!mobile) return '';
  const value = String(mobile).trim();
  if (value.length !== 11) return value;
  
  const reg = new RegExp(`(.{3})(.{4})(.{4})`, 'g');
  return value.replace(reg, `$1${separator}$2${separator}$3`);
}

/**
 * 身份证号码格式化
 * @param {string} idCard - 身份证号码
 * @param {string} [separator=' '] - 分隔符
 * @returns {string} 格式化后的身份证号码
 */
export function formatIdCard(idCard, separator = ' ') {
  if (!idCard) return '';
  const value = String(idCard).trim();
  if (value.length !== 18) return value;
  
  const reg = new RegExp(`(.{6})(.{8})(.{4})`, 'g');
  return value.replace(reg, `$1${separator}$2${separator}$3`);
}

export default {
  formatDate,
  formatTimeAgo,
  formatNumber,
  formatCurrency,
  formatFileSize,
  truncateText,
  formatMobile,
  formatIdCard
}; 