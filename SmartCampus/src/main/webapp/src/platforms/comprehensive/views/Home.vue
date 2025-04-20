<template>
  <div class="home-container">
    <el-result
      icon="info"
      title="综合管理平台首页"
      sub-title="欢迎使用智慧园区综合管理平台"
    >
      <template #extra>
        <el-button type="primary" @click="goToDashboard">进入工作门户</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToDashboard() {
  router.push('/dashboard');
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