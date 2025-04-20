import { request } from '@/core/utils/request';

/**
 * 内容安全服务
 * 提供内容扫描、敏感词过滤、XSS防护等功能
 */
export class ContentSecurityService {
  /**
   * 扫描内容是否包含敏感信息
   * @param {String} content 待扫描内容
   * @param {Array} options 扫描选项
   * @returns {Promise<Object>} 扫描结果
   */
  static async scanContent(content, options = {}) {
    return request({
      url: '/api/content-security/scan',
      method: 'post',
      data: {
        content,
        options: {
          checkSensitiveWords: true,
          checkPersonalInfo: true,
          checkXss: true,
          ...options
        }
      }
    });
  }

  /**
   * 过滤敏感词
   * @param {String} content 原始内容
   * @returns {Promise<Object>} 过滤后的内容和替换信息
   */
  static async filterSensitiveWords(content) {
    return request({
      url: '/api/content-security/filter',
      method: 'post',
      data: { content }
    });
  }

  /**
   * 检查内容是否含有外部链接
   * @param {String} content HTML内容
   * @returns {Object} 检查结果
   */
  static checkExternalLinks(content) {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>/gi;
    const urls = [];
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[1];
      if (url && url.startsWith('http') && !this.isWhitelistedDomain(url)) {
        urls.push(url);
      }
    }
    
    return {
      hasExternalLinks: urls.length > 0,
      externalUrls: urls
    };
  }

  /**
   * 检查图片来源
   * @param {String} content HTML内容
   * @returns {Object} 检查结果
   */
  static checkImageSources(content) {
    const imgRegex = /<img\s+(?:[^>]*?\s+)?src="([^"]*)"[^>]*>/gi;
    const urls = [];
    let match;
    
    while ((match = imgRegex.exec(content)) !== null) {
      const url = match[1];
      if (url && url.startsWith('http') && !this.isWhitelistedDomain(url)) {
        urls.push(url);
      }
    }
    
    return {
      hasExternalImages: urls.length > 0,
      externalImageUrls: urls
    };
  }

  /**
   * 清理XSS风险内容
   * @param {String} content HTML内容
   * @returns {String} 清理后的内容
   */
  static sanitizeXss(content) {
    if (!content) return '';
    
    // 移除危险的脚本标签
    let sanitized = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // 移除危险的事件属性
    const dangerousAttributes = [
      'onload', 'onclick', 'onmouseover', 'onerror', 'onkeydown', 'onkeypress',
      'onkeyup', 'onmouseout', 'onmousemove', 'onmousedown', 'onabort', 'ondblclick',
      'onsubmit', 'onunload', 'onblur', 'onchange', 'onfocus', 'onreset', 'onselect'
    ];
    
    dangerousAttributes.forEach(attr => {
      const regex = new RegExp(`\\s${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });
    
    // 移除危险的内联样式
    sanitized = sanitized.replace(/style\s*=\s*["'](.*?expression\s*\(.*?\))["']/gi, '');
    
    return sanitized;
  }

  /**
   * 检查域名是否在白名单中
   * @param {String} url URL
   * @returns {Boolean} 是否在白名单中
   */
  static isWhitelistedDomain(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      // 白名单域名
      const whitelist = [
        'smartcampus.com',
        'smartpark.gov.cn',
        'trusted-cdn.com'
      ];
      
      return whitelist.some(item => domain === item || domain.endsWith(`.${item}`));
    } catch (e) {
      return false;
    }
  }

  /**
   * 内容安全日志记录
   * @param {Object} securityAudit 安全审计信息
   */
  static async logSecurityAudit(securityAudit) {
    return request({
      url: '/api/content-security/audit',
      method: 'post',
      data: securityAudit
    });
  }
} 