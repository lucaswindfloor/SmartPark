<template>
  <div class="mobile-notification-detail">
    <div class="header-area" :class="{ 'important': notification.importance === 'HIGH' }">
      <div class="back-button" @click="goBack">
        <left-outlined />
      </div>
      <div class="title-area">
        <h1 class="title">{{ notification.title }}</h1>
        <div class="meta">
          <span class="publish-time">{{ formatDate(notification.publishTime) }}</span>
          <span class="divider">|</span>
          <span class="publisher">{{ notification.publisherName }}</span>
          <span class="divider">|</span>
          <span class="read-count">阅读 {{ notification.readCount || 0 }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <a-spin tip="加载中..." />
    </div>
    
    <template v-else>
      <div class="content-area">
        <!-- 通知标签区域 -->
        <div class="tags-area" v-if="hasAnyTag">
          <a-tag v-if="notification.isNew" color="blue">新</a-tag>
          <a-tag v-if="notification.importance === 'HIGH'" color="red">重要</a-tag>
          <a-tag v-else-if="notification.importance === 'MEDIUM'" color="orange">提醒</a-tag>
          <a-tag v-if="notification.requireConfirmation && !notification.isConfirmed" color="green">
            需要确认
          </a-tag>
        </div>
        
        <!-- 通知内容 -->
        <div class="content" v-html="notification.content" ref="contentRef"></div>
        
        <!-- 附件区域 -->
        <div class="attachments-area" v-if="hasAttachments">
          <div class="section-title">
            <paper-clip-outlined />
            <span>附件</span>
          </div>
          <a-list size="small" :data-source="notification.attachments">
            <template #renderItem="{ item }">
              <a-list-item>
                <div class="attachment-item">
                  <file-outlined />
                  <a class="attachment-name" @click="downloadAttachment(item)">
                    {{ item.fileName }}
                  </a>
                  <span class="attachment-size">({{ formatFileSize(item.fileSize) }})</span>
                </div>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
      
      <!-- 确认区域 -->
      <div class="confirmation-area" v-if="notification.requireConfirmation && !notification.isConfirmed">
        <div class="confirmation-info">
          <clock-circle-outlined />
          <span>确认截止时间: {{ formatDate(notification.confirmationDeadline) }}</span>
        </div>
        <a-button 
          type="primary" 
          block 
          size="large"
          :loading="confirmLoading"
          @click="confirmNotification"
        >
          我已阅读并确认
        </a-button>
      </div>
      
      <!-- 已确认提示 -->
      <div class="confirmation-area confirmed" v-else-if="notification.requireConfirmation && notification.isConfirmed">
        <div class="confirmation-info">
          <check-circle-outlined />
          <span>您已于 {{ formatDate(notification.confirmTime) }} 确认此通知</span>
        </div>
      </div>
      
      <!-- 底部分享区域 -->
      <div class="share-area">
        <a-divider>分享</a-divider>
        <div class="share-buttons">
          <a-button class="share-button" shape="circle" @click="shareToWeChat">
            <wechat-outlined />
          </a-button>
          <a-button class="share-button" shape="circle" @click="copyLink">
            <link-outlined />
          </a-button>
          <a-button class="share-button" shape="circle" @click="toggleAccessibilityMode">
            <sound-outlined />
          </a-button>
        </div>
      </div>
    </template>
    
    <!-- 无障碍阅读模式 -->
    <a-drawer
      title="无障碍阅读模式"
      placement="bottom"
      :visible="accessibilityModeVisible"
      height="100%"
      @close="accessibilityModeVisible = false"
    >
      <div class="accessibility-mode">
        <div class="controls">
          <a-button-group>
            <a-button @click="decreaseFontSize">
              <font-size-outlined /> 缩小字体
            </a-button>
            <a-button @click="increaseFontSize">
              <font-size-outlined /> 放大字体
            </a-button>
          </a-button-group>
          <a-button @click="readAloud">
            <sound-outlined /> 朗读内容
          </a-button>
        </div>
        <div 
          class="accessible-content" 
          :style="{ fontSize: `${accessibilityFontSize}px` }"
          v-html="plainTextContent"
        ></div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import { 
  LeftOutlined, 
  PaperClipOutlined, 
  FileOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  WechatOutlined,
  LinkOutlined,
  SoundOutlined,
  FontSizeOutlined
} from '@ant-design/icons-vue';
import mobileNotificationApi from '@/platforms/public-service/api/mobile-notification.api';
import { htmlToText } from '@/core/utils/html-utils';
import { formatDate, formatFileSize } from '@/core/utils/formatter';

export default {
  name: 'MobileNotificationDetail',
  components: {
    LeftOutlined,
    PaperClipOutlined,
    FileOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    WechatOutlined,
    LinkOutlined,
    SoundOutlined,
    FontSizeOutlined
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const contentRef = ref(null);
    
    // 加载状态
    const loading = ref(true);
    const confirmLoading = ref(false);
    
    // 通知数据
    const notification = reactive({
      id: 0,
      title: '',
      content: '',
      publishTime: '',
      publisherName: '',
      importance: 'NORMAL',
      isNew: false,
      requireConfirmation: false,
      isConfirmed: false,
      confirmationDeadline: '',
      confirmTime: '',
      attachments: [],
      readCount: 0
    });
    
    // 无障碍模式相关状态
    const accessibilityModeVisible = ref(false);
    const accessibilityFontSize = ref(18);
    
    // 纯文本内容（用于无障碍模式）
    const plainTextContent = computed(() => {
      return notification.content ? htmlToText(notification.content) : '';
    });
    
    // 是否有任何标签
    const hasAnyTag = computed(() => {
      return notification.isNew || 
        notification.importance !== 'NORMAL' || 
        (notification.requireConfirmation && !notification.isConfirmed);
    });
    
    // 是否有附件
    const hasAttachments = computed(() => {
      return notification.attachments && notification.attachments.length > 0;
    });
    
    // 获取通知详情
    const fetchNotificationDetail = async () => {
      try {
        loading.value = true;
        const notificationId = route.params.id;
        
        if (!notificationId) {
          throw new Error('通知ID不能为空');
        }
        
        const response = await mobileNotificationApi.getNotificationDetail(notificationId);
        
        if (response.success && response.data) {
          Object.assign(notification, response.data);
        } else {
          throw new Error(response.message || '获取通知详情失败');
        }
      } catch (error) {
        console.error('获取通知详情失败:', error);
        notification.error({
          message: '获取通知详情失败',
          description: error.message || '请稍后重试'
        });
      } finally {
        loading.value = false;
      }
    };
    
    // 确认通知
    const confirmNotification = async () => {
      try {
        confirmLoading.value = true;
        const response = await mobileNotificationApi.confirmNotification(notification.id);
        
        if (response.success) {
          notification.isConfirmed = true;
          notification.confirmTime = new Date().toISOString();
          
          notification.success({
            message: '确认成功',
            description: '您已成功确认此通知'
          });
        } else {
          throw new Error(response.message || '确认通知失败');
        }
      } catch (error) {
        console.error('确认通知失败:', error);
        notification.error({
          message: '确认通知失败',
          description: error.message || '请稍后重试'
        });
      } finally {
        confirmLoading.value = false;
      }
    };
    
    // 下载附件
    const downloadAttachment = (attachment) => {
      window.open(attachment.fileUrl, '_blank');
    };
    
    // 分享到微信
    const shareToWeChat = () => {
      // 调用微信分享API
      if (window.wx) {
        window.wx.ready(() => {
          window.wx.updateAppMessageShareData({
            title: notification.title,
            desc: plainTextContent.value.substring(0, 50) + '...',
            link: window.location.href,
            imgUrl: notification.thumbnailUrl || 'https://smartcampus.com/logo.png',
            success: function() {
              notification.success({
                message: '分享准备完成',
                description: '请点击微信分享按钮完成分享'
              });
            }
          });
        });
      } else {
        notification.warning({
          message: '分享功能暂不可用',
          description: '请在微信环境中使用分享功能'
        });
      }
    };
    
    // 复制链接
    const copyLink = () => {
      const url = window.location.href;
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.value = url;
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      
      notification.success({
        message: '复制成功',
        description: '链接已复制到剪贴板'
      });
    };
    
    // 切换无障碍阅读模式
    const toggleAccessibilityMode = () => {
      accessibilityModeVisible.value = !accessibilityModeVisible.value;
    };
    
    // 增大字体
    const increaseFontSize = () => {
      if (accessibilityFontSize.value < 32) {
        accessibilityFontSize.value += 2;
      }
    };
    
    // 减小字体
    const decreaseFontSize = () => {
      if (accessibilityFontSize.value > 14) {
        accessibilityFontSize.value -= 2;
      }
    };
    
    // 朗读内容
    const readAloud = () => {
      if ('speechSynthesis' in window) {
        const text = plainTextContent.value;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        
        // 停止之前的朗读
        window.speechSynthesis.cancel();
        
        // 开始朗读
        window.speechSynthesis.speak(utterance);
        
        notification.success({
          message: '正在朗读',
          description: '内容朗读已开始'
        });
      } else {
        notification.warning({
          message: '朗读功能不可用',
          description: '您的浏览器不支持语音合成功能'
        });
      }
    };
    
    // 返回上一页
    const goBack = () => {
      router.back();
    };
    
    // 页面加载完成后获取通知详情
    onMounted(() => {
      fetchNotificationDetail();
      
      // 添加图片点击事件，实现查看大图功能
      if (contentRef.value) {
        contentRef.value.addEventListener('click', handleImageClick);
      }
    });
    
    // 处理图片点击事件
    const handleImageClick = (event) => {
      const target = event.target;
      if (target.tagName === 'IMG') {
        const imgSrc = target.getAttribute('src');
        if (imgSrc) {
          // 打开图片预览
          // 这里可以根据实际情况使用图片预览组件
          window.open(imgSrc, '_blank');
        }
      }
    };
    
    // 组件销毁时
    onUnmounted(() => {
      // 停止朗读
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      
      // 移除事件监听
      if (contentRef.value) {
        contentRef.value.removeEventListener('click', handleImageClick);
      }
    });
    
    return {
      notification,
      loading,
      confirmLoading,
      contentRef,
      hasAnyTag,
      hasAttachments,
      accessibilityModeVisible,
      accessibilityFontSize,
      plainTextContent,
      formatDate,
      formatFileSize,
      confirmNotification,
      downloadAttachment,
      shareToWeChat,
      copyLink,
      toggleAccessibilityMode,
      increaseFontSize,
      decreaseFontSize,
      readAloud,
      goBack
    };
  }
};
</script>

<style scoped>
.mobile-notification-detail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header-area {
  background-color: #fff;
  padding: 20px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-area.important {
  background-color: #fff2f0;
  border-bottom: 1px solid #ffccc7;
}

.back-button {
  font-size: 20px;
  margin-bottom: 12px;
  cursor: pointer;
}

.title-area {
  padding-bottom: 10px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 12px 0;
  color: #333;
}

.meta {
  font-size: 14px;
  color: #999;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.divider {
  margin: 0 8px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.content-area {
  flex: 1;
  background-color: #fff;
  padding: 16px;
  margin: 12px 0;
}

.tags-area {
  margin-bottom: 16px;
}

.content {
  line-height: 1.6;
  font-size: 16px;
  color: #333;
}

.content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 12px 0;
}

.content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  overflow-x: auto;
  display: block;
}

.content :deep(td), .content :deep(th) {
  border: 1px solid #e8e8e8;
  padding: 8px;
  text-align: left;
}

.content :deep(a) {
  color: #1890ff;
  text-decoration: none;
}

.attachments-area {
  margin-top: 24px;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.section-title span {
  margin-left: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.attachment-name {
  margin-left: 8px;
  color: #1890ff;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-size {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
}

.confirmation-area {
  background-color: #fff;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 0;
}

.confirmation-area.confirmed {
  background-color: #f6ffed;
  border-top: 1px solid #b7eb8f;
}

.confirmation-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.confirmation-info span {
  margin-left: 8px;
}

.share-area {
  padding: 16px;
  margin-bottom: 24px;
}

.share-buttons {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.share-button {
  font-size: 20px;
}

.accessibility-mode {
  padding: 16px;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.accessible-content {
  line-height: 1.8;
  letter-spacing: 0.05em;
  white-space: pre-wrap;
}
</style>
</code_block_to_apply_changes_from>