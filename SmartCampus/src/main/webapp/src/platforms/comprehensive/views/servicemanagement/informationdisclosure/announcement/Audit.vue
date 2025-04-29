<template>
  <div class="notification-audit-container">
    <h2>通知公告审核</h2>
    
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="选择状态">
            <el-option label="待审核" value="pending"></el-option>
            <el-option label="全部" value="all"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filterForm.type" placeholder="选择类型">
            <el-option label="全部" value="all"></el-option>
            <el-option label="普通通知" value="normal"></el-option>
            <el-option label="政策通知" value="policy"></el-option>
            <el-option label="活动通知" value="event"></el-option>
            <el-option label="紧急通知" value="emergency"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filterForm.keyword" placeholder="标题/内容关键词"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="notification-list">
      <el-table :data="notificationList" style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">{{ getTypeLabel(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="importance" label="重要性" width="100">
          <template #default="scope">
            <el-tag :type="getImportanceTag(scope.row.importance)">{{ getImportanceLabel(scope.row.importance) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="起草人" width="120"></el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handlePreview(scope.row)">预览</el-button>
            <el-button size="small" type="success" @click="handleApprove(scope.row)">通过</el-button>
            <el-button size="small" type="danger" @click="handleReject(scope.row)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
    
    <!-- 预览对话框 -->
    <el-dialog v-model="previewDialogVisible" title="公告预览" width="70%">
      <div class="preview-content">
        <h3>{{ currentNotification.title }}</h3>
        <div class="meta-info">
          <span>类型: {{ getTypeLabel(currentNotification.type) }}</span>
          <span>重要性: {{ getImportanceLabel(currentNotification.importance) }}</span>
          <span>起草人: {{ currentNotification.creator }}</span>
          <span>提交时间: {{ currentNotification.submitTime }}</span>
        </div>
        <div class="content" v-html="currentNotification.content"></div>
        
        <div class="attachments" v-if="currentNotification.attachments && currentNotification.attachments.length">
          <h4>附件</h4>
          <ul>
            <li v-for="(attachment, index) in currentNotification.attachments" :key="index">
              <a href="javascript:;" @click="downloadAttachment(attachment)">{{ attachment.name }}</a>
            </li>
          </ul>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button type="success" @click="handleApprove(currentNotification)">通过</el-button>
          <el-button type="danger" @click="handleReject(currentNotification)">驳回</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 驳回原因对话框 -->
    <el-dialog v-model="rejectDialogVisible" title="驳回原因" width="500px">
      <el-form :model="rejectForm">
        <el-form-item label="驳回原因" prop="reason" :rules="[{ required: true, message: '请填写驳回原因', trigger: 'blur' }]">
          <el-input 
            v-model="rejectForm.reason" 
            type="textarea" 
            rows="4"
            placeholder="请输入驳回原因，将通知给起草人"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rejectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmReject">确认驳回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'NotificationAudit',
  data() {
    return {
      filterForm: {
        status: 'pending',
        type: 'all',
        keyword: ''
      },
      notificationList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      previewDialogVisible: false,
      rejectDialogVisible: false,
      currentNotification: {},
      rejectForm: {
        reason: ''
      }
    }
  },
  created() {
    this.fetchNotifications()
  },
  methods: {
    // 获取通知列表
    fetchNotifications() {
      // 实际项目中应该调用API获取数据
      // 这里模拟数据
      const mockData = Array(15).fill().map((_, index) => ({
        id: `notification-${index + 1}`,
        title: `测试通知标题 ${index + 1}`,
        type: ['normal', 'policy', 'event', 'emergency'][index % 4],
        importance: ['normal', 'important', 'emergency'][index % 3],
        creator: `起草人 ${index + 1}`,
        submitTime: new Date().toLocaleString(),
        content: `这是通知内容 ${index + 1}，需要审核。`,
        attachments: index % 3 === 0 ? [{ name: '附件1.docx', url: '#' }] : []
      }))
      
      this.notificationList = mockData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      this.total = mockData.length
    },
    
    // 类型和重要性相关方法
    getTypeTag(type) {
      const map = {
        normal: '',
        policy: 'success',
        event: 'warning',
        emergency: 'danger'
      }
      return map[type] || ''
    },
    
    getTypeLabel(type) {
      const map = {
        normal: '普通通知',
        policy: '政策通知',
        event: '活动通知',
        emergency: '紧急通知'
      }
      return map[type] || '普通通知'
    },
    
    getImportanceTag(importance) {
      const map = {
        normal: '',
        important: 'warning',
        emergency: 'danger'
      }
      return map[importance] || ''
    },
    
    getImportanceLabel(importance) {
      const map = {
        normal: '普通',
        important: '重要',
        emergency: '紧急'
      }
      return map[importance] || '普通'
    },
    
    // 搜索和过滤
    handleSearch() {
      this.currentPage = 1
      this.fetchNotifications()
    },
    
    resetFilter() {
      this.filterForm = {
        status: 'pending',
        type: 'all',
        keyword: ''
      }
      this.handleSearch()
    },
    
    // 分页
    handlePageChange(page) {
      this.currentPage = page
      this.fetchNotifications()
    },
    
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchNotifications()
    },
    
    // 操作
    handlePreview(row) {
      this.currentNotification = row
      this.previewDialogVisible = true
    },
    
    handleApprove(row) {
      this.$confirm('确定通过该公告的审核吗？', '审核确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        // 实际项目中应该调用API提交审核通过
        this.$message.success('审核通过成功')
        this.previewDialogVisible = false
        this.fetchNotifications()
      }).catch(() => {})
    },
    
    handleReject(row) {
      this.currentNotification = row
      this.rejectForm.reason = ''
      this.rejectDialogVisible = true
      this.previewDialogVisible = false
    },
    
    confirmReject() {
      if (!this.rejectForm.reason) {
        this.$message.warning('请填写驳回原因')
        return
      }
      
      // 实际项目中应该调用API提交驳回信息
      this.$message.success('已驳回该公告')
      this.rejectDialogVisible = false
      this.fetchNotifications()
    },
    
    // 附件下载
    downloadAttachment(attachment) {
      // 实际项目中应该调用API下载附件
      this.$message.info(`下载附件: ${attachment.name}`)
    }
  }
}
</script>

<style scoped>
.notification-audit-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.preview-content {
  padding: 20px;
}

.meta-info {
  margin: 15px 0;
  color: #666;
}

.meta-info span {
  margin-right: 15px;
}

.content {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  min-height: 200px;
}

.attachments {
  margin-top: 20px;
}

.attachments li {
  margin: 5px 0;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 