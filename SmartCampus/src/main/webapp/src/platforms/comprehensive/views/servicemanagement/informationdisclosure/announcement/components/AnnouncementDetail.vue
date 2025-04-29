<template>
  <div class="notification-detail">
    <a-descriptions 
      :title="notificationData.title" 
      bordered 
      :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
    >
      <a-descriptions-item label="通知类型">
        <a-tag :color="getNoticeTypeColor(notificationData.noticeType)">
          {{ getNoticeTypeText(notificationData.noticeType) }}
        </a-tag>
      </a-descriptions-item>
      
      <a-descriptions-item label="通知来源">
        {{ notificationData.source || '未设置' }}
      </a-descriptions-item>
      
      <a-descriptions-item label="创建时间">
        {{ notificationData.createTime }}
      </a-descriptions-item>
      
      <a-descriptions-item label="发布时间">
        {{ notificationData.publishTime || '未发布' }}
      </a-descriptions-item>
      
      <a-descriptions-item label="有效期至">
        {{ notificationData.validityEndTime || '未设置' }}
      </a-descriptions-item>
      
      <a-descriptions-item label="状态">
        <a-badge :status="getStatusBadge(notificationData.status)" :text="getStatusText(notificationData.status)" />
      </a-descriptions-item>
      
      <a-descriptions-item label="创建人">
        {{ notificationData.createBy }}
      </a-descriptions-item>
      
      <a-descriptions-item label="发布人">
        {{ notificationData.publishBy || '未发布' }}
      </a-descriptions-item>
      
      <a-descriptions-item label="通知内容" :span="4">
        <div class="notification-content" v-html="notificationData.content"></div>
      </a-descriptions-item>
      
      <a-descriptions-item v-if="notificationData.attachments && notificationData.attachments.length > 0" label="附件" :span="4">
        <div class="attachment-list">
          <a-list item-layout="horizontal" :data-source="notificationData.attachments">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta>
                <div slot="title">
                  <a @click="downloadAttachment(item)">
                    <a-icon type="paper-clip" style="margin-right: 8px;" />
                    {{ item.fileName }}
                  </a>
                </div>
                <div slot="description">
                  <span>{{ formatFileSize(item.fileSize) }}</span>
                  <span style="margin-left: 16px;">上传时间: {{ item.uploadTime }}</span>
                </div>
              </a-list-item-meta>
              <a-button type="link" icon="download" @click="downloadAttachment(item)">下载</a-button>
            </a-list-item>
          </a-list>
        </div>
      </a-descriptions-item>
      
      <a-descriptions-item v-if="notificationData.auditInfo" label="审核信息" :span="4">
        <div class="audit-info">
          <p><strong>审核人:</strong> {{ notificationData.auditInfo.auditBy }}</p>
          <p><strong>审核时间:</strong> {{ notificationData.auditInfo.auditTime }}</p>
          <p><strong>审核结果:</strong> 
            <a-tag :color="notificationData.auditInfo.auditResult === 'approved' ? 'green' : 'red'">
              {{ notificationData.auditInfo.auditResult === 'approved' ? '通过' : '驳回' }}
            </a-tag>
          </p>
          <p><strong>审核意见:</strong> {{ notificationData.auditInfo.auditComments || '无' }}</p>
        </div>
      </a-descriptions-item>
      
      <a-descriptions-item v-if="notificationData.editHistory && notificationData.editHistory.length > 0" label="编辑历史" :span="4">
        <a-timeline>
          <a-timeline-item v-for="(history, index) in notificationData.editHistory" :key="index">
            <p><strong>{{ history.editBy }}</strong> 于 {{ history.editTime }} 进行了编辑</p>
            <p>{{ history.editRemarks || '无备注' }}</p>
          </a-timeline-item>
        </a-timeline>
      </a-descriptions-item>
    </a-descriptions>
    
    <div class="action-buttons">
      <a-button @click="handlePrint" icon="printer">打印</a-button>
      <a-button @click="handleExport" icon="export">导出</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationDetail',
  props: {
    notificationData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 通知类型选项
      noticeTypeOptions: [
        { label: '通知', value: 'notice' },
        { label: '公告', value: 'announcement' },
        { label: '新闻', value: 'news' },
        { label: '政策文件', value: 'policy' }
      ],
      
      // 状态选项
      statusOptions: [
        { label: '草稿', value: 'draft' },
        { label: '待审核', value: 'pending' },
        { label: '已审核', value: 'approved' },
        { label: '已发布', value: 'published' },
        { label: '已过期', value: 'expired' },
        { label: '已驳回', value: 'rejected' },
        { label: '已删除', value: 'deleted' }
      ]
    }
  },
  methods: {
    // 获取通知类型文本
    getNoticeTypeText(type) {
      const option = this.noticeTypeOptions.find(item => item.value === type)
      return option ? option.label : '未知类型'
    },
    
    // 获取通知类型颜色
    getNoticeTypeColor(type) {
      const colorMap = {
        notice: 'blue',
        announcement: 'green',
        news: 'purple',
        policy: 'orange'
      }
      return colorMap[type] || 'default'
    },
    
    // 获取状态文本
    getStatusText(status) {
      const option = this.statusOptions.find(item => item.value === status)
      return option ? option.label : '未知状态'
    },
    
    // 获取状态徽标样式
    getStatusBadge(status) {
      const badgeMap = {
        draft: 'default',
        pending: 'processing',
        approved: 'success',
        published: 'success',
        expired: 'warning',
        rejected: 'error',
        deleted: 'default'
      }
      return badgeMap[status] || 'default'
    },
    
    // 格式化文件大小
    formatFileSize(size) {
      if (size < 1024) {
        return size + ' B'
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + ' KB'
      } else if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + ' MB'
      } else {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
      }
    },
    
    // 下载附件
    downloadAttachment(attachment) {
      // 实际项目中应调用下载接口
      this.$message.info(`下载附件: ${attachment.fileName}`)
    },
    
    // 打印功能
    handlePrint() {
      window.print()
    },
    
    // 导出功能
    handleExport() {
      this.$message.info('导出功能待实现')
    }
  }
}
</script>

<style lang="less" scoped>
.notification-detail {
  .notification-content {
    padding: 16px;
    background-color: #fafafa;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    min-height: 200px;
    
    /deep/ img {
      max-width: 100%;
    }
  }
  
  .attachment-list {
    margin-top: 8px;
  }
  
  .audit-info {
    padding: 8px;
    background-color: #fafafa;
    border-radius: 4px;
    
    p {
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .action-buttons {
    margin-top: 24px;
    text-align: center;
    
    button {
      margin: 0 8px;
    }
  }
}

@media print {
  .action-buttons {
    display: none;
  }
}
</style> 