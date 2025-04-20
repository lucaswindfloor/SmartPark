import { request } from '@/core/utils/request';
import { htmlToText } from '@/core/utils/html-utils';

/**
 * 无障碍服务
 * 提供内容无障碍优化、替代文本生成等功能
 */
export class AccessibilityService {
  /**
   * 生成图片替代文本
   * @param {String} imageUrl 图片URL
   * @returns {Promise<Object>} 包含替代文本的对象
   */
  static async generateAltText(imageUrl) {
    return request({
      url: '/api/accessibility/alt-text',
      method: 'post',
      data: { imageUrl }
    });
  }

  /**
   * 检查内容的无障碍合规性
   * @param {String} content HTML内容
   * @returns {Promise<Object>} 检查结果
   */
  static async checkAccessibility(content) {
    return request({
      url: '/api/accessibility/check',
      method: 'post',
      data: { content }
    });
  }

  /**
   * 优化HTML内容的无障碍性
   * @param {String} htmlContent 原HTML内容
   * @returns {String} 优化后的HTML内容
   */
  static improveAccessibility(htmlContent) {
    if (!htmlContent) return '';
    
    // 1. 为缺少alt属性的图片添加空alt
    let improved = htmlContent.replace(/<img(?![^>]*alt=)[^>]*>/gi, (match) => {
      return match.replace('<img', '<img alt=""');
    });
    
    // 2. 确保所有表格有表头
    improved = improved.replace(/<table[^>]*>(?![^]*?<th[^>]*>)[^]*?<tr[^>]*>/gi, (match) => {
      return match.replace(/<tr[^>]*>/, '<tr><th>内容</th></tr><tr>');
    });
    
    // 3. 添加ARIA角色
    improved = improved.replace(/<nav(?![^>]*role=)[^>]*>/gi, '<nav role="navigation">');
    improved = improved.replace(/<main(?![^>]*role=)[^>]*>/gi, '<main role="main">');
    improved = improved.replace(/<header(?![^>]*role=)[^>]*>/gi, '<header role="banner">');
    improved = improved.replace(/<footer(?![^>]*role=)[^>]*>/gi, '<footer role="contentinfo">');
    
    // 4. 确保链接有可识别文本
    improved = improved.replace(/<a[^>]*>(?:(?!<\/a>).)*?<\/a>/gi, (match) => {
      const text = htmlToText(match).trim();
      if (!text || text === 'link' || text === '链接') {
        return match.replace('</a>', '更多信息</a>');
      }
      return match;
    });
    
    return improved;
  }

  /**
   * 基于图片内容自动生成替代文本
   * @param {String} htmlContent HTML内容
   * @returns {Promise<String>} 处理后的HTML内容
   */
  static async autoGenerateImageAltTexts(htmlContent) {
    if (!htmlContent) return '';
    
    const imgRegex = /<img(?![^>]*alt=['"][^'"]+['"])[^>]*src=['"]([^'"]+)['"][^>]*>/gi;
    const matches = [];
    let match;
    
    // 收集所有没有有意义alt文本的图片
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      matches.push({
        fullMatch: match[0],
        imageUrl: match[1]
      });
    }
    
    // 如果没有需要处理的图片，直接返回
    if (matches.length === 0) {
      return htmlContent;
    }
    
    // 处理每个图片
    let result = htmlContent;
    for (const item of matches) {
      try {
        // 调用API获取替代文本
        const altResponse = await this.generateAltText(item.imageUrl);
        if (altResponse && altResponse.altText) {
          // 替换原图片标签，添加替代文本
          const newImgTag = item.fullMatch.replace('<img', `<img alt="${altResponse.altText}"`);
          result = result.replace(item.fullMatch, newImgTag);
        }
      } catch (error) {
        console.error('生成替代文本失败:', error);
      }
    }
    
    return result;
  }

  /**
   * 简化内容结构以提高屏幕阅读器兼容性
   * @param {String} htmlContent HTML内容
   * @returns {String} 简化后的HTML内容
   */
  static simplifyForScreenReaders(htmlContent) {
    if (!htmlContent) return '';
    
    // 移除纯装饰性元素
    let simplified = htmlContent.replace(/<div[^>]*class=['"]decoration['"][^>]*>.*?<\/div>/gi, '');
    
    // 简化嵌套结构
    simplified = simplified.replace(/<div[^>]*>\s*<div[^>]*>(.*?)<\/div>\s*<\/div>/gi, '<div>$1</div>');
    
    // 添加适当的标题结构
    if (!/<h[1-6][^>]*>/i.test(simplified)) {
      simplified = `<h1>通知内容</h1>${simplified}`;
    }
    
    return simplified;
  }
} 