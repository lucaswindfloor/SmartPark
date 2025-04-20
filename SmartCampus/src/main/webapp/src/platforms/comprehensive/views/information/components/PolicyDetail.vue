<template>
  <div class="policy-detail">
    <a-descriptions :column="1" bordered>
      <a-descriptions-item label="政策标题">
        <div class="policy-title">
          <span>{{ policy.title }}</span>
          <a-tag v-if="policy.isTop" color="red">置顶</a-tag>
        </div>
      </a-descriptions-item>
      
      <a-descriptions-item label="政策类型">
        <a-tag :color="getTypeColor(policy.type)">{{ getTypeText(policy.type) }}</a-tag>
      </a-descriptions-item>
      
      <a-descriptions-item label="发文单位">{{ policy.issuingAuthority || '暂无' }}</a-descriptions-item>
      
      <a-descriptions-item label="文号">{{ policy.documentNumber || '暂无' }}</a-descriptions-item>
      
      <a-descriptions-item label="状态">
        <a-tag :color="getStatusColor(policy.status)">{{ getStatusText(policy.status) }}</a-tag>
      </a-descriptions-item>
      
      <a-descriptions-item label="发布日期">{{ policy.publishTime || '未发布' }}</a-descriptions-item>
      
      <a-descriptions-item label="生效日期">{{ policy.effectiveDate || '暂无' }}</a-descriptions-item>
      
      <a-descriptions-item label="关键词">
        <a-space v-if="policy.keywords && policy.keywords.length">
          <a-tag v-for="(keyword, index) in policy.keywords" :key="index">
            {{ keyword }}
          </a-tag>
        </a-space>
        <span v-else>暂无</span>
      </a-descriptions-item>
    </a-descriptions>
    
    <div class="content-section">
      <div class="section-title">政策内容</div>
      <div class="policy-content" v-html="policy.content"></div>
    </div>
    
    <div class="attachments-section" v-if="policy.attachments && policy.attachments.length">
      <div class="section-title">附件列表</div>
      <a-list
        size="small"
        bordered
        :data-source="policy.attachments"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <div class="attachment-item">
              <div class="attachment-info">
                <file-outlined />
                <span class="attachment-name">{{ item.name }}</span>
                <span class="attachment-size">({{ formatFileSize(item.size) }})</span>
              </div>
              <a-button type="link" @click="downloadAttachment(item)">下载</a-button>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </div>
    
    <div class="meta-section">
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="创建人">{{ policy.createdBy || '未知' }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ policy.createdTime || '未知' }}</a-descriptions-item>
        <a-descriptions-item label="更新人">{{ policy.updatedBy || '未知' }}</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{ policy.updatedTime || '未知' }}</a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { FileOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'PolicyDetail',
  components: {
    FileOutlined
  },
  props: {
    policy: {
      type: Object,
      required: true
    }
  },
  setup() {
    // 获取状态颜色
    const getStatusColor = (status) => {
      const statusMap = {
        'DRAFT': 'blue',
        'PENDING_REVIEW': 'orange',
        'PUBLISHED': 'green',
        'EXPIRED': 'gray',
        'RECALLED': 'red'
      };
      return statusMap[status] || 'default';
    };
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'DRAFT': '草稿',
        'PENDING_REVIEW': '待审核',
        'PUBLISHED': '已发布',
        'EXPIRED': '已过期',
        'RECALLED': '已撤回'
      };
      return statusMap[status] || '未知';
    };
    
    // 获取类型颜色
    const getTypeColor = (type) => {
      const typeMap = {
        'NATIONAL': 'purple',
        'LOCAL': 'cyan',
        'INDUSTRY': 'blue',
        'PARK': 'green'
      };
      return typeMap[type] || 'default';
    };
    
    // 获取类型文本
    const getTypeText = (type) => {
      const typeMap = {
        'NATIONAL': '国家政策',
        'LOCAL': '地方政策',
        'INDUSTRY': '行业政策',
        'PARK': '园区政策'
      };
      return typeMap[type] || '未知';
    };
    
    // 格式化文件大小
    const formatFileSize = (size) => {
      if (!size) return '0B';
      
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let index = 0;
      let fileSize = size;
      
      while (fileSize >= 1024 && index < units.length - 1) {
        fileSize /= 1024;
        index++;
      }
      
      return `${fileSize.toFixed(2)}${units[index]}`;
    };
    
    // 下载附件
    const downloadAttachment = (attachment) => {
      if (attachment.url) {
        window.open(attachment.url);
      }
    };
    
    return {
      getStatusColor,
      getStatusText,
      getTypeColor,
      getTypeText,
      formatFileSize,
      downloadAttachment
    };
  }
});
</script>

<style scoped>
.policy-detail {
  padding: 20px;
}

.policy-title {
  display: flex;
  align-items: center;
}

.policy-title span {
  margin-right: 8px;
  font-weight: 500;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin: 24px 0 16px;
  padding-left: 10px;
  border-left: 3px solid #1890ff;
}

.content-section {
  margin-top: 24px;
}

.policy-content {
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  min-height: 200px;
}

.attachments-section {
  margin-top: 24px;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.attachment-info {
  display: flex;
  align-items: center;
}

.attachment-name {
  margin-left: 8px;
}

.attachment-size {
  margin-left: 8px;
  color: #999;
  font-size: 12px;
}

.meta-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px dashed #e8e8e8;
}
</style> 