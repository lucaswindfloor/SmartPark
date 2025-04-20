<template>
  <div class="login-container">
    <a-card 
      title="湘江科创基地智慧园区" 
      :bordered="false"
      class="login-card"
    >
      <a-tabs v-model:activeKey="activeTab" centered>
        <a-tab-pane key="1" tab="账号密码登录">
          <a-form
            :model="loginForm"
            name="account_login"
            @finish="onFinish"
            size="large"
          >
            <a-form-item
              name="username"
              :rules="[{ required: true, message: '请输入您的用户名!' }]"
            >
              <a-input v-model:value="loginForm.username" placeholder="用户名/手机号">
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            
            <a-form-item
              name="password"
              :rules="[{ required: true, message: '请输入您的密码!' }]"
            >
              <a-input-password v-model:value="loginForm.password" placeholder="密码">
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input-password>
            </a-form-item>
            
            <a-form-item>
              <a-checkbox v-model:checked="loginForm.remember">记住我</a-checkbox>
              <a class="login-form-forgot" @click="forgotPassword">忘记密码</a>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="loading" class="login-button">
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        
        <a-tab-pane key="2" tab="手机验证码登录">
          <a-form
            :model="smsForm"
            name="sms_login"
            @finish="onSmsFinish"
            size="large"
          >
            <a-form-item
              name="mobile"
              :rules="[
                { required: true, message: '请输入您的手机号!' },
                { pattern: /^1\d{10}$/, message: '请输入正确的手机号格式!' }
              ]"
            >
              <a-input v-model:value="smsForm.mobile" placeholder="手机号">
                <template #prefix>
                  <MobileOutlined />
                </template>
              </a-input>
            </a-form-item>
            
            <a-form-item
              name="smsCode"
              :rules="[{ required: true, message: '请输入短信验证码!' }]"
            >
              <a-input v-model:value="smsForm.smsCode" placeholder="短信验证码">
                <template #suffix>
                  <a-button type="link" size="small" @click="handleSendCode" :disabled="codeSending">
                    {{ codeButtonText }}
                  </a-button>
                </template>
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="loading" class="login-button">
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      
      <a-divider>或</a-divider>
      
      <a-button 
        class="visitor-button"
        @click="handleVisitorAccess"
      >
        <template #icon><GlobalOutlined /></template>
        访客浏览
      </a-button>
      
      <div class="register-link">
        <p>还没有账号？ <a @click="handleRegister">企业员工申请</a></p>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined, MobileOutlined, GlobalOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '../../../stores/user';

// 路由
const router = useRouter();

// 用户store
const userStore = useUserStore();

// 响应式状态
const activeTab = ref('1');
const loading = ref(false);
const codeSending = ref(false);
const countdown = ref(60);
const codeButtonText = ref('发送验证码');

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: true
});

const smsForm = reactive({
  mobile: '',
  smsCode: '',
  remember: true
});

// 登录处理
const onFinish = async (values) => {
  loading.value = true;
  try {
    const result = await userStore.loginAction({
      username: loginForm.username,
      password: loginForm.password
    });
    
    if (result) {
      message.success('登录成功');
      router.push('/home');
    }
  } catch (error) {
    message.error(error.message || '登录失败，请检查用户名和密码');
  } finally {
    loading.value = false;
  }
};

// 短信登录处理
const onSmsFinish = async (values) => {
  loading.value = true;
  try {
    const result = await userStore.loginAction({
      mobile: smsForm.mobile,
      smsCode: smsForm.smsCode,
      type: 'sms'
    });
    
    if (result) {
      message.success('登录成功');
      router.push('/home');
    }
  } catch (error) {
    message.error(error.message || '登录失败，请检查验证码');
  } finally {
    loading.value = false;
  }
};

// 发送验证码
const handleSendCode = async () => {
  if (!smsForm.mobile) {
    message.error('请输入手机号码');
    return;
  }
  
  if (!/^1\d{10}$/.test(smsForm.mobile)) {
    message.error('请输入正确的手机号格式');
    return;
  }
  
  try {
    codeSending.value = true;
    // 调用发送验证码的接口
    // await sendVerificationCode(smsForm.mobile);
    message.success('验证码已发送，请注意查收');
    
    // 开始倒计时
    startCountdown();
  } catch (error) {
    message.error(error.message || '验证码发送失败');
    codeSending.value = false;
  }
};

// 倒计时处理
const startCountdown = () => {
  countdown.value = 60;
  codeButtonText.value = `${countdown.value}秒后重发`;
  
  const timer = setInterval(() => {
    countdown.value--;
    codeButtonText.value = `${countdown.value}秒后重发`;
    
    if (countdown.value <= 0) {
      clearInterval(timer);
      codeSending.value = false;
      codeButtonText.value = '发送验证码';
    }
  }, 1000);
};

// 访客访问
const handleVisitorAccess = () => {
  router.push('/home');
  message.info('正在以访客模式浏览');
};

// 忘记密码
const forgotPassword = () => {
  message.info('请联系园区管理员重置密码');
};

// 注册申请
const handleRegister = () => {
  message.info('请联系园区管理员申请账号');
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}

.login-card {
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-card :deep(.ant-card-head) {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.login-form-forgot {
  float: right;
}

.login-button {
  width: 100%;
}

.visitor-button {
  width: 100%;
  margin-bottom: 16px;
}

.register-link {
  margin-top: 16px;
  text-align: center;
}
</style>