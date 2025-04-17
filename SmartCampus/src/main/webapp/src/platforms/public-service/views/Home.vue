<template>
  <div class="home-container">
    <h1>公共服务平台</h1>
    <p>欢迎使用湘江科创基地智慧园区公共服务平台</p>
    <div class="service-cards">
      <div class="card">
        <h3>信息公开</h3>
        <p>查看通知公告、政策文件和园区活动</p>
      </div>
      <div class="card">
        <h3>服务大厅</h3>
        <p>物业服务、配套服务、增值服务</p>
      </div>
      <div class="card">
        <h3>用户中心</h3>
        <p>个人信息、消息通知、申请记录</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      // 数据将在这里定义
    };
  },
  mounted() {
    // 初始化逻辑
    console.log('公共服务平台首页已加载');
  },
  methods: {
    // 方法将在这里定义
  }
};
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: var(--primary-color);
  margin-bottom: 20px;
}

.service-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: calc(33.33% - 14px);
  min-width: 250px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card h3 {
  color: var(--primary-color);
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .card {
    width: 100%;
  }
}
</style> 