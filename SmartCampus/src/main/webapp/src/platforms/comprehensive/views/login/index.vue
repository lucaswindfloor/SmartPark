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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
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
  router.push('/dashboard');
};

const forgotPassword = () => {
  alert('忘记密码功能暂未实现');
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
}

.login-card {
  width: 400px;
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
</style> 