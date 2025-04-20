<template>
  <div class="forbidden">
    <a-result
      status="403"
      title="403"
      sub-title="抱歉，您没有权限访问此页面"
    >
      <template #extra>
        <a-space>
          <a-button type="primary" @click="goHome">
            返回首页
          </a-button>
          <a-button @click="goLogin">
            重新登录
          </a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/home');
};

const goLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.forbidden {
  min-height: calc(100vh - 64px - 48px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}
</style> 