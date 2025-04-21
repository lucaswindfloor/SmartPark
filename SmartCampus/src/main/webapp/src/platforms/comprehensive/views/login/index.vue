<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">智慧园区综合管理平台</h2>
      <form class="login-form">
        <div class="form-item">
          <label>用户名</label>
          <input type="text" v-model="username" placeholder="请输入用户名">
        </div>
        <div class="form-item">
          <label>密码</label>
          <input type="password" v-model="password" placeholder="请输入密码">
        </div>
        <div class="remember-forgot">
          <label>
            <input type="checkbox" v-model="remember"> 记住我
          </label>
          <a href="javascript:void(0)" @click="forgotPassword">忘记密码</a>
        </div>
        <button type="button" class="login-button" @click="handleLogin">登录</button>
      </form>

      <!-- 测试面板 -->
      <div class="test-panel">
        <h3>架构测试面板</h3>
        <div class="test-actions">
          <button @click="runTest">运行测试</button>
          <button @click="testAddNotification">添加通知</button>
          <button @click="syncToShared">同步到共享状态</button>
          <button @click="clearLogs">清空日志</button>
        </div>
        
        <div class="test-section">
          <h4>状态信息</h4>
          <div v-if="testStore">计数值: {{ testStore.counter }}</div>
          <div>Pinia是否可用: {{ isPiniaAvailable ? '✅' : '❌' }}</div>
          <div>Shared Store是否可用: {{ isSharedAvailable ? '✅' : '❌' }}</div>
          <div v-if="isSharedAvailable">通知数量: {{ notificationCount }}</div>
        </div>
        
        <div class="test-section">
          <h4>测试日志</h4>
          <div class="logs">
            <div v-for="(log, index) in logs" :key="index" :class="{'log-error': log.includes('错误')}">
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { createPinia } from 'pinia';

const router = useRouter();
const username = ref('admin');  // 默认值方便测试
const password = ref('admin123');  // 默认值方便测试
const remember = ref(true);

// 简化的登录处理逻辑
const handleLogin = () => {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码');
    return;
  }
  
  console.log('登录信息:', {
    username: username.value,
    password: password.value,
    remember: remember.value
  });
  
  alert('登录成功');
  router.push('/comprehensive/dashboard');
};

const forgotPassword = () => {
  alert('忘记密码功能暂未实现');
};

// ===================== 测试功能 =====================
// 测试状态存储
const useTestStore = defineStore('test', {
  state: () => ({
    counter: 0,
    lastUpdated: null
  }),
  actions: {
    increment() {
      this.counter++;
      this.lastUpdated = new Date().toISOString();
    }
  }
});

// 测试相关的变量
const logs = ref([]);
const isPiniaAvailable = ref(false);
const isSharedAvailable = ref(false);
const notificationCount = ref(0);

// 创建本地测试存储，确保测试能正常工作
const localPinia = createPinia();
const testStore = useTestStore(localPinia);

// 添加日志
function addLog(message) {
  const timestamp = new Date().toLocaleTimeString();
  logs.value.unshift(`${timestamp}: ${message}`);
}

// 测试逻辑
function runTest() {
  addLog('开始测试...');
  
  // 测试Pinia
  try {
    isPiniaAvailable.value = window.__pinia !== undefined;
    addLog(`Pinia全局实例: ${isPiniaAvailable.value ? '可用' : '不可用'}`);
    
    // 检查本地测试存储
    testStore.increment();
    addLog(`测试存储更新成功，当前计数: ${testStore.counter}`);
    
    // 测试localStorage
    localStorage.setItem('test-timestamp', Date.now().toString());
    const savedTime = localStorage.getItem('test-timestamp');
    addLog(`localStorage测试: ${savedTime ? '成功' : '失败'}`);
    
    // 尝试访问共享状态
    try {
      // 首先尝试从全局Pinia获取
      if (window.__pinia) {
        const sharedStore = window.__pinia._s.get('shared');
        if (sharedStore) {
          isSharedAvailable.value = true;
          notificationCount.value = sharedStore.globalNotifications.length;
          addLog(`共享状态存在，通知数量: ${notificationCount.value}`);
        } else {
          addLog('全局Pinia中未找到shared状态');
        }
      }
      
      // 尝试引入模块方式获取
      import('../../../../stores/shared.js').then(module => {
        const useSharedStore = module.useSharedStore;
        const store = useSharedStore();
        isSharedAvailable.value = true;
        notificationCount.value = store.globalNotifications.length;
        addLog(`通过导入获取共享状态成功，通知数量: ${notificationCount.value}`);
      }).catch(error => {
        addLog(`尝试导入shared.js失败: ${error.message}`);
      });
    } catch (error) {
      addLog(`获取共享状态出错: ${error.message}`);
    }
  } catch (error) {
    addLog(`测试过程发生错误: ${error.message}`);
  }
}

// 测试添加通知
function testAddNotification() {
  try {
    import('../../../../stores/shared.js').then(module => {
      const useSharedStore = module.useSharedStore;
      const store = useSharedStore();
      
      store.addGlobalNotification({
        title: '测试通知',
        message: '这是从登录页添加的测试通知',
        type: 'info'
      });
      
      notificationCount.value = store.globalNotifications.length;
      addLog(`成功添加通知，当前数量: ${notificationCount.value}`);
    }).catch(error => {
      addLog(`添加通知时导入shared.js失败: ${error.message}`);
    });
  } catch (error) {
    addLog(`添加通知过程发生错误: ${error.message}`);
  }
}

// 同步到共享状态
function syncToShared() {
  try {
    import('../../../../stores/shared.js').then(module => {
      const useSharedStore = module.useSharedStore;
      const store = useSharedStore();
      
      // 添加通知，包含测试存储的信息
      store.addGlobalNotification({
        title: '本地状态同步',
        message: `从登录页同步 - 当前计数: ${testStore.counter}`,
        type: 'success'
      });
      
      // 更新平台状态
      store.updatePlatformStatus('comprehensive', 'test-sync');
      
      // 获取更新后的数据
      notificationCount.value = store.globalNotifications.length;
      
      // 保存同步时间
      localStorage.setItem('last-sync', new Date().toISOString());
      
      addLog(`状态已同步，通知数量: ${notificationCount.value}`);
      
      // 在控制台展示更多数据
      console.log('共享状态完整数据:', {
        platforms: store.platformStatuses,
        notifications: store.globalNotifications,
        metaData: {
          syncTime: new Date().toISOString(),
          source: 'login-page-test'
        }
      });
    }).catch(error => {
      addLog(`同步过程中导入shared.js失败: ${error.message}`);
    });
  } catch (error) {
    addLog(`同步过程发生错误: ${error.message}`);
  }
}

// 清空日志
function clearLogs() {
  logs.value = [];
  addLog('日志已清空');
}

// 加载时自动运行一次测试
onMounted(() => {
  addLog('测试面板已加载');
  setTimeout(runTest, 1000);
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  padding: 20px;
}

.login-card {
  width: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-item label {
  font-weight: bold;
  font-size: 14px;
}

.form-item input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-button {
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
}

.login-button:hover {
  background: #40a9ff;
}

/* 测试面板样式 */
.test-panel {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.test-panel h3 {
  margin-bottom: 10px;
  color: #333;
}

.test-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.test-actions button {
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}

.test-actions button:hover {
  background: #e6e6e6;
}

.test-section {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
}

.test-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #555;
}

.logs {
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
}

.log-error {
  color: #ff4d4f;
}
</style> 