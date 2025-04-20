// 综合管理平台 Pinia 状态
import { defineStore } from 'pinia';

// 综合管理平台特定的状态
export const useComprehensiveStore = defineStore('comprehensive', {
  state: () => ({
    moduleLoaded: false,
    currentModule: '',
    // 其他特定于综合管理平台的状态
  }),
  
  actions: {
    setCurrentModule(module) {
      this.currentModule = module;
    },
    
    setModuleLoaded(loaded) {
      this.moduleLoaded = loaded;
    }
  }
});

// 导出所有状态
export default {
  useComprehensiveStore
}; 