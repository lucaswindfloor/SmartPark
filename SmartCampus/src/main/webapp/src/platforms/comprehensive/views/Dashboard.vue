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
            :value-style="{ color: '#1890ff' }"
            suffix="%"
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
          <a-space direction="vertical" style="width: 100%">
            <div style="display: flex; justify-content: space-between; padding: 8px 0">
              <a-space>
                <file-text-outlined />
                <span>合同【HT2024001】待审批</span>
              </a-space>
              <a-button type="link" size="small">处理</a-button>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0">
              <a-space>
                <file-text-outlined />
                <span>客户【长沙数智科技】跟进提醒</span>
              </a-space>
              <a-button type="link" size="small">处理</a-button>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0">
              <a-space>
                <file-text-outlined />
                <span>退园申请【TY2024003】待处理</span>
              </a-space>
              <a-button type="link" size="small">处理</a-button>
            </div>
          </a-space>
        </a-card>
      </a-col>
      <a-col :span="24" :md="8">
        <a-card title="快捷入口">
          <template #extra>
            <a-button type="link">自定义</a-button>
          </template>
          <a-space style="display: flex; flex-wrap: wrap; gap: 12px">
            <a-button>
              <template #icon><team-outlined /></template>
              添加客户
            </a-button>
            <a-button>
              <template #icon><file-text-outlined /></template>
              新建合同
            </a-button>
            <a-button>
              <template #icon><bar-chart-outlined /></template>
              服务管理
            </a-button>
            <a-button>
              <template #icon><home-outlined /></template>
              房源管理
            </a-button>
          </a-space>
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
</script>

<style scoped>
.admin-dashboard {
  padding: 24px;
}
</style> 