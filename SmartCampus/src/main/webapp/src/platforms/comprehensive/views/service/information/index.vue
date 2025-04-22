<template>
  <div class="information-management">
    <el-breadcrumb class="mb-4">
      <el-breadcrumb-item :to="{ path: '/comprehensive' }">
        <el-icon><HomeFilled /></el-icon>
      </el-breadcrumb-item>
      <el-breadcrumb-item>服务管理</el-breadcrumb-item>
      <el-breadcrumb-item>信息公开</el-breadcrumb-item>
      <el-breadcrumb-item>{{ getActiveTabName }}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="information-content">
      <el-tabs v-model="activeTab" type="card" @tab-change="handleTabChange">
        <el-tab-pane label="通知公告" name="notification"></el-tab-pane>
        <el-tab-pane label="政策文件" name="policy"></el-tab-pane>
        <el-tab-pane label="园区活动" name="activity"></el-tab-pane>
        <el-tab-pane label="调查问卷" name="survey"></el-tab-pane>
        <el-tab-pane label="需求发布" name="demand"></el-tab-pane>
      </el-tabs>
      
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { HomeFilled } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const activeTab = ref('notification');

// 根据当前路径获取活动标签名称
const getActiveTabName = computed(() => {
  const tabMap = {
    'notification': '通知公告',
    'policy': '政策文件',
    'activity': '园区活动',
    'survey': '调查问卷',
    'demand': '需求发布'
  };
  return tabMap[activeTab.value] || '通知公告';
});

// 从路由获取活动标签
const getActiveTabFromPath = () => {
  const path = route.path;
  if (path.includes('/policy')) return 'policy';
  if (path.includes('/activity')) return 'activity';
  if (path.includes('/survey')) return 'survey';
  if (path.includes('/demand')) return 'demand';
  if (path.includes('/notification')) return 'notification';
  return 'notification'; // 默认为通知公告
};

// 标签页切换时导航到对应路由
const handleTabChange = (tabName) => {
  router.push(`/comprehensive/service/information/${tabName}`);
};

// 页面加载时设置当前激活的标签页
onMounted(() => {
  const tab = getActiveTabFromPath();
  activeTab.value = tab;
  
  // 如果是根路径，默认重定向到notification
  if (route.path === '/comprehensive/service/information') {
    router.replace('/comprehensive/service/information/notification');
  }
});

// 路由变化时更新标签页
watch(
  () => route.path,
  () => {
    activeTab.value = getActiveTabFromPath();
  }
);
</script>

<style scoped>
.information-management {
  padding: 20px;
}

.information-content {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  margin-top: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.mb-4 {
  margin-bottom: 16px;
}
</style> 