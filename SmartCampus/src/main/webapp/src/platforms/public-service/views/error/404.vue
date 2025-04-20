<template>
  <div class="not-found">
    <a-result
      status="404"
      title="404"
      sub-title="抱歉，您访问的页面不存在"
    >
      <template #extra>
        <a-button type="primary" @click="goHome">
          返回首页
        </a-button>
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
</script>

<style scoped>
.not-found {
  min-height: calc(100vh - 64px - 48px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}
</style> 