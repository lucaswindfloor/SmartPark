<template>
  <div class="messages-page">
    <a-card title="我的消息" class="messages-card">
      <template #title>
        <div class="card-title">
          <BellOutlined /> 我的消息
          <a-badge :count="unreadCount" :dot="false" :overflow-count="99" style="margin-left: 8px" />
        </div>
      </template>
      <template #extra>
        <a-space>
          <a-button type="primary" size="small" @click="markAllAsRead" :disabled="unreadCount === 0">
            全部标为已读
          </a-button>
          <a-button size="small" @click="refreshMessages">
            <ReloadOutlined />
          </a-button>
        </a-space>
      </template>

      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <a-tab-pane key="all" tab="全部消息"></a-tab-pane>
        <a-tab-pane key="unread" tab="未读消息"></a-tab-pane>
        <a-tab-pane key="read" tab="已读消息"></a-tab-pane>
      </a-tabs>

      <a-list
        :loading="loading"
        :data-source="filteredMessages"
        :pagination="pagination"
        class="message-list"
      >
        <template #renderItem="{ item }">
          <a-list-item :class="{ 'unread-message': !item.isRead }">
            <a-list-item-meta :description="item.createTime">
              <template #title>
                <div class="message-title" @click="viewMessage(item)">
                  {{ item.title }}
                  <a-badge status="processing" text="" v-if="!item.isRead" style="margin-left: 8px" />
                </div>
              </template>
              <template #avatar>
                <a-avatar :style="{ backgroundColor: getMessageTypeColor(item.type) }">
                  <template #icon>
                    <NotificationOutlined v-if="item.type === 'NOTIFICATION'" />
                    <MailOutlined v-else-if="item.type === 'SYSTEM'" />
                    <MessageOutlined v-else />
                  </template>
                </a-avatar>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button type="link" @click="viewMessage(item)">
                查看
              </a-button>
              <a-button type="link" @click="deleteMessage(item.id)" danger>
                删除
              </a-button>
            </template>
          </a-list-item>
        </template>
        <template #empty>
          <a-empty :description="emptyText" />
        </template>
      </a-list>
    </a-card>

    <!-- 消息详情对话框 -->
    <a-modal
      v-model:visible="messageDetailVisible"
      :title="currentMessage.title"
      :footer="null"
      width="700px"
    >
      <div class="message-meta">
        <span><ClockCircleOutlined /> {{ currentMessage.createTime }}</span>
        <a-divider type="vertical" />
        <span>{{ getMessageTypeText(currentMessage.type) }}</span>
      </div>
      <a-divider />
      <div class="message-content" v-html="currentMessage.content"></div>
      <a-divider />
      <div class="message-actions">
        <a-space>
          <a-button @click="messageDetailVisible = false">关闭</a-button>
          <a-button type="primary" @click="handleMessageAction(currentMessage)" v-if="currentMessage.actionUrl">
            {{ currentMessage.actionText || '查看详情' }}
          </a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  BellOutlined,
  ReloadOutlined,
  NotificationOutlined,
  MessageOutlined,
  MailOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue';
import { useMessageStore } from '../../../../stores/message';

// 路由
const router = useRouter();

// 消息Store
const messageStore = useMessageStore();

// 响应式状态
const loading = ref(false);
const messages = ref([]);
const activeTab = ref('all');
const unreadCount = ref(0);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (page) => {
    pagination.current = page;
    fetchMessages();
  },
  showTotal: (total) => `共 ${total} 条消息`
});
const messageDetailVisible = ref(false);
const currentMessage = ref({});

// 计算属性 - 根据当前选项卡过滤消息
const filteredMessages = computed(() => {
  if (activeTab.value === 'all') {
    return messages.value;
  } else if (activeTab.value === 'unread') {
    return messages.value.filter(msg => !msg.isRead);
  } else if (activeTab.value === 'read') {
    return messages.value.filter(msg => msg.isRead);
  }
  return messages.value;
});

// 计算属性 - 空消息提示文本
const emptyText = computed(() => {
  if (activeTab.value === 'all') {
    return '暂无消息';
  } else if (activeTab.value === 'unread') {
    return '暂无未读消息';
  } else if (activeTab.value === 'read') {
    return '暂无已读消息';
  }
  return '暂无消息';
});

