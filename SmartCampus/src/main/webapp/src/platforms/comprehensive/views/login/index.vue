<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h1 class="login-title">湘江科创基地智慧园区</h1>
        <p class="login-subtitle">综合管理平台</p>
      </div>
      
      <a-form
        :model="loginForm"
        @finish="handleSubmit"
        class="login-form"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input 
            v-model:value="loginForm.username"
            placeholder="用户名" 
            size="large"
          >
            <template #prefix><user-outlined /></template>
          </a-input>
        </a-form-item>
        
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password 
            v-model:value="loginForm.password"
            placeholder="密码" 
            size="large"
          >
            <template #prefix><lock-outlined /></template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-checkbox v-model:checked="loginForm.remember">
            记住密码
          </a-checkbox>
          <a class="login-form-forgot" href="">
            忘记密码
          </a>
        </a-form-item>
        
        <a-form-item>
          <a-button 
            type="primary" 
            html-type="submit" 
            class="login-form-button"
            :loading="loading"
            size="large"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
      
      <!-- 测试功能区 -->
      <div class="quick-login">
        <a-space direction="vertical" style="width: 100%">
          <a-button type="link" @click="quickLogin">快速登录(测试用)</a-button>
          <a-divider style="margin: 8px 0" />
          <div class="debug-buttons">
            <a-button type="link" size="small" @click="checkAuthStatus">检查登录状态</a-button>
            <a-button type="link" size="small" @click="forceLogin">强制登录</a-button>
            <a-button type="link" size="small" @click="clearLogin">清除登录</a-button>
          </div>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { 
  setToken, 
  setUserInfo,
  clearAuth,
  isLoggedIn
} from '../../../../core/utils/auth';

const router = useRouter();
const loading = ref(false);

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
});

const handleSubmit = (values) => {
  loading.value = true;
  
  // 模拟登录请求
  setTimeout(() => {
    if (values.username && values.password) {
      // 登录成功，设置认证状态
      setToken('mock-jwt-token-' + Date.now()); // 设置一个模拟的 token
      setUserInfo({
        username: values.username,
        roles: ['admin'],
        permissions: ['dashboard:view', 'service:view']
      });
      
      message.success('登录成功');
      
      // 登录成功后跳转到工作门户
      router.push('/comprehensive/dashboard');
    } else {
      message.error('登录失败，请检查用户名和密码');
    }
    loading.value = false;
  }, 1000);
};

// 快速测试登录功能
const quickLogin = () => {
  loading.value = true;
  
  setTimeout(() => {
    // 设置登录状态
    setToken('mock-jwt-token-' + Date.now()); // 设置一个模拟的 token
    setUserInfo({
      username: 'admin',
      roles: ['admin'],
      permissions: ['dashboard:view', 'service:view']
    });
    
    message.success('测试登录成功');
    
    // 跳转到工作门户
    router.push('/comprehensive/dashboard');
    
    loading.value = false;
  }, 500);
};

// 调试功能
const checkAuthStatus = () => {
  const status = isLoggedIn();
  console.log('认证状态诊断:', status);
  message.info(`当前登录状态: ${status ? '已登录' : '未登录'}`);
};

const forceLogin = () => {
  setToken('mock-jwt-token-' + Date.now()); // 设置一个模拟的 token
  setUserInfo({
    username: 'admin',
    roles: ['admin'],
    permissions: ['dashboard:view', 'service:view']
  });
  message.success('已强制设置为登录状态');
};

const clearLogin = () => {
  clearAuth();
  message.warning('已清除登录状态');
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0F2645 0%, #1A3A67 100%);
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 1000px;
  height: 1000px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(46, 106, 230, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.login-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(76, 187, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  transform: translate(30%, 30%);
  pointer-events: none;
}

.login-form-wrapper {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  z-index: 1;
  animation: fadeIn 0.5s ease;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  color: #0F2645;
  font-size: 24px;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #4A4A4A;
  font-size: 16px;
}

.login-form {
  width: 100%;
}

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  margin-top: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.quick-login {
  text-align: center;
  margin-top: 20px;
}

.debug-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 5px;
  font-size: 12px;
}
</style> 