<template>
  <div class="admin-dashboard">
    <a-typography-title :level="2">工作门户</a-typography-title>
    <a-typography-paragraph>欢迎使用湘江科创基地智慧园区系统，以下是园区管理概况</a-typography-paragraph>
    
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic 
            title="园区入驻企业" 
            :value="128" 
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <team-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic 
            title="房间出租率" 
            :value="82.5" 
            suffix="%" 
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <home-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic 
            title="本月新增客户" 
            :value="24" 
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix>
              <user-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic 
            title="本月营收" 
            :value="1256789" 
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <dollar-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 24px">
      <a-col :span="24" :md="16">
        <a-card title="待办事项">
          <template #extra>
            <a-button type="link">查看全部</a-button>
          </template>
          <div v-for="(item, index) in todoItems" :key="index" 
            style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
            <a-space>
              <file-text-outlined />
              <span>{{ item.title }}</span>
            </a-space>
            <a-button type="link" size="small">处理</a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24" :md="8">
        <a-card title="快捷入口">
          <template #extra>
            <a-button type="link">自定义</a-button>
          </template>
          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            <a-button v-for="(button, index) in quickButtons" :key="index" @click="button.action">
              <template #icon><component :is="button.icon" /></template>
              {{ button.text }}
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { 
  UserOutlined, 
  HomeOutlined, 
  TeamOutlined, 
  BarChartOutlined,
  FileTextOutlined,
  DollarOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 待办事项数据
const todoItems = ref([
  {
    title: '合同【HT2024001】待审批',
    status: 'processing'
  },
  {
    title: '客户【长沙数智科技】跟进提醒',
    status: 'warning'
  },
  {
    title: '退园申请【TY2024003】待处理',
    status: 'error'
  }
]);

// 快捷按钮
const quickButtons = ref([
  {
    text: '添加客户',
    icon: TeamOutlined,
    action: () => router.push('/comprehensive/customer/add')
  },
  {
    text: '新建合同',
    icon: FileTextOutlined,
    action: () => router.push('/comprehensive/contract/create')
  },
  {
    text: '服务管理',
    icon: BarChartOutlined,
    action: () => router.push('/comprehensive/service/management')
  },
  {
    text: '房源管理',
    icon: HomeOutlined,
    action: () => router.push('/comprehensive/property')
  }
]);
</script>

<style scoped>
.admin-dashboard {
  padding: 0;
  background-color: transparent;
}

:deep(.ant-typography) {
  margin-bottom: 1em !important;
}

:deep(.ant-typography-title) {
  margin-top: 0 !important;
  margin-bottom: 12px !important;
  color: var(--dark-bg, rgba(0, 0, 0, 0.85));
  font-size: 26px !important;
}

:deep(.ant-typography-paragraph) {
  margin-bottom: 24px !important;
  color: rgba(0, 0, 0, 0.65);
  font-size: 16px;
}

:deep(.ant-card) {
  overflow: hidden;
  border-radius: var(--border-radius-sm, 8px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s, transform 0.3s;
  border: none;
}

:deep(.ant-card:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

:deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
}

:deep(.ant-card-head-title) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.ant-statistic) {
  padding: 8px 0;
}

:deep(.ant-statistic-content) {
  display: flex;
  align-items: center;
}

:deep(.ant-statistic-content-prefix) {
  margin-right: 8px;
  font-size: 20px;
}

:deep(.ant-statistic-content-value) {
  font-size: 28px !important;
  font-weight: 600;
  line-height: 1.2;
}

:deep(.ant-statistic-title) {
  font-size: 14px;
  margin-bottom: 4px !important;
  color: rgba(0, 0, 0, 0.65);
}

:deep(.ant-button-icon) {
  font-size: 16px;
}

:deep(.anticon) {
  font-size: 18px;
}
</style> 