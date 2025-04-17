// 核心插件配置
// 此文件汇总并导出所有核心插件

import { createI18n } from 'vue-i18n';
import zhCN from '../../locales/zh-CN';
import enUS from '../../locales/en-US';

// 国际化插件
export const i18nPlugin = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  }
});

// 权限指令插件
export const permissionPlugin = {
  install(app) {
    app.directive('permission', {
      mounted(el, binding) {
        const { value } = binding;
        const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        
        if (value && !userPermissions.includes(value)) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    });
  }
};

// 全局错误处理插件
export const errorHandlerPlugin = {
  install(app) {
    app.config.errorHandler = (err, vm, info) => {
      console.error('应用错误:', err);
      console.error('错误信息:', info);
      // TODO: 上报错误到服务器
    };
  }
};

// 导出所有插件集合
export default {
  i18n: i18nPlugin,
  permission: permissionPlugin,
  errorHandler: errorHandlerPlugin
}; 