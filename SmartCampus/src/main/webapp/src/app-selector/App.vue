<template>
  <div class="platform-selector">
    <h1 class="mb-10">湘江科创基地智慧园区</h1>
    <p class="mb-20">请选择您需要进入的平台</p>
    
    <div class="platform-cards">
      <div class="platform-card" @click="navigateToPlatform('comprehensive')">
        <div class="platform-title">综合管理平台</div>
        <div class="platform-description">园区管理人员使用的综合管理系统</div>
      </div>
      
      <div class="platform-card" @click="navigateToPlatform('public-service')">
        <div class="platform-title">公共服务平台</div>
        <div class="platform-description">园区企业及用户使用的公共服务平台</div>
      </div>
      
      <div class="platform-card" @click="navigateToPlatform('system-admin')">
        <div class="platform-title">系统管理平台</div>
        <div class="platform-description">系统管理员使用的运维管理平台</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSelector',
  methods: {
    navigateToPlatform(platform) {
      // 开发模式下直接使用相应的入口文件
      const isDev = process.env.NODE_ENV === 'development';
      
      if (isDev) {
        switch (platform) {
          case 'comprehensive':
            window.location.href = '/?platform=comprehensive';
            break;
          case 'public-service':
            window.location.href = '/?platform=public-service';
            break;
          case 'system-admin':
            window.location.href = '/?platform=system-admin';
            break;
        }
      } else {
        // 生产模式下使用对应的路径
        switch (platform) {
          case 'comprehensive':
            window.location.href = '/comprehensive/';
            break;
          case 'public-service':
            window.location.href = '/public-service/';
            break;
          case 'system-admin':
            window.location.href = '/system-admin/';
            break;
        }
      }
    }
  }
}
</script>

<style scoped>
.platform-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 40px;
}

.mb-20 {
  margin-bottom: 20px;
}
</style> 