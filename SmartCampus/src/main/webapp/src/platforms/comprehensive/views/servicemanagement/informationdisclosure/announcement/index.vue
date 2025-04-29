<template>
  <div class="notification-page">
    <a-card :bordered="false" class="card-container">
      <!-- 顶部操作区 -->
      <div class="table-operations">
        <a-space>
          <a-input-search
            v-model="searchParams.keywords"
            placeholder="标题/内容"
            style="width: 200px"
            @search="handleSearch"
          />
          <a-select
            v-model="searchParams.noticeType"
            placeholder="选择通知类型"
            style="width: 150px"
            allowClear
            @change="handleSearch"
          >
            <a-select-option v-for="item in noticeTypeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-select
            v-model="searchParams.status"
            placeholder="选择状态"
            style="width: 120px"
            allowClear
            @change="handleSearch"
          >
            <a-select-option v-for="item in statusOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="handleAdd">
            <a-icon type="plus" />新增
          </a-button>
          <a-button @click="handleRefresh">
            <a-icon type="reload" />刷新
          </a-button>
        </a-space>
    </div>
    
      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        :rowKey="record => record.id"
        @change="handleTableChange"
    >
        <template #noticeTypeSlot="text">
          <a-tag :color="getNoticeTypeColor(text)">{{ getNoticeTypeName(text) }}</a-tag>
        </template>
        
        <template #statusSlot="text">
          <a-badge :status="getStatusBadge(text)" :text="getStatusName(text)" />
        </template>
        
        <template #actionSlot="text, record">
          <a-space>
            <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
            <a-button 
              type="link" 
              size="small" 
              @click="handleEdit(record)"
              v-if="record.status !== 'PUBLISHED'"
            >编辑</a-button>
            <a-button 
              type="link" 
              size="small" 
              @click="handlePublish(record)"
              v-if="record.status === 'DRAFT'"
            >发布</a-button>
            <a-button 
              type="link" 
              size="small" 
              @click="handleOffline(record)"
              v-if="record.status === 'PUBLISHED'"
            >下线</a-button>
            <a-popconfirm
              title="确定要删除此通知吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <a-button 
                type="link" 
            size="small" 
                danger
                v-if="record.status !== 'PUBLISHED'"
              >删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
    
    <!-- 添加/编辑对话框 -->
    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      :width="900"
      :footer="null"
      @cancel="handleModalCancel"
    >
      <notification-form
        ref="notificationForm"
        :form-data="formData" 
        :edit-mode="editMode"
        @submit="handleFormSubmit"
        @cancel="handleModalCancel"
      />
    </a-modal>
    
    <!-- 查看详情对话框 -->
    <a-modal
      title="通知详情"
      :visible="detailVisible"
      :width="800"
      :footer="null"
      @cancel="handleDetailCancel"
    >
      <a-spin :spinning="detailLoading">
        <a-descriptions bordered :column="1">
          <a-descriptions-item label="标题">{{ detail.title }}</a-descriptions-item>
          <a-descriptions-item label="通知类型">
            <a-tag :color="getNoticeTypeColor(detail.type)">
              {{ getNoticeTypeName(detail.type) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="来源">{{ detail.source }}</a-descriptions-item>
          <a-descriptions-item label="发布时间">{{ detail.published_at }}</a-descriptions-item>
          <a-descriptions-item label="截止有效期">{{ detail.expired_at }}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-badge :status="getStatusBadge(detail.status)" :text="getStatusName(detail.status)" />
          </a-descriptions-item>
          <a-descriptions-item label="内容">
            <div class="notification-content" v-html="detail.content"></div>
          </a-descriptions-item>
          <a-descriptions-item label="附件" v-if="detail.attachments && detail.attachments.length > 0">
            <a-list size="small" :data-source="detail.attachments" item-layout="horizontal">
              <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta>
                  <a slot="title" @click="handleDownload(item)">
                    <a-icon type="paper-clip" /> {{ item.name }}
                  </a>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-descriptions-item>
        </a-descriptions>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import NotificationForm from './components/NotificationForm.vue'
import axios from 'axios'

export default {
  name: 'NotificationPage',
  components: {
    NotificationForm
  },
  data() {
    return {
      // 搜索参数
      searchParams: {
        keywords: '',
        noticeType: undefined,
        status: undefined,
        pageNum: 1,
        pageSize: 10
      },
      // 表格列配置
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
          ellipsis: true,
          width: 250,
        },
        {
          title: '通知类型',
          dataIndex: 'type',
          key: 'type',
          width: 120,
          scopedSlots: { customRender: 'noticeTypeSlot' }
        },
        {
          title: '来源',
          dataIndex: 'source',
          key: 'source',
          width: 120
        },
        {
          title: '发布时间',
          dataIndex: 'published_at',
          key: 'published_at',
          width: 180,
          sorter: true
        },
        {
          title: '截止有效期',
          dataIndex: 'expired_at',
          key: 'expired_at',
          width: 180
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          scopedSlots: { customRender: 'statusSlot' }
        },
        {
          title: '操作',
          key: 'action',
          width: 240,
          fixed: 'right',
          scopedSlots: { customRender: 'actionSlot' }
        }
      ],
      // 表格数据
      dataSource: [],
      // 加载状态
      loading: false,
      // 分页配置
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      // 表单弹窗配置
      modalVisible: false,
      modalTitle: '新增通知',
      editMode: false,
      formData: {},
      
      // 详情弹窗配置
      detailVisible: false,
      detailLoading: false,
      detail: {},
      
      // 通知类型选项
      noticeTypeOptions: [
        { label: '普通通知', value: 1 },
        { label: '政策通知', value: 2 },
        { label: '活动通知', value: 3 },
        { label: '紧急通知', value: 4 }
      ],
      // 状态选项
      statusOptions: [
        { label: '草稿', value: 1 },
        { label: '待审核', value: 2 },
        { label: '待发布', value: 3 },
        { label: '已发布', value: 4 },
        { label: '已过期', value: 5 },
        { label: '已取消发布', value: 6 },
        { label: '档案', value: 7 }
      ]
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取通知类型名称
    getNoticeTypeName(type) {
      const option = this.noticeTypeOptions.find(item => item.value === type)
      return option ? option.label : type
    },
    
    // 获取通知类型颜色
    getNoticeTypeColor(type) {
      const colorMap = {
        1: 'blue',    // 普通
        2: 'purple',  // 政策
        3: 'green',   // 活动
        4: 'red'      // 紧急
      }
      return colorMap[type] || 'blue'
    },
    
    // 获取状态名称
    getStatusName(status) {
      const option = this.statusOptions.find(item => item.value === status)
      return option ? option.label : status
    },
    
    // 获取状态徽章样式
    getStatusBadge(status) {
  const statusMap = {
        1: 'default',    // 草稿
        2: 'processing', // 待审核
        3: 'warning',    // 待发布
        4: 'success',    // 已发布
        5: 'error',      // 已过期
        6: 'warning',    // 已取消发布
        7: 'default'     // 档案
      }
      return statusMap[status] || 'default'
    },
    
    // 获取数据
    fetchData() {
      this.loading = true
      
      // 尝试使用不同的API路径
      axios.get('/api/announcements', { 
        params: {
          keywords: this.searchParams.keywords,
          type: this.searchParams.noticeType,
          status: this.searchParams.status,
          pageNum: this.searchParams.pageNum,
          pageSize: this.searchParams.pageSize,
          sortField: this.searchParams.sortField,
          sortOrder: this.searchParams.sortOrder
        }
      })
      .then(response => {
        const { data } = response
        if (data && data.success) {
          this.dataSource = data.data.list || []
          this.pagination.total = data.data.total || 0
          this.pagination.current = this.searchParams.pageNum
          this.pagination.pageSize = this.searchParams.pageSize
        } else {
          this.$message.error(data?.message || '获取通知列表失败')
        }
      })
      .catch(error => {
        console.error('获取通知列表失败:', error)
        this.$message.error('获取通知列表失败：' + (error.response?.status ? `${error.response.status}错误` : error.message))
        
        // 开发阶段：API失败时使用模拟数据
        console.log('使用模拟数据')
        this.useMockData()
      })
      .finally(() => {
        this.loading = false
      })
    },
    
    // 使用模拟数据
    useMockData() {
      // 模拟数据
      const mockData = [
        {
          id: 1,
          title: '关于园区安全检查的通知',
          type: 1, // 普通通知
          source: '物业管理部',
          published_at: '2023-12-01 09:00:00',
          expired_at: '2023-12-10 23:59:59',
          status: 4, // 已发布
          content: '<p>尊敬的园区企业：</p><p>为确保园区安全，定于2023年12月5日进行安全检查，请各企业做好配合工作。</p>'
        },
        {
          id: 2,
          title: '关于调整办公时间的通知',
          type: 2, // 政策通知
          source: '行政部',
          published_at: '2023-11-25 15:30:00',
          expired_at: '2023-12-25 23:59:59',
          status: 4, // 已发布
          content: '<p>根据最新工作安排，自2024年1月1日起，园区办公时间调整为9:00-18:00。</p>'
        },
        {
          id: 3,
          title: '园区年终联谊会邀请函',
          type: 3, // 活动通知
          source: '企划部',
          published_at: '2023-12-02 10:15:00',
          expired_at: '2023-12-20 23:59:59',
          status: 4, // 已发布
          content: '<p>诚邀各企业参加2023年12月30日举办的园区年终联谊会。</p>'
        },
        {
          id: 4,
          title: '停电通知',
          type: 4, // 紧急通知
          source: '运维部',
          published_at: '2023-12-03 08:00:00',
          expired_at: '2023-12-04 23:59:59',
          status: 4, // 已发布
          content: '<p>因电力设备维护，2023年12月4日上午9:00-12:00园区将进行停电维护。</p>'
        },
        {
          id: 5,
          title: '年度财务报表提交通知',
          type: 2, // 政策通知
          source: '财务部',
          published_at: '2023-11-30 14:20:00',
          expired_at: '2023-12-15 23:59:59',
          status: 4, // 已发布
          content: '<p>请各企业于2023年12月15日前提交年度财务报表。</p>'
        }
      ];
      
      // 更新数据源
      this.dataSource = mockData;
      this.pagination.total = mockData.length;
    },
    
    // 搜索
    handleSearch() {
      this.searchParams.pageNum = 1
      this.fetchData()
    },
    
    // 刷新
    handleRefresh() {
      this.fetchData()
    },
    
    // 表格变化（分页、排序）
    handleTableChange(pagination, filters, sorter) {
      this.searchParams.pageNum = pagination.current
      this.searchParams.pageSize = pagination.pageSize
      
      // 处理排序
      if (sorter.field && sorter.order) {
        this.searchParams.sortField = sorter.field
        this.searchParams.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'
  } else {
        this.searchParams.sortField = undefined
        this.searchParams.sortOrder = undefined
      }
      
      this.fetchData()
    },
    
    // 新增
    handleAdd() {
      this.modalTitle = '新增通知'
      this.editMode = false
      this.formData = {
    title: '',
        type: 1, // 普通通知
        source: '信息中心',
        validity_period: 7,
    content: '',
        attachments: [],
        status: 1, // 草稿
        importance: 1, // 普通
        require_confirmation: false
      }
      this.modalVisible = true
    },
    
    // 查看详情
    handleView(record) {
      this.detailLoading = true
      this.detailVisible = true
      
      axios.get(`/api/announcements/${record.id}`)
        .then(response => {
          const { data } = response
          if (data && data.data) {
            this.detail = data.data
          } else {
            this.$message.error('获取通知详情失败!')
          }
        })
        .catch(error => {
          console.error('获取通知详情失败:', error)
          this.$message.error('获取通知详情失败!')
        })
        .finally(() => {
          this.detailLoading = false
        })
    },
    
    // 编辑
    handleEdit(record) {
      this.modalTitle = '编辑通知'
      this.editMode = true
      // 加载详细数据
      this.detailLoading = true
      
      axios.get(`/api/announcements/${record.id}`)
        .then(response => {
          const { data } = response
          if (data && data.data) {
            this.formData = data.data
            this.modalVisible = true
          } else {
            this.$message.error('获取通知详情失败!')
          }
        })
        .catch(error => {
          console.error('获取通知详情失败:', error)
          this.$message.error('获取通知详情失败!')
        })
        .finally(() => {
          this.detailLoading = false
        })
    },
    
    // 关闭详情弹窗
    handleDetailCancel() {
      this.detailVisible = false
    },
    
    // 表单提交
    handleFormSubmit(formData) {
      console.log('提交表单数据:', formData)
      
      this.loading = true
      
      const submitData = { ...formData }
      
      // 创建或更新通知
      const apiCall = this.editMode 
        ? axios.put(`/api/announcements/${formData.id}`, submitData)
        : axios.post('/api/announcements', submitData)
        
      apiCall
        .then(response => {
          const { data } = response
          if (data && data.success) {
            this.$message.success(this.editMode ? '更新通知成功!' : '创建通知成功!')
            this.modalVisible = false
            this.fetchData()
          } else {
            this.$message.error(data?.message || (this.editMode ? '更新通知失败!' : '创建通知失败!'))
          }
        })
        .catch(error => {
          console.error(this.editMode ? '更新通知失败:' : '创建通知失败:', error)
          this.$message.error(this.editMode ? '更新通知失败!' : '创建通知失败!')
        })
        .finally(() => {
          this.loading = false
        })
    },
    
    // 关闭表单弹窗
    handleModalCancel() {
      this.modalVisible = false
    },
    
    // 发布通知
    handlePublish(record) {
      this.$confirm({
        title: '确认发布',
        content: `确定要发布"${record.title}"吗?`,
        onOk: () => {
          this.loading = true
          
          axios.put(`/api/announcements/${record.id}/publish`)
            .then(response => {
              const { data } = response
              if (data && data.success) {
                this.$message.success('通知发布成功!')
                this.fetchData()
              } else {
                this.$message.error(data?.message || '通知发布失败!')
              }
            })
            .catch(error => {
              console.error('发布通知失败:', error)
              this.$message.error('通知发布失败!')
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    
    // 下线通知
    handleOffline(record) {
      this.$confirm({
        title: '确认下线',
        content: `确定要下线"${record.title}"吗?`,
        onOk: () => {
          this.loading = true
          
          axios.put(`/api/announcements/${record.id}/cancel`)
            .then(response => {
              const { data } = response
              if (data && data.success) {
                this.$message.success('通知已下线!')
                this.fetchData()
              } else {
                this.$message.error(data?.message || '通知下线失败!')
              }
            })
            .catch(error => {
              console.error('下线通知失败:', error)
              this.$message.error('通知下线失败!')
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    
    // 删除通知
    handleDelete(record) {
      this.loading = true
      
      axios.delete(`/api/announcements/${record.id}`)
        .then(response => {
          const { data } = response
          if (data && data.success) {
            this.$message.success('删除通知成功!')
            this.fetchData()
          } else {
            this.$message.error(data?.message || '删除通知失败!')
          }
        })
        .catch(error => {
          console.error('删除通知失败:', error)
          this.$message.error('删除通知失败!')
        })
        .finally(() => {
          this.loading = false
        })
    },
    
    // 下载附件
    handleDownload(file) {
      if (file && file.url) {
        window.open(file.url, '_blank')
      } else {
        this.$message.info(`附件"${file.name}"链接不可用`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.notification-page {
  background-color: #f0f2f5;
  padding: 20px;
  height: 100%;
  
  .card-container {
    height: 100%;
}

  .table-operations {
    margin-bottom: 16px;
}

  .notification-content {
    max-height: 300px;
    overflow-y: auto;
    padding: 12px;
    background-color: #fafafa;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
  }
}
</style> 