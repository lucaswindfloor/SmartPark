<template>
  <div class="notification-list">
    <a-card title="通知公告" class="list-card">
      <template #title>
        <div class="card-title">
          <NotificationOutlined /> 通知公告
        </div>
      </template>
      <template #extra>
        <a-space>
          <a-input-search 
            v-model:value="queryParams.keyword" 
            placeholder="搜索通知标题"
            style="width: 250px;"
            @search="handleSearch"
          />
          <a-select 
            v-model:value="queryParams.type" 
            style="width: 120px;" 
            placeholder="通知类型"
            @change="handleTypeChange"
          >
            <a-select-option value="">全部类型</a-select-option>
            <a-select-option value="ANNOUNCEMENT">公告</a-select-option>
            <a-select-option value="NOTICE">通知</a-select-option>
            <a-select-option value="POLICY">政策</a-select-option>
            <a-select-option value="EVENT">活动</a-select-option>
          </a-select>
        </a-space>
      </template>

      <a-list 
        :loading="loading" 
        :data-source="notifications" 
        :pagination="pagination"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta :description="getNotificationTypeText(item.type) + ' · ' + item.publishTime">
              <template #title>
                <router-link :to="`/information/detail/${item.id}`" class="notification-title">
                  {{ item.title }}
                  <a-tag v-if="item.isNew" color="green">新</a-tag>
                  <a-tag v-if="item.level === 'IMPORTANT'" color="orange">重要</a-tag>
                  <a-tag v-if="item.level === 'URGENT'" color="red">紧急</a-tag>
                </router-link>
              </template>
              <template #avatar>
                <a-avatar :style="{ backgroundColor: getNotificationTypeColor(item.type) }">
                  <template #icon><NotificationOutlined /></template>
                </a-avatar>
              </template>
            </a-list-item-meta>
            <template #actions>
              <span>
                <EyeOutlined /> {{ item.viewCount }}
              </span>
            </template>
            <template #extra>
              <a-button type="link" @click="viewNotification(item.id)">
                查看详情 <RightOutlined />
              </a-button>
            </template>
          </a-list-item>
        </template>
        <template #empty>
          <a-empty description="暂无通知公告" />
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { NotificationOutlined, EyeOutlined, RightOutlined } from '@ant-design/icons-vue';
import { useNotificationStore } from '../../../../stores/notification';

// 路由
const router = useRouter();

// 通知Store
const notificationStore = useNotificationStore();

// 响应式状态
const loading = ref(false);
const notifications = ref([]);
const total = ref(0);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  type: '',
  keyword: ''
});

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (page, pageSize) => {
    queryParams.pageNum = page;
    queryParams.pageSize = pageSize;
    fetchNotifications();
  },
  showTotal: (total) => `共 ${total} 条通知`
});

// 获取通知列表
const fetchNotifications = async () => {
  loading.value = true;
  try {
    const result = await notificationStore.fetchNotifications(queryParams);
    notifications.value = result.list || [];
    total.value = result.total || 0;
    pagination.total = result.total || 0;
  } catch (error) {
    message.error('获取通知列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = () => {
  queryParams.pageNum = 1;
  fetchNotifications();
};

// 类型选择处理
const handleTypeChange = () => {
  queryParams.pageNum = 1;
  fetchNotifications();
};

// 查看通知
const viewNotification = (id) => {
  router.push(`/information/detail/${id}`);
};

// 获取通知类型文本
const getNotificationTypeText = (type) => {
  const typeMap = {
    'ANNOUNCEMENT': '公告',
    'NOTICE': '通知',
    'POLICY': '政策',
    'EVENT': '活动',
    'SURVEY': '问卷'
  };
  return typeMap[type] || '通知';
};

// 获取通知类型对应的颜色
const getNotificationTypeColor = (type) => {
  const colorMap = {
    'ANNOUNCEMENT': '#1890ff',
    'NOTICE': '#52c41a',
    'POLICY': '#722ed1',
    'EVENT': '#faad14',
    'SURVEY': '#eb2f96'
  };
  return colorMap[type] || '#1890ff';
};

// 组件挂载时获取通知列表
onMounted(() => {
  fetchNotifications();
});
</script>

<style scoped>
.notification-list {
  background-color: #f0f2f5;
}

.list-card {
  border-radius: 8px;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 
              0 3px 6px 0 rgba(0, 0, 0, 0.12), 
              0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-title {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  transition: color 0.3s;
}

.notification-title:hover {
  color: #1890ff;
}
</style> 