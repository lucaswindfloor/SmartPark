<template>
  <div class="platform-selector">
    <div class="selector-container">
      <h1 class="title">湘江科创基地智慧园区</h1>
      <p class="subtitle">请选择您需要进入的平台</p>
      
      <div class="platform-cards">
        <div class="platform-card" @click="navigateToPlatform('comprehensive')">
          <div class="card-icon">
            <dashboard-outlined />
          </div>
          <div class="card-content">
            <div class="platform-title">综合管理平台</div>
            <div class="platform-description">园区管理人员使用的综合管理系统</div>
          </div>
        </div>
        
        <div class="platform-card" @click="navigateToPlatform('public-service')">
          <div class="card-icon">
            <customer-service-outlined />
          </div>
          <div class="card-content">
            <div class="platform-title">公共服务平台</div>
            <div class="platform-description">园区企业及用户使用的公共服务平台</div>
          </div>
        </div>
        
        <div class="platform-card" @click="navigateToPlatform('system-admin')">
          <div class="card-icon">
            <setting-outlined />
          </div>
          <div class="card-content">
            <div class="platform-title">系统管理员平台</div>
            <div class="platform-description">系统管理员使用的运维管理平台</div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>©2024 智慧园区管理系统</p>
      </div>
    </div>
  </div>
</template>

<script>
import { DashboardOutlined, CustomerServiceOutlined, SettingOutlined } from '@ant-design/icons-vue';

export default {
  name: 'PlatformSelector',
  components: {
    DashboardOutlined,
    CustomerServiceOutlined,
    SettingOutlined
  },
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
.platform-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.selector-container {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 50px;
  max-width: 900px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  color: #1a237e;
  margin-bottom: 20px;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 40px;
}

.platform-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
}

.platform-card {
  display: flex;
  width: 100%;
  max-width: 320px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eaeaea;
  text-align: left;
}

.platform-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: #1890ff;
}

.card-icon {
  font-size: 2.5rem;
  color: #1890ff;
  margin-right: 20px;
  display: flex;
  align-items: center;
}

.card-content {
  flex: 1;
}

.platform-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.platform-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.footer {
  margin-top: 30px;
  color: #999;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .platform-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .selector-container {
    padding: 30px 20px;
  }
  
  .title {
    font-size: 2rem;
  }
}
</style> 