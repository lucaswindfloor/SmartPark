<template>
  <div class="notification-detail">
    <a-page-header
      title="通知详情"
      :backIcon="true"
      @back="goBack"
      style="background: #fff; padding: 16px; border-bottom: 1px solid #eee;"
    >
      <template #extra>
        <a-space>
          <a-button @click="printNotification">
            <PrinterOutlined /> 打印
          </a-button>
          <a-button type="primary" @click="shareNotification">
            <ShareAltOutlined /> 分享
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <div class="detail-container">
      <a-card :loading="loading" class="detail-card">
        <div v-if="notification">
          <div class="notification-header">
            <h1 class="notification-title">
              {{ notification.title }}
              <a-tag v-if="notification.level === 'IMPORTANT'" color="orange">重要</a-tag>
              <a-tag v-if="notification.level === 'URGENT'" color="red">紧急</a-tag>
            </h1>
            <div class="notification-meta">
              <span><UserOutlined /> {{ notification.publisher || '管理员' }}</span>
              <a-divider type="vertical" />
              <span><ClockCircleOutlined /> {{ notification.publishTime }}</span>
              <a-divider type="vertical" />
              <span><EyeOutlined /> {{ notification.viewCount || 0 }} 次阅读</span>
              <a-divider type="vertical" />
              <a-tag :color="getNotificationTypeColor(notification.type)">
                {{ getNotificationTypeText(notification.type) }}
              </a-tag>
            </div>
          </div>

          <a-divider style="margin: 16px 0" />

          <div class="notification-content" v-html="notification.content"></div>

          <a-divider style="margin: 16px 0" />

          <!-- 附件区域 -->
          <div class="notification-attachments" v-if="notification.attachments && notification.attachments.length > 0">
            <h3><PaperClipOutlined /> 附件</h3>
            <a-list :data-source="notification.attachments" size="small">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #title>
                      <a @click="downloadAttachment(item.id)" class="attachment-name">
                        <FileOutlined /> {{ item.name }}
                      </a>
                    </template>
                    <template #description>
                      {{ formatFileSize(item.size) }} - 上传于 {{ item.uploadTime }}
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <a-button type="link" @click="downloadAttachment(item.id)">
                      <DownloadOutlined /> 下载
                    </a-button>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>

          <!-- 需要确认阅读的通知 -->
          <div class="notification-confirm" v-if="notification.needConfirm && !notification.confirmed">
            <a-alert type="info" show-icon>
              <template #message>
                此通知需要确认已读
              </template>
              <template #description>
                <p>请仔细阅读上述内容，确认已知悉此通知的内容。</p>
                <a-button type="primary" :loading="confirmLoading" @click="confirmNotification">
                  确认已读
                </a-button>
              </template>
            </a-alert>
          </div>

          <div class="notification-confirm" v-if="notification.needConfirm && notification.confirmed">
            <a-alert type="success" show-icon>
              <template #message>
                已确认阅读
              </template>
              <template #description>
                您已于 {{ notification.confirmTime }} 确认阅读此通知
              </template>
            </a-alert>
          </div>
        </div>

        <a-empty v-else description="通知不存在或已被删除" />

        <div class="navigation-buttons">
          <a-space size="large">
            <div v-if="prevNotification">
              <span class="nav-label">上一篇</span>
              <a @click="viewNotification(prevNotification.id)" class="nav-link">
                <LeftOutlined /> {{ prevNotification.title }}
              </a>
            </div>
            <div v-else>
              <span class="nav-label">上一篇</span>
              <span class="nav-disabled">没有了</span>
            </div>

            <div v-if="nextNotification">
              <span class="nav-label">下一篇</span>
              <a @click="viewNotification(nextNotification.id)" class="nav-link">
                {{ nextNotification.title }} <RightOutlined />
              </a>
            </div>
            <div v-else>
              <span class="nav-label">下一篇</span>
              <span class="nav-disabled">没有了</span>
            </div>
          </a-space>
        </div>
      </a-card>
    </div>

    <!-- 分享对话框 -->
    <a-modal
      v-model:visible="shareVisible"
      title="分享通知"
      @ok="copyShareLink"
      :okText="copyBtnText"
      cancelText="关闭"
    >
      <p>分享链接：</p>
      <a-input
        v-model:value="shareLink"
        readonly
        ref="shareLinkInput"
      />
      <a-divider />
      <div style="text-align: center;">
        <h4>扫码分享</h4>
        <a-spin v-if="qrLoading" />
        <div v-else class="qrcode-container">
          <!-- 实际项目中应该使用真实的二维码生成组件 -->
          <div class="qrcode-placeholder"></div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { 
  PrinterOutlined, 
  ShareAltOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  EyeOutlined,
  PaperClipOutlined,
  FileOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue';
import { useNotificationStore } from '../../../../stores/notification';
import { downloadAttachment as downloadAttachmentApi } from '../../../../services/notification';

// 路由
const route = useRoute();
const router = useRouter();

// 通知Store
const notificationStore = useNotificationStore();

// 响应式状态
const loading = ref(true);
const confirmLoading = ref(false);
const notification = ref(null);
const prevNotification = ref(null);
const nextNotification = ref(null);
const shareVisible = ref(false);
const shareLink = ref('');
const copyBtnText = ref('复制');
const qrLoading = ref(false);
const shareLinkInput = ref(null);

// 获取通知ID
const notificationId = computed(() => route.params.id);

// 获取通知详情
const fetchNotificationDetail = async () => {
  loading.value = true;
  try {
    const result = await notificationStore.fetchNotificationDetail(notificationId.value);
    notification.value = result;
    
    // 模拟上下篇通知数据 - 实际应从API获取
    if (result) {
      // 这里只是模拟数据，实际项目中应该从API获取上下篇
      prevNotification.value = { id: parseInt(notificationId.value) - 1, title: '上一篇通知标题' };
      nextNotification.value = { id: parseInt(notificationId.value) + 1, title: '下一篇通知标题' };
      
      // ID小于1的不显示上一篇
      if (parseInt(notificationId.value) <= 1) {
        prevNotification.value = null;
      }
      
      // ID大于5的不显示下一篇（假设只有5条通知）
      if (parseInt(notificationId.value) >= 5) {
        nextNotification.value = null;
      }
    }
  } catch (error) {
    message.error('获取通知详情失败');
  } finally {
    loading.value = false;
  }
};

// 确认阅读通知
const confirmNotification = async () => {
  confirmLoading.value = true;
  try {
    await notificationStore.markNotificationAsRead(notificationId.value);
    message.success('已确认阅读');
    notification.value.confirmed = true;
    notification.value.confirmTime = new Date().toLocaleString();
  } catch (error) {
    message.error('确认失败，请稍后重试');
  } finally {
    confirmLoading.value = false;
  }
};

// 下载附件
const downloadAttachment = async (attachmentId) => {
  try {
    message.loading('正在下载...');
    await downloadAttachmentApi(attachmentId);
    message.success('下载成功');
  } catch (error) {
    message.error('下载失败，请稍后重试');
  }
};

// 打印通知
const printNotification = () => {
  window.print();
};

// 分享通知
const shareNotification = () => {
  shareLink.value = `${window.location.origin}/information/detail/${notificationId.value}`;
  shareVisible.value = true;
  qrLoading.value = true;
  
  // 模拟加载二维码
  setTimeout(() => {
    qrLoading.value = false;
  }, 1000);
};

// 复制分享链接
const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value);
    message.success('链接已复制到剪贴板');
    copyBtnText.value = '已复制';
    
    setTimeout(() => {
      copyBtnText.value = '复制';
    }, 2000);
  } catch (error) {
    message.error('复制失败，请手动复制');
  }
};

