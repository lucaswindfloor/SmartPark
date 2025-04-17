<template>
  <div class="home-container">
    <h1>综合管理平台</h1>
    <p>欢迎使用湘江科创基地智慧园区综合管理平台</p>
    <div class="dashboard-cards">
      <div class="card">
        <h3>工作门户</h3>
        <p>查看工作概览和待办事项</p>
      </div>
      <div class="card">
        <h3>招商管理</h3>
        <p>客户和合同管理</p>
      </div>
      <div class="card">
        <h3>运营管理</h3>
        <p>企业和空间管理</p>
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
    console.log('综合管理平台首页已加载');
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
}

h1 {
  color: var(--primary-color);
  margin-bottom: 20px;
}

.dashboard-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: calc(33.33% - 14px);
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