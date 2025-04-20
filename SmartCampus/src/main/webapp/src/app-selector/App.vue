<template>
  <div class="platform-selector">
    <div class="selector-container">
      <h1 class="title">湘江科创基地智慧园区系统</h1>
      <div class="platform-links">
        <button class="platform-link" @click="navigateTo('comprehensive')">
          智慧园区综合管理平台
        </button>
        <button class="platform-link" @click="navigateTo('public-service')">
          公共服务平台
        </button>
        <button class="platform-link" @click="navigateTo('system-admin')">
          系统管理员平台
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 使用简单的导航函数
function navigateTo(platform) {
  if (platform === 'comprehensive') {
    // 添加一个确认对话框，防止自动跳转
    const confirmRedirect = confirm('确定要进入 "智慧园区综合管理平台" 吗？');
    if (confirmRedirect) {
      console.log('用户确认跳转到综合平台');
      window.location.href = '/comprehensive/login';
    } else {
      console.log('用户取消了跳转');
    }
  } else {
    // 其他平台暂时简单提示
    alert(`${platform}平台正在开发中，敬请期待！`);
  }
}
</script>

<style scoped>
.platform-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #1890ff, #096dd9);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.selector-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
}

.title {
  color: white;
  font-size: 32px;
  margin: 0;
}

.platform-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.platform-link {
  padding: 20px 40px;
  background: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.platform-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .platform-links {
    flex-direction: column;
  }
  
  .title {
    font-size: 28px;
  }
}
</style> 