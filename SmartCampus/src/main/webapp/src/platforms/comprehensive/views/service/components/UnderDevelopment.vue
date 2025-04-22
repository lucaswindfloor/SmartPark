<template>
  <div class="under-development">
    <div class="development-card">
      <h2>{{ title }} - 功能开发中</h2>
      <p class="subtitle">此功能模块正在开发中，敬请期待</p>
      <div class="icon">
        <i class="el-icon-loading"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '功能模块'
  }
});
</script>

<style scoped>
.under-development {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}

.development-card {
  text-align: center;
  padding: 2rem;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

h2 {
  margin-bottom: 1rem;
  color: #409eff;
}

.subtitle {
  color: #606266;
  margin-bottom: 2rem;
}

.icon {
  font-size: 4rem;
  color: #409eff;
}
</style> 