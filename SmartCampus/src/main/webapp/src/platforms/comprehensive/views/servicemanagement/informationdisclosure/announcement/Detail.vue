<template>
  <div class="notification-detail">
    <el-card :loading="loading" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="backToList">
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
          <el-button v-if="hasEditPermission" type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>

      <div v-if="!loading" class="notification-content">
        <h1 class="notification-title">{{ notification.title }}</h1>
        
        <div class="notification-meta">
          <span class="meta-item">
            <el-icon><User /></el-icon>
            <span>发布人：{{ notification.author }}</span>
          </span>
          <span class="meta-item">
            <el-icon><Clock /></el-icon>
            <span>发布时间：{{ formatDateTime(notification.publishTime) }}</span>
          </span>
          <span class="meta-item">
            <el-icon><View /></el-icon>
            <span>阅读数：{{ notification.readCount }}</span>
          </span>
          <span class="meta-item">
            <el-icon><CollectionTag /></el-icon>
            <span>类别：{{ notification.category }}</span>
          </span>
        </div>
        
        <div class="notification-body" v-html="notification.content"></div>
        
        <div v-if="notification.attachments && notification.attachments.length > 0" class="notification-attachments">
          <h3>附件列表</h3>
          <el-table :data="notification.attachments" border style="width: 100%">
            <el-table-column width="50">
              <template #default>
                <el-icon><Paperclip /></el-icon>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="文件名" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button type="primary" link @click="previewAttachment(row)">预览</el-button>
                <el-button type="primary" link @click="downloadAttachment(row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="previewVisible" title="附件预览" width="800px" :destroy-on-close="true">
      <div class="attachment-preview">
        <img v-if="currentAttachment && isImage(currentAttachment.type)" :src="currentAttachment.url" alt="附件预览" />
        <iframe v-else-if="currentAttachment && isDocument(currentAttachment.type)" :src="currentAttachment.url" width="100%" height="500px"></iframe>
        <div v-else class="preview-not-available">
          <el-icon :size="48"><Document /></el-icon>
          <p>该类型文件暂不支持预览，请下载后查看</p>
          <el-button type="primary" @click="downloadAttachment(currentAttachment)">下载文件</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Clock, 
  View, 
  CollectionTag,
  Paperclip,
  Document
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const notification = reactive({
  id: '',
  title: '',
  content: '',
  author: '',
  publishTime: '',
  readCount: 0,
  category: '',
  attachments: []
});

const previewVisible = ref(false);
const currentAttachment = ref(null);
const hasEditPermission = ref(true); // 权限控制，实际应该从用户权限中获取

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 获取通知详情
const fetchNotificationDetail = async () => {
  loading.value = true;
  
  try {
    // 这里应该是实际的API调用，以下为模拟数据
    // const { data } = await api.getNotificationDetail(route.params.id);
    
    // 模拟数据
    const data = {
      id: route.params.id || '1',
      title: '关于校园智慧系统更新的通知',
      content: `<p>尊敬的用户：</p>
                <p>我们将于2023年8月15日凌晨2:00-4:00对校园智慧系统进行更新维护，期间系统将暂停服务。</p>
                <p>本次更新内容如下：</p>
                <ul>
                  <li>优化用户界面，提升用户体验</li>
                  <li>新增移动端适配功能</li>
                  <li>修复已知问题和漏洞</li>
                </ul>
                <p>感谢您的理解与支持！</p>`,
      author: '系统管理员',
      publishTime: '2023-08-10T10:30:00',
      readCount: 1205,
      category: '系统通知',
      attachments: [
        { id: '1', name: '更新说明.pdf', type: 'application/pdf', url: 'https://example.com/files/update_instruction.pdf', size: 1024 * 1024 },
        { id: '2', name: '新功能预览.png', type: 'image/png', url: 'https://example.com/files/preview.png', size: 500 * 1024 }
      ]
    };
    
    // 更新数据
    Object.assign(notification, data);
  } catch (error) {
    console.error('获取通知详情失败:', error);
    ElMessage.error('获取通知详情失败');
  } finally {
    loading.value = false;
  }
};

// 返回列表页
const backToList = () => {
  router.push('/service/information/notification');
};

// 编辑通知
const handleEdit = () => {
  router.push(`/service/information/notification/edit/${notification.id}`);
};

// 预览附件
const previewAttachment = (attachment) => {
  currentAttachment.value = attachment;
  previewVisible.value = true;
};

// 下载附件
const downloadAttachment = (attachment) => {
  // 实际项目中应该调用下载API
  const link = document.createElement('a');
  link.href = attachment.url;
  link.download = attachment.name;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 判断是否为图片文件
const isImage = (fileType) => {
  return fileType && fileType.startsWith('image/');
};

// 判断是否为可在线预览的文档
const isDocument = (fileType) => {
  const previewableTypes = ['application/pdf', 'text/plain', 'text/html'];
  return previewableTypes.includes(fileType);
};

onMounted(() => {
  fetchNotificationDetail();
});
</script>

<style scoped>
.notification-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.notification-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.notification-meta {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-right: 24px;
  margin-bottom: 8px;
  color: #666;
}

.meta-item span {
  margin-left: 6px;
}

.notification-body {
  margin-bottom: 24px;
  line-height: 1.8;
}

.notification-attachments {
  margin-top: 32px;
}

.attachment-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.preview-not-available {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.preview-not-available p {
  margin: 16px 0;
  color: #666;
}
</style> 