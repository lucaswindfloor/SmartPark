<template>
  <div class="recycle-bin-container">
    <h2>通知公告回收站</h2>
    
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="删除时间">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
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
        <el-form-item label="过期时间">
          <el-select v-model="filterForm.expireDays" placeholder="过期时间">
            <el-option label="全部" value="all"></el-option>
            <el-option label="即将过期(7天内)" value="7"></el-option>
            <el-option label="一周内" value="7"></el-option>
            <el-option label="两周内" value="14"></el-option>
            <el-option label="一个月内" value="30"></el-option>
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
    
    <div class="operation-bar">
      <el-button type="danger" @click="handleEmptyRecycleBin" :disabled="notificationList.length === 0">清空回收站</el-button>
      <el-tag type="info" effect="plain">回收站中的公告将在30天后自动永久删除</el-tag>
    </div>
    
    <div class="notification-list">
      <el-table :data="notificationList" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">{{ getTypeLabel(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deleteTime" label="删除时间" width="180"></el-table-column>
        <el-table-column prop="expireTime" label="过期时间" width="180"></el-table-column>
        <el-table-column prop="deleteBy" label="删除人" width="120"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handlePreview(scope.row)">预览</el-button>
            <el-button size="small" type="success" @click="handleRestore(scope.row)">恢复</el-button>
            <el-button size="small" type="danger" @click="handleDeletePermanently(scope.row)">彻底删除</el-button>
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
          <span>删除时间: {{ currentNotification.deleteTime }}</span>
          <span>过期时间: {{ currentNotification.expireTime }}</span>
          <span>删除人: {{ currentNotification.deleteBy }}</span>
        </div>
        <div class="content" v-html="currentNotification.content"></div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button type="success" @click="handleRestore(currentNotification)">恢复</el-button>
          <el-button type="danger" @click="handleDeletePermanently(currentNotification)">彻底删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RecycleBin',
  data() {
    return {
      filterForm: {
        dateRange: [],
        type: 'all',
        expireDays: 'all',
        keyword: ''
      },
      notificationList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      previewDialogVisible: false,
      currentNotification: {}
    }
  },
  created() {
    this.fetchRecycleBinNotifications()
  },
  methods: {
    // 获取回收站通知列表
    fetchRecycleBinNotifications() {
      // 实际项目中应该调用API获取数据
      // 这里模拟数据
      const mockData = Array(15).fill().map((_, index) => {
        const deleteDate = new Date(Date.now() - (index * 2) * 24 * 60 * 60 * 1000)
        return {
          id: `recycle-${index + 1}`,
          title: `已删除通知标题 ${index + 1}`,
          type: ['normal', 'policy', 'event', 'emergency'][index % 4],
          deleteTime: this.formatDate(deleteDate),
          expireTime: this.formatDate(new Date(deleteDate.getTime() + 30 * 24 * 60 * 60 * 1000)),
          deleteBy: `删除人 ${index % 5 + 1}`,
          content: `这是被删除的通知内容 ${index + 1}，将在一段时间后彻底删除。`
        }
      })
      
      this.notificationList = mockData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      this.total = mockData.length
    },
    
    // 格式化日期
    formatDate(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    },
    
    // 类型相关方法
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
    
    // 搜索和过滤
    handleSearch() {
      this.currentPage = 1
      this.fetchRecycleBinNotifications()
    },
    
    resetFilter() {
      this.filterForm = {
        dateRange: [],
        type: 'all',
        expireDays: 'all',
        keyword: ''
      }
      this.handleSearch()
    },
    
    // 分页
    handlePageChange(page) {
      this.currentPage = page
      this.fetchRecycleBinNotifications()
    },
    
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchRecycleBinNotifications()
    },
    
    // 操作
    handlePreview(row) {
      this.currentNotification = row
      this.previewDialogVisible = true
    },
    
    handleRestore(row) {
      this.$confirm('确定恢复该公告吗？恢复后公告将回到删除前的状态。', '恢复确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 实际项目中应该调用API进行恢复操作
        this.$message.success('恢复成功')
        this.previewDialogVisible = false
        this.fetchRecycleBinNotifications()
      }).catch(() => {})
    },
    
    handleDeletePermanently(row) {
      this.$confirm('确定要彻底删除该公告吗？此操作不可逆。', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实际项目中应该调用API进行彻底删除操作
        this.$message.success('彻底删除成功')
        this.previewDialogVisible = false
        this.fetchRecycleBinNotifications()
      }).catch(() => {})
    },
    
    handleEmptyRecycleBin() {
      this.$confirm('确定要清空回收站吗？此操作将彻底删除所有回收站中的公告，且不可恢复。', '清空确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实际项目中应该调用API进行清空回收站操作
        this.$message.success('回收站已清空')
        this.notificationList = []
        this.total = 0
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.recycle-bin-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 