// 获取消息列表
const fetchMessages = async () => {
  loading.value = true;
  try {
    const result = await messageStore.getMessages({
      page: pagination.current,
      pageSize: pagination.pageSize,
      status: activeTab.value === 'all' ? '' : activeTab.value
    });
    
    messages.value = result.list || [];
    pagination.total = result.total || 0;
    unreadCount.value = result.unreadCount || 0;
  } catch (error) {
    message.error('获取消息失败');
  } finally {
    loading.value = false;
  }
};

// 刷新消息列表
const refreshMessages = () => {
  pagination.current = 1;
  fetchMessages();
};

// 处理标签页变化
const handleTabChange = () => {
  pagination.current = 1;
  fetchMessages();
};

// 查看消息详情
const viewMessage = async (item) => {
  currentMessage.value = item;
  messageDetailVisible.value = true;
  
  // 如果消息未读，则标记为已读
  if (!item.isRead) {
    try {
      await messageStore.markMessageAsRead(item.id);
      
      // 更新本地消息状态
      const index = messages.value.findIndex(msg => msg.id === item.id);
      if (index !== -1) {
        messages.value[index].isRead = true;
      }
      
      // 更新未读数量
      unreadCount.value -= 1;
    } catch (error) {
      console.error('标记消息已读失败', error);
    }
  }
};

// 处理消息动作
const handleMessageAction = (item) => {
  if (item.actionUrl) {
    if (item.actionType === 'INTERNAL') {
      // 内部链接，使用路由跳转
      router.push(item.actionUrl);
      messageDetailVisible.value = false;
    } else {
      // 外部链接，新窗口打开
      window.open(item.actionUrl, '_blank');
    }
  }
};

// 标记所有消息为已读
const markAllAsRead = async () => {
  if (unreadCount.value === 0) return;
  
  try {
    await messageStore.markAllMessagesAsRead();
    message.success('已将所有消息标记为已读');
    
    // 更新本地消息状态
    messages.value.forEach(msg => {
      msg.isRead = true;
    });
    
    // 更新未读数量
    unreadCount.value = 0;
  } catch (error) {
    message.error('操作失败，请稍后重试');
  }
};

// 删除消息
const deleteMessage = async (id) => {
  try {
    await messageStore.deleteMessage(id);
    message.success('删除成功');
    
    // 从列表中移除该消息
    const index = messages.value.findIndex(msg => msg.id === id);
    if (index !== -1) {
      const isUnread = !messages.value[index].isRead;
      messages.value.splice(index, 1);
      pagination.total -= 1;
      
      // 如果删除的是未读消息，需要更新未读数量
      if (isUnread) {
        unreadCount.value -= 1;
      }
    }
  } catch (error) {
    message.error('删除失败，请稍后重试');
  }
};

// 获取消息类型对应的颜色
const getMessageTypeColor = (type) => {
  const colorMap = {
    'NOTIFICATION': '#1890ff',
    'SYSTEM': '#52c41a',
    'PERSONAL': '#722ed1'
  };
  return colorMap[type] || '#1890ff';
};

// 获取消息类型文本
const getMessageTypeText = (type) => {
  const typeMap = {
    'NOTIFICATION': '通知消息',
    'SYSTEM': '系统消息',
    'PERSONAL': '个人消息'
  };
  return typeMap[type] || '消息';
};

// 监听路由变化，如果携带了消息ID参数，则显示该消息详情
watch(() => router.currentRoute.value.query.messageId, (newVal) => {
  if (newVal) {
    const id = parseInt(newVal);
    const targetMessage = messages.value.find(msg => msg.id === id);
    if (targetMessage) {
      viewMessage(targetMessage);
    } else {
      // 如果消息不在当前列表中，尝试重新获取消息列表
      refreshMessages();
    }
  }
}, { immediate: true });

// 组件挂载时获取消息列表
onMounted(() => {
  fetchMessages();
});
</script>

<style scoped>
.messages-page {
  max-width: 900px;
  margin: 0 auto;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.messages-card {
  border-radius: 8px;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 
              0 3px 6px 0 rgba(0, 0, 0, 0.12), 
              0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.message-list {
  margin-top: 16px;
}

.message-title {
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  transition: color 0.3s;
}

.message-title:hover {
  color: #1890ff;
}

.unread-message {
  background-color: #f0f7ff;
}

.message-meta {
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 16px;
}

.message-content {
  font-size: 14px;
  line-height: 1.8;
  margin: 16px 0;
  max-height: 400px;
  overflow-y: auto;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style> 