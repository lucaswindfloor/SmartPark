<template>
  <div class="notification-manage-container">
    <h2>通知公告管理</h2>
    
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="选择状态">
            <el-option label="全部" value="all"></el-option>
            <el-option label="已发布" value="published"></el-option>
            <el-option label="已过期" value="expired"></el-option>
            <el-option label="已取消发布" value="canceled"></el-option>
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
        <el-form-item label="重要性">
          <el-select v-model="filterForm.importance" placeholder="选择重要性">
            <el-option label="全部" value="all"></el-option>
            <el-option label="普通" value="normal"></el-option>
            <el-option label="重要" value="important"></el-option>
            <el-option label="紧急" value="emergency"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="置顶">
          <el-select v-model="filterForm.isPinned" placeholder="是否置顶">
            <el-option label="全部" value="all"></el-option>
            <el-option label="已置顶" value="true"></el-option>
            <el-option label="未置顶" value="false"></el-option>
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
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="scope">
            <div class="title-cell">
              <el-tag v-if="scope.row.isPinned" type="danger" size="small" effect="dark">置顶</el-tag>
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">{{ getTypeLabel(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="importance" label="重要性" width="100">
          <template #default="scope">
            <el-tag :type="getImportanceTag(scope.row.importance)">{{ getImportanceLabel(scope.row.importance) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="180"></el-table-column>
        <el-table-column prop="expireTime" label="过期时间" width="180"></el-table-column>
        <el-table-column prop="viewCount" label="阅读数" width="100">
          <template #default="scope">
            <el-link type="primary" @click="handleViewStatistics(scope.row)">{{ scope.row.viewCount }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button size="small" type="primary" @click="handleView(scope.row)">查看</el-button>
              
              <!-- 置顶/取消置顶 -->
              <el-button 
                v-if="scope.row.status === 'published' && !scope.row.isPinned" 
                size="small" 
                @click="handlePin(scope.row)"
              >置顶</el-button>
              <el-button 
                v-if="scope.row.status === 'published' && scope.row.isPinned" 
                size="small" 
                @click="handleUnpin(scope.row)"
              >取消置顶</el-button>
              
              <!-- 延期 -->
              <el-button 
                v-if="scope.row.status === 'published' || scope.row.status === 'expired'" 
                size="small" 
                @click="handleExtend(scope.row)"
              >延期</el-button>
              
              <!-- 取消发布 -->
              <el-button 
                v-if="scope.row.status === 'published'" 
                size="small" 
                type="warning" 
                @click="handleCancel(scope.row)"
              >取消发布</el-button>
              
              <!-- 归档 -->
              <el-button 
                v-if="scope.row.status === 'expired' || scope.row.status === 'canceled'" 
                size="small" 
                @click="handleArchive(scope.row)"
              >归档</el-button>
              
              <!-- 删除 -->
              <el-button 
                size="small" 
                type="danger" 
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </div>
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
    
    <!-- 阅读统计对话框 -->
    <el-dialog v-model="statsDialogVisible" title="阅读统计" width="70%">
      <div v-if="currentNotification.id" class="stats-content">
        <h3>{{ currentNotification.title }}</h3>
        
        <div class="stats-summary">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>总阅读量</span>
                  </div>
                </template>
                <div class="card-content">
                  <h2>{{ currentNotification.viewCount }}</h2>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>阅读率</span>
                  </div>
                </template>
                <div class="card-content">
                  <h2>{{ Math.round(currentNotification.readRate * 100) }}%</h2>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>需确认数量</span>
                  </div>
                </template>
                <div class="card-content">
                  <h2>{{ currentNotification.confirmCount || '0' }}/{{ currentNotification.totalTarget || '0' }}</h2>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <div class="stats-tabs">
          <el-tabs v-model="activeStatsTab">
            <el-tab-pane label="阅读明细" name="read">
              <el-table :data="readDetailsList" style="width: 100%">
                <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
                <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
                <el-table-column prop="department" label="部门" width="150"></el-table-column>
                <el-table-column prop="readTime" label="阅读时间" width="180"></el-table-column>
                <el-table-column 
                  prop="isConfirmed" 
                  label="是否确认" 
                  width="100"
                  v-if="currentNotification.requireConfirmation"
                >
                  <template #default="scope">
                    <el-tag :type="scope.row.isConfirmed ? 'success' : 'info'">
                      {{ scope.row.isConfirmed ? '已确认' : '未确认' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column 
                  prop="confirmTime" 
                  label="确认时间" 
                  width="180"
                  v-if="currentNotification.requireConfirmation"
                ></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="企业阅读统计" name="enterprise">
              <el-table :data="enterpriseStatsList" style="width: 100%">
                <el-table-column prop="enterpriseId" label="企业ID" width="100"></el-table-column>
                <el-table-column prop="enterpriseName" label="企业名称" width="200"></el-table-column>
                <el-table-column prop="totalUsers" label="总人数" width="100"></el-table-column>
                <el-table-column prop="readCount" label="已读人数" width="100"></el-table-column>
                <el-table-column prop="readRate" label="阅读率" width="100">
                  <template #default="scope">
                    {{ Math.round(scope.row.readRate * 100) }}%
                  </template>
                </el-table-column>
                <el-table-column 
                  prop="confirmCount" 
                  label="已确认人数" 
                  width="120"
                  v-if="currentNotification.requireConfirmation"
                ></el-table-column>
                <el-table-column 
                  prop="confirmRate" 
                  label="确认率" 
                  width="100"
                  v-if="currentNotification.requireConfirmation"
                >
                  <template #default="scope">
                    {{ Math.round(scope.row.confirmRate * 100) }}%
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    
    <!-- 延期对话框 -->
    <el-dialog v-model="extendDialogVisible" title="延长有效期" width="500px">
      <el-form :model="extendForm" :rules="extendRules" ref="extendFormRef" label-width="100px">
        <el-form-item label="当前到期" prop="currentExpireTime">
          <el-input v-model="extendForm.currentExpireTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="延长天数" prop="days">
          <el-input-number v-model="extendForm.days" :min="1" :max="90"></el-input-number>
        </el-form-item>
        <el-form-item label="新到期时间" prop="newExpireTime">
          <el-input v-model="extendForm.newExpireTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="延期原因" prop="reason">
          <el-input v-model="extendForm.reason" type="textarea" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="extendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmExtend">确认延期</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'NotificationManage',
  data() {
    return {
      filterForm: {
        status: 'all',
        type: 'all',
        importance: 'all',
        isPinned: 'all',
        keyword: ''
      },
      notificationList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      statsDialogVisible: false,
      extendDialogVisible: false,
      currentNotification: {},
      activeStatsTab: 'read',
      readDetailsList: [],
      enterpriseStatsList: [],
      extendForm: {
        currentExpireTime: '',
        days: 7,
        newExpireTime: '',
        reason: ''
      },
      extendRules: {
        days: [{ required: true, message: '请输入延长天数', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchNotifications()
  },
  watch: {
    'extendForm.days': {
      handler(newVal) {
        if (this.extendForm.currentExpireTime && newVal) {
          const currentDate = new Date(this.extendForm.currentExpireTime)
          const newDate = new Date(currentDate.getTime() + newVal * 24 * 60 * 60 * 1000)
          this.extendForm.newExpireTime = this.formatDate(newDate)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取通知列表
    fetchNotifications() {
      // 实际项目中应该调用API获取数据
      // 这里模拟数据
      const mockData = Array(25).fill().map((_, index) => {
        const publishDate = new Date(Date.now() - (index * 3) * 24 * 60 * 60 * 1000)
        const expireDate = new Date(publishDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        const status = index % 3 === 0 ? 'expired' : (index % 7 === 0 ? 'canceled' : 'published')
        
        return {
          id: `notification-${index + 1}`,
          title: `通知标题 ${index + 1}`,
          type: ['normal', 'policy', 'event', 'emergency'][index % 4],
          importance: ['normal', 'important', 'emergency'][index % 3],
          status: status,
          publishTime: this.formatDate(publishDate),
          expireTime: this.formatDate(expireDate),
          viewCount: Math.floor(Math.random() * 300) + 50,
          isPinned: index % 10 === 0,
          readRate: Math.random() * 0.8 + 0.1,
          requireConfirmation: index % 4 === 0,
          confirmCount: Math.floor(Math.random() * 50) + 10,
          totalTarget: 100
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
    
    // 类型和状态方法
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
    
    getStatusTag(status) {
      const map = {
        published: 'success',
        expired: 'info',
        canceled: 'warning'
      }
      return map[status] || ''
    },
    
    getStatusLabel(status) {
      const map = {
        published: '已发布',
        expired: '已过期',
        canceled: '已取消发布'
      }
      return map[status] || '未知状态'
    },
    
    // 搜索和过滤
    handleSearch() {
      this.currentPage = 1
      this.fetchNotifications()
    },
    
    resetFilter() {
      this.filterForm = {
        status: 'all',
        type: 'all',
        importance: 'all',
        isPinned: 'all',
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
    handleView(row) {
      // 实际项目中应该跳转到通知详情页
      this.$router.push({
        name: 'notificationDetail',
        params: { id: row.id }
      })
    },
    
    // 统计相关
    handleViewStatistics(row) {
      this.currentNotification = row
      this.statsDialogVisible = true
      this.fetchReadDetails()
      this.fetchEnterpriseStats()
    },
    
    fetchReadDetails() {
      // 实际项目中应该调用API获取阅读明细
      // 这里模拟数据
      this.readDetailsList = Array(20).fill().map((_, index) => {
        const readTime = new Date(Date.now() - Math.floor(Math.random() * 7 * 24) * 60 * 60 * 1000)
        const isConfirmed = Math.random() > 0.3
        const confirmTime = isConfirmed ? new Date(readTime.getTime() + Math.floor(Math.random() * 24) * 60 * 60 * 1000) : null
        
        return {
          userId: `user-${index + 1}`,
          userName: `用户${index + 1}`,
          department: `部门${Math.floor(index / 5) + 1}`,
          readTime: this.formatDate(readTime),
          isConfirmed: isConfirmed,
          confirmTime: confirmTime ? this.formatDate(confirmTime) : '-'
        }
      })
    },
    
    fetchEnterpriseStats() {
      // 实际项目中应该调用API获取企业阅读统计
      // 这里模拟数据
      this.enterpriseStatsList = Array(8).fill().map((_, index) => {
        const totalUsers = (index + 1) * 10 + 5
        const readCount = Math.floor(totalUsers * (Math.random() * 0.5 + 0.3))
        const confirmCount = Math.floor(readCount * (Math.random() * 0.7 + 0.3))
        
        return {
          enterpriseId: `enterprise-${index + 1}`,
          enterpriseName: `示例企业${index + 1}`,
          totalUsers: totalUsers,
          readCount: readCount,
          readRate: readCount / totalUsers,
          confirmCount: confirmCount,
          confirmRate: confirmCount / totalUsers
        }
      })
    },
    
    // 置顶操作
    handlePin(row) {
      this.$confirm('确定要将该公告置顶吗？', '置顶确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 实际项目中应该调用API进行置顶操作
        row.isPinned = true
        this.$message.success('公告已置顶')
      }).catch(() => {})
    },
    
    handleUnpin(row) {
      this.$confirm('确定要取消该公告的置顶吗？', '取消置顶确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 实际项目中应该调用API进行取消置顶操作
        row.isPinned = false
        this.$message.success('已取消置顶')
      }).catch(() => {})
    },
    
    // 延期操作
    handleExtend(row) {
      this.currentNotification = row
      this.extendForm = {
        currentExpireTime: row.expireTime,
        days: 7,
        newExpireTime: '',
        reason: ''
      }
      
      // 计算新的过期时间
      const currentDate = new Date(row.expireTime)
      const newDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      this.extendForm.newExpireTime = this.formatDate(newDate)
      
      this.extendDialogVisible = true
    },
    
    confirmExtend() {
      if (!this.extendForm.days || !this.extendForm.reason) {
        this.$message.warning('请填写延长天数和延期原因')
        return
      }
      
      // 实际项目中应该调用API进行延期操作
      this.currentNotification.expireTime = this.extendForm.newExpireTime
      if (this.currentNotification.status === 'expired') {
        this.currentNotification.status = 'published'
      }
      
      this.$message.success('延期成功')
      this.extendDialogVisible = false
    },
    
    // 取消发布操作
    handleCancel(row) {
      this.$confirm('确定要取消发布该公告吗？取消后将无法恢复为发布状态。', '取消发布确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实际项目中应该调用API进行取消发布操作
        row.status = 'canceled'
        this.$message.success('公告已取消发布')
      }).catch(() => {})
    },
    
    // 归档操作
    handleArchive(row) {
      this.$confirm('确定要将该公告归档吗？归档后将从当前列表移除。', '归档确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 实际项目中应该调用API进行归档操作
        // 这里从列表中移除该项模拟归档效果
        const index = this.notificationList.findIndex(item => item.id === row.id)
        if (index > -1) {
          this.notificationList.splice(index, 1)
          this.total--
        }
        this.$message.success('公告已归档')
      }).catch(() => {})
    },
    
    // 删除操作
    handleDelete(row) {
      this.$confirm('确定要删除该公告吗？删除后将移至回收站。', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实际项目中应该调用API进行删除操作
        // 这里从列表中移除该项模拟删除效果
        const index = this.notificationList.findIndex(item => item.id === row.id)
        if (index > -1) {
          this.notificationList.splice(index, 1)
          this.total--
        }
        this.$message.success('公告已删除，已移至回收站')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.notification-manage-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.title-cell {
  display: flex;
  align-items: center;
}

.title-cell .el-tag {
  margin-right: 8px;
}

.operation-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.stats-summary {
  margin: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
}

.stats-tabs {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 