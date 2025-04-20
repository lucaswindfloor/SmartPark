/**
 * HTML工具类
 * 提供HTML内容处理相关的工具函数
 */

/**
 * 将HTML转换为纯文本
 * @param {String} html HTML内容
 * @returns {String} 纯文本内容
 */
export function htmlToText(html) {
  if (!html) return '';
  
  // 创建临时DOM元素
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // 获取文本内容
  const text = tempDiv.textContent || tempDiv.innerText || '';
  
  // 清理多余空格
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * 移除HTML标签
 * @param {String} html HTML内容
 * @returns {String} 移除标签后的内容
 */
export function removeHtmlTags(html) {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * 提取HTML中的第一张图片URL
 * @param {String} html HTML内容
 * @returns {String|null} 图片URL或null
 */
export function extractFirstImageUrl(html) {
  if (!html) return null;
  
  const imgRegex = /<img.*?src=["'](.*?)["']/i;
  const match = html.match(imgRegex);
  
  return match ? match[1] : null;
}

/**
 * 获取HTML内容长度（字符数）
 * @param {String} html HTML内容
 * @returns {Number} 字符数
 */
export function getHtmlContentLength(html) {
  return htmlToText(html).length;
}

/**
 * 截取HTML内容（保持HTML结构）
 * @param {String} html HTML内容
 * @param {Number} maxLength 最大长度
 * @returns {String} 截取后的HTML
 */
export function truncateHtml(html, maxLength) {
  if (!html) return '';
  if (htmlToText(html).length <= maxLength) return html;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  let result = '';
  let textLength = 0;
  
  // 递归处理节点
  function processNode(node) {
    if (textLength >= maxLength) return;
    
    if (node.nodeType === 3) { // 文本节点
      const text = node.textContent;
      const remainingLength = maxLength - textLength;
      
      if (textLength + text.length <= maxLength) {
        result += text;
        textLength += text.length;
      } else {
        result += text.substr(0, remainingLength) + '...';
        textLength = maxLength;
      }
    } else if (node.nodeType === 1) { // 元素节点
      const startTag = `<${node.nodeName.toLowerCase()}`;
      const attributes = Array.from(node.attributes)
        .map(attr => ` ${attr.name}="${attr.value}"`)
        .join('');
      
      result += `${startTag}${attributes}>`;
      
      for (let i = 0; i < node.childNodes.length && textLength < maxLength; i++) {
        processNode(node.childNodes[i]);
      }
      
      result += `</${node.nodeName.toLowerCase()}>`;
    }
  }
  
  // 处理所有子节点
  for (let i = 0; i < tempDiv.childNodes.length && textLength < maxLength; i++) {
    processNode(tempDiv.childNodes[i]);
  }
  
  return result;
}

/**
 * 检查HTML内容是否包含指定元素
 * @param {String} html HTML内容
 * @param {String} tagName 标签名
 * @returns {Boolean} 是否包含
 */
export function containsTag(html, tagName) {
  if (!html) return false;
  
  const regex = new RegExp(`<${tagName}[^>]*>`, 'i');
  return regex.test(html);
}

/**
 * 给HTML内容添加样式
 * @param {String} html HTML内容
 * @param {Object} styles CSS样式对象
 * @returns {String} 添加样式后的HTML
 */
export function addStyleToHtml(html, styles) {
  if (!html) return '';
  
  const styleStr = Object.entries(styles)
    .map(([prop, value]) => `${prop}: ${value};`)
    .join(' ');
  
  return `<div style="${styleStr}">${html}</div>`;
} 