// 返回列表页
const goBack = () => {
  router.push('/information/list');
};

// 查看指定通知
const viewNotification = (id) => {
  router.push(`/information/detail/${id}`);
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  
  return `${bytes.toFixed(2)} ${units[i]}`;
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

// 组件挂载时获取通知详情
onMounted(() => {
  fetchNotificationDetail();
});
</script>

<style scoped>
.notification-detail {
  background-color: #f0f2f5;
  min-height: 100vh;
}

.detail-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 16px;
}

.detail-card {
  border-radius: 8px;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 
              0 3px 6px 0 rgba(0, 0, 0, 0.12), 
              0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.notification-header {
  text-align: center;
  margin-bottom: 24px;
}

.notification-title {
  font-size: 24px;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.notification-meta {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.notification-content {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.75);
}

.notification-attachments {
  margin: 20px 0;
}

.attachment-name {
  color: #1890ff;
}

.notification-confirm {
  margin: 24px 0;
}

.navigation-buttons {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.nav-label {
  display: block;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 4px;
}

.nav-link {
  color: #1890ff;
}

.nav-disabled {
  color: rgba(0, 0, 0, 0.25);
}

.qrcode-container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.qrcode-placeholder {
  width: 150px;
  height: 150px;
  background-color: #f0f0f0;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.qrcode-placeholder::after {
  content: 'QR Code';
  color: rgba(0, 0, 0, 0.45);
}

@media print {
  .detail-card {
    box-shadow: none;
  }
  
  .navigation-buttons,
  .notification-confirm {
    display: none;
  }
}
</style> 