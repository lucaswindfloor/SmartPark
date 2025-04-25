<template>
  <div class="notification-archive-container">
    <h2>通知公告归档管理</h2>
    
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="时间">
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
        <el-form-item label="归档原因">
          <el-select v-model="filterForm.archiveReason" placeholder="归档原因">
            <el-option label="全部" value="all"></el-option>
            <el-option label="过期" value="expired"></el-option>
            <el-option label="取消发布" value="canceled"></el-option>
            <el-option label="手动归档" value="manual"></el-option>
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
        <el-table-column prop="publishTime" label="发布时间" width="180"></el-table-column>
        <el-table-column prop="archiveTime" label="归档时间" width="180"></el-table-column>
        <el-table-column prop="archiveReason" label="归档原因" width="120">
          <template #default="scope">
            <el-tag type="info">{{ getArchiveReasonLabel(scope.row.archiveReason) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="阅读数" width="100"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" @click="handleUnarchive(scope.row)">解档</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'NotificationArchive',
  data() {
    return {
      filterForm: {
        dateRange: [],
        type: 'all',
        archiveReason: 'all',
        keyword: ''
      },
      notificationList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  created() {
    this.fetchArchivedNotifications()
  },
  methods: {
    // 获取归档通知列表
    fetchArchivedNotifications() {
      // 实际项目中应该调用API获取数据
      // 这里模拟数据
      const mockData = Array(20).fill().map((_, index) => ({
        id: `archive-${index + 1}`,
        title: `归档通知标题 ${index + 1}`,
        type: ['normal', 'policy', 'event', 'emergency'][index % 4],
        publishTime: this.formatDate(new Date(Date.now() - (index * 2 + 30) * 24 * 60 * 60 * 1000)),
        archiveTime: this.formatDate(new Date(Date.now() - index * 24 * 60 * 60 * 1000)),
        archiveReason: ['expired', 'canceled', 'manual'][index % 3],
        viewCount: Math.floor(Math.random() * 200) + 50
      }))
      
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
    
    // 归档原因标签
    getArchiveReasonLabel(reason) {
      const map = {
        expired: '已过期',
        canceled: '取消发布',
        manual: '手动归档'
      }
      return map[reason] || '未知原因'
    },
    
    // 搜索和过滤
    handleSearch() {
      this.currentPage = 1
      this.fetchArchivedNotifications()
    },
    
    resetFilter() {
      this.filterForm = {
        dateRange: [],
        type: 'all',
        archiveReason: 'all',
        keyword: ''
      }
      this.handleSearch()
    },
    
    // 分页
    handlePageChange(page) {
      this.currentPage = page
      this.fetchArchivedNotifications()
    },
    
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchArchivedNotifications()
    },
    
    // 操作
    handleView(row) {
      // 实际项目中应该跳转到通知详情页
      this.$router.push({
        name: 'notificationDetail',
        params: { id: row.id }
      })
    },
    
    handleUnarchive(row) {
      this.$confirm('确定将该公告解档吗？解档后公告将回到其原始状态。', '解档确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实际项目中应该调用API进行解档操作
        this.$message.success('解档成功')
        this.fetchArchivedNotifications()
      }).catch(() => {})
    },
    
    handleDelete(row) {
      this.$confirm('确定要删除该归档公告吗？删除后将移至回收站。', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实际项目中应该调用API进行删除操作
        this.$message.success('删除成功，已移至回收站')
        this.fetchArchivedNotifications()
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.notification-archive-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 