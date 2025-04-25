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
            <a-tag :color="getNoticeTypeColor(detail.noticeType)">
              {{ getNoticeTypeName(detail.noticeType) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="来源">{{ detail.source }}</a-descriptions-item>
          <a-descriptions-item label="发布时间">{{ detail.publishTime }}</a-descriptions-item>
          <a-descriptions-item label="截止有效期">{{ detail.validityEndTime }}</a-descriptions-item>
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
          dataIndex: 'noticeType',
          key: 'noticeType',
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
          dataIndex: 'publishTime',
          key: 'publishTime',
          width: 180,
          sorter: true
        },
        {
          title: '截止有效期',
          dataIndex: 'validityEndTime',
          key: 'validityEndTime',
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
        { label: '普通通知', value: 'NORMAL' },
        { label: '重要通知', value: 'IMPORTANT' },
        { label: '紧急通知', value: 'URGENT' }
      ],
      // 状态选项
      statusOptions: [
        { label: '草稿', value: 'DRAFT' },
        { label: '已发布', value: 'PUBLISHED' },
        { label: '已下线', value: 'OFFLINE' }
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
        'NORMAL': 'blue',
        'IMPORTANT': 'orange',
        'URGENT': 'red'
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
        'DRAFT': 'default',
    'PUBLISHED': 'success',
        'OFFLINE': 'warning'
      }
      return statusMap[status] || 'default'
    },
    
    // 获取数据
    fetchData() {
      this.loading = true
      
      // 模拟API调用
      setTimeout(() => {
        // 此处应替换为实际API调用
        const mockData = this.generateMockData()
        
        this.dataSource = mockData.list
        this.pagination.total = mockData.total
        this.pagination.current = this.searchParams.pageNum
        this.pagination.pageSize = this.searchParams.pageSize
        
        this.loading = false
      }, 500)
    },
    
    // 模拟数据（仅用于演示，应替换为实际API调用）
    generateMockData() {
      const total = 35
      const { pageNum, pageSize, keywords, noticeType, status } = this.searchParams
      
      // 生成随机数据
      let list = []
      for (let i = 0; i < pageSize && (pageNum - 1) * pageSize + i < total; i++) {
        const id = (pageNum - 1) * pageSize + i + 1
        const item = {
          id: `${id}`,
          title: `通知标题 ${id}`,
          noticeType: ['NORMAL', 'IMPORTANT', 'URGENT'][Math.floor(Math.random() * 3)],
          source: '信息中心',
          publishTime: '2023-07-15 10:00:00',
          validityEndTime: '2023-12-31 23:59:59',
          status: ['DRAFT', 'PUBLISHED', 'OFFLINE'][Math.floor(Math.random() * 3)],
          content: '<p>这是通知内容...</p>',
          attachments: [
            { id: '1', name: '附件1.docx', url: '#' },
            { id: '2', name: '附件2.pdf', url: '#' }
          ]
        }
        
        // 根据搜索条件过滤
        if (keywords && !item.title.includes(keywords)) {
          continue
        }
        if (noticeType && item.noticeType !== noticeType) {
          continue
        }
        if (status && item.status !== status) {
          continue
        }
        
        list.push(item)
      }
      
      return {
        list,
        total: list.length // 实际项目中应返回满足条件的总数
  }
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
        noticeType: 'NORMAL',
        source: '信息中心',
        validityEndTime: '',
    content: '',
        attachments: [],
        status: 'DRAFT',
        editRemarks: ''
      }
      this.modalVisible = true
    },
    
    // 编辑
    handleEdit(record) {
      this.modalTitle = '编辑通知'
      this.editMode = true
      // 深拷贝记录数据
      this.formData = JSON.parse(JSON.stringify(record))
      this.modalVisible = true
    },
    
    // 查看详情
    handleView(record) {
      this.detailLoading = true
      this.detailVisible = true
      
      // 模拟加载详情
      setTimeout(() => {
        this.detail = JSON.parse(JSON.stringify(record))
        this.detailLoading = false
      }, 300)
    },
    
    // 关闭详情弹窗
    handleDetailCancel() {
      this.detailVisible = false
    },
    
    // 表单提交
    handleFormSubmit(formData) {
      console.log('提交表单数据:', formData)
      
      // 模拟提交
      this.loading = true
      setTimeout(() => {
        this.$message.success(this.editMode ? '更新通知成功!' : '创建通知成功!')
        this.modalVisible = false
        this.fetchData()
      }, 500)
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
          // 模拟API调用
          this.loading = true
          setTimeout(() => {
            this.$message.success('通知发布成功!')
            this.fetchData()
          }, 500)
        }
      })
    },
    
    // 下线通知
    handleOffline(record) {
      this.$confirm({
        title: '确认下线',
        content: `确定要下线"${record.title}"吗?`,
        onOk: () => {
          // 模拟API调用
          this.loading = true
          setTimeout(() => {
            this.$message.success('通知已下线!')
            this.fetchData()
          }, 500)
        }
      })
    },
    
    // 删除通知
    handleDelete(record) {
      // 模拟API调用
      this.loading = true
      setTimeout(() => {
        this.$message.success('删除通知成功!')
        this.fetchData()
      }, 500)
    },
    
    // 下载附件
    handleDownload(file) {
      this.$message.info(`下载附件: ${file.name}`)
      // 实际项目中应调用文件下载API
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