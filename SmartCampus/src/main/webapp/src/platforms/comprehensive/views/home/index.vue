<template>
  <div class="home-container">
    <a-result
      status="info"
      title="综合管理平台首页"
      sub-title="欢迎使用智慧园区综合管理平台"
    >
      <template #extra>
        <a-button type="primary" @click="goToDashboard">进入工作门户</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToDashboard() {
  router.push('/comprehensive/dashboard');
}
</script>

<style scoped>
.home-container {
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
}
</style> 
