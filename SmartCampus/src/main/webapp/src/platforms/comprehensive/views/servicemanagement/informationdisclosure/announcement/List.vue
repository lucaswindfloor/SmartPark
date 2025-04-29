<template>
  <div class="notification-list-container">
    <a-card :bordered="false">
      <!-- 顶部操作区 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="queryParam.title" placeholder="请输入标题关键词" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择状态" allowClear>
                  <a-select-option v-for="(item, index) in statusOptions" :key="index" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="类型">
                <a-select v-model="queryParam.type" placeholder="请选择类型" allowClear>
                  <a-select-option v-for="(item, index) in typeOptions" :key="index" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="日期">
                <a-range-picker v-model="dateRange" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
    </div>

      <!-- 操作按钮区 -->
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleCreate">新建</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="delete" @click="handleBatchDelete">批量删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        
        <!-- 视图切换 -->
        <div class="view-tabs">
          <a-radio-group v-model="viewType" button-style="solid">
            <a-radio-button value="all">全部</a-radio-button>
            <a-radio-button value="draft">草稿</a-radio-button>
            <a-radio-button value="published">已发布</a-radio-button>
            <a-radio-button value="audit">审核中</a-radio-button>
            <a-radio-button value="expired">已过期</a-radio-button>
            <a-radio-button value="archive">已归档</a-radio-button>
          </a-radio-group>
          <a-button icon="delete" @click="goToRecycleBin" class="recycle-bin-btn">回收站</a-button>
        </div>
    </div>

      <!-- 表格区域 -->
      <a-table  
        ref="table"
        size="default"
        :columns="columns"
        :data-source="tableData" 
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        row-key="id" 
        :alert="true"
        :rowSelection="rowSelection"
        :scroll="{ x: 1500 }"
      >
        <!-- 标题列自定义 -->
        <span slot="titleSlot" slot-scope="text, record">
          <div class="notification-title-cell">
            <span :class="{ 'unread-title': !record.isRead }">{{ text }}</span>
            <a-tag v-if="record.isTop" color="red">置顶</a-tag>
            <a-tag v-if="record.isImportant" color="orange">重要</a-tag>
          </div>
        </span>

        <!-- 类型列自定义 -->
        <span slot="typeSlot" slot-scope="text">
          <a-tag :color="getTypeColor(text)">{{ getTypeName(text) }}</a-tag>
        </span>

        <!-- 状态列自定义 -->
        <span slot="statusSlot" slot-scope="text">
          <a-badge :status="getStatusType(text)" :text="getStatusName(text)" />
        </span>

        <!-- 操作列自定义 -->
        <span slot="action" slot-scope="text, record">
          <a @click="handleView(record)">查看</a>
          <a-divider type="vertical" />
          <a v-if="record.status === 'draft'" @click="handleEdit(record)">编辑</a>
          <a-divider v-if="record.status === 'draft'" type="vertical" />
          <a-dropdown v-if="record.status !== 'deleted'">
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.status === 'draft'" @click="handleSubmitAudit(record)">
                提交审核
              </a-menu-item>
              <a-menu-item v-if="record.status === 'draft'" @click="handlePublish(record)">
                直接发布
              </a-menu-item>
              <a-menu-item v-if="record.status === 'audit'" @click="handleAudit(record)">
                审核
              </a-menu-item>
              <a-menu-item v-if="record.status === 'published'" @click="handleCancel(record)">
                取消发布
              </a-menu-item>
              <a-menu-item v-if="record.status === 'published'" @click="handleExtend(record)">
                延长有效期
              </a-menu-item>
              <a-menu-item v-if="record.status === 'published'" @click="handleViewStatistics(record)">
                查看阅读统计
              </a-menu-item>
              <a-menu-item v-if="record.status === 'published' || record.status === 'expired'" @click="handleArchive(record)">
                归档
              </a-menu-item>
              <a-menu-item @click="handleDelete(record)">
                删除
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </a-card>
    
    <!-- 操作组件 -->
    <operation-component 
      ref="operationComponent"
      @on-audit-submit="onAuditSubmit"
      @on-publish-submit="onPublishSubmit"
      @on-cancel-submit="onCancelSubmit"
      @on-extend-submit="onExtendSubmit"
      />
  </div>
</template>

<script>
import { Table } from 'ant-design-vue'
import { 
  getNotificationList, 
  deleteNotification, 
  submitNotificationAudit,
  auditNotification,
  publishNotification,
  cancelNotification,
  archiveNotification,
  extendNotificationValidity
} from '@/api/notification'
import moment from 'moment'
import OperationComponent from './components/OperationComponent.vue'

export default {
  name: 'NotificationList',
  components: {
    ATable: Table,
    OperationComponent
  },
  data () {
    return {
      // 表格加载状态
      loading: false,
      // 表格数据
      tableData: [],
      // 分页配置
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: total => `共 ${total} 条`
      },
      // 查询参数
      queryParam: {
        title: '',
        status: undefined,
        type: undefined
      },
      // 日期范围
      dateRange: [],
      // 表格列定义
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
          scopedSlots: { customRender: 'titleSlot' },
          width: 300,
          ellipsis: true
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'typeSlot' },
          width: 100
        },
        {
          title: '发布人',
          dataIndex: 'publisher',
          key: 'publisher',
          width: 100
        },
        {
          title: '发布时间',
          dataIndex: 'publishTime',
          key: 'publishTime',
          width: 150,
          sorter: true,
          customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm') : '-'
          }
        },
        {
          title: '失效时间',
          dataIndex: 'expiryTime',
          key: 'expiryTime',
          width: 150,
          customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm') : '永久有效'
          }
        },
        {
          title: '阅读量',
          dataIndex: 'readCount',
          key: 'readCount',
          width: 100,
          sorter: true
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
          dataIndex: 'action',
          key: 'action',
          fixed: 'right',
          width: 160,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 (Modified for a-table)
      loadData: parameter => {
        this.loading = true;
        const pageNo = parameter.current || this.pagination.current;
        const pageSize = parameter.pageSize || this.pagination.pageSize;

        // 合并查询参数
        const requestParam = {
          pageNo: pageNo,
          pageSize: pageSize,
          ...this.queryParam
        }
        
        // 处理日期范围
        if (this.dateRange && this.dateRange.length === 2) {
          requestParam.startDate = this.dateRange[0].format('YYYY-MM-DD')
          requestParam.endDate = this.dateRange[1].format('YYYY-MM-DD')
        }
        
        // 根据视图类型设置状态过滤
        if (this.viewType !== 'all') {
          requestParam.viewType = this.viewType
        }
        
        return getNotificationList(requestParam)
          .then(res => {
            this.tableData = res.data.records || [];
            this.pagination = {
              ...this.pagination,
              current: res.data.current || 1,
              pageSize: res.data.size || 10,
              total: res.data.total || 0
            };
            return res.data; // Return raw data or just resolve
          })
          .catch(err => {
            console.error("Error loading notification list:", err);
            this.$message.error('加载列表失败');
            this.tableData = []; // Clear data on error
            this.pagination.total = 0;
          })
          .finally(() => {
            this.loading = false;
          })
      },
      // 选择行配置
      selectedRowKeys: [],
      selectedRows: [],
      // 选择行事件
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      },
      // 视图类型
      viewType: 'all',
      // 状态选项
      statusOptions: [
        { label: '草稿', value: 'draft' },
        { label: '审核中', value: 'audit' },
        { label: '已发布', value: 'published' },
        { label: '已过期', value: 'expired' },
        { label: '已归档', value: 'archive' }
      ],
      // 类型选项
      typeOptions: [
        { label: '通知', value: 'notice' },
        { label: '公告', value: 'announcement' },
        { label: '重要通知', value: 'important' },
        { label: '紧急通知', value: 'urgent' }
      ]
    }
  },
  watch: {
    viewType () {
      this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize })
    }
  },
  methods: {
    // Handle table changes (pagination, sorting, filtering)
    handleTableChange(pagination, filters, sorter) {
      console.log('Table change:', pagination, filters, sorter);
      this.pagination = pagination;
      // Add sorting/filtering params to queryParam if needed
      // this.queryParam.sortField = sorter.field;
      // this.queryParam.sortOrder = sorter.order;
      this.loadData({ current: pagination.current, pageSize: pagination.pageSize /*, ...sorter */ });
    },

    // 重置搜索
    resetSearch () {
      this.queryParam = {
        title: '',
        status: undefined,
        type: undefined
      }
      this.dateRange = []
      // Reset pagination and reload data
      this.pagination.current = 1;
      this.loadData({ current: 1, pageSize: this.pagination.pageSize });
    },
    
    // 获取类型名称
    getTypeName (type) {
      const found = this.typeOptions.find(item => item.value === type)
      return found ? found.label : type
    },
    
    // 获取类型颜色
    getTypeColor (type) {
      const colorMap = {
        notice: 'blue',
        announcement: 'green',
        important: 'orange',
        urgent: 'red'
      }
      return colorMap[type] || 'default'
    },
    
    // 获取状态类型
    getStatusType (status) {
      const statusMap = {
        draft: 'default',
        audit: 'processing',
        published: 'success',
        expired: 'warning',
        archive: 'default'
      }
      return statusMap[status] || 'default'
    },
    
    // 获取状态名称
    getStatusName (status) {
      const statusMap = {
        draft: '草稿',
        audit: '审核中',
        published: '已发布',
        expired: '已过期',
        archive: '已归档'
      }
      return statusMap[status] || status
    },
    
    // 新建通知
    handleCreate () {
      this.$router.push({ path: '/comprehensive/service/information/notification/create' })
    },
    
    // 编辑通知
    handleEdit (record) {
      this.$router.push({ path: `/comprehensive/service/information/notification/edit/${record.id}` })
    },
    
    // 查看通知
    handleView (record) {
      this.$router.push({ path: `/comprehensive/service/information/notification/view/${record.id}` })
    },
    
    // 提交审核
    handleSubmitAudit (record) {
      this.$confirm({
        title: '确定要提交该通知公告进行审核吗？',
        content: '提交后将无法修改，审核通过后才能发布',
        onOk: () => {
          submitNotificationAudit(record.id).then(res => {
            this.$message.success('提交审核成功')
            this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize })
          }).catch(err => {
            this.$message.error('提交审核失败：' + err.message)
          })
        }
      })
    },
    
    // 审核通知
    handleAudit (record) {
      this.$refs.operationComponent.showAuditDialog(record)
    },
    
    // 发布通知
    handlePublish (record) {
      this.$refs.operationComponent.showPublishDialog(record)
    },
    
    // 取消发布
    handleCancel (record) {
      this.$refs.operationComponent.showCancelDialog(record)
    },
    
    // 延长有效期
    handleExtend (record) {
      this.$refs.operationComponent.showExtendDialog(record)
    },
    
    // 查看阅读统计
    handleViewStatistics (record) {
      this.$router.push({ path: `/comprehensive/service/information/notification/statistics/${record.id}` })
    },
    
    // 归档通知
    handleArchive (record) {
      this.$confirm({
        title: '确定要归档该通知公告吗？',
        content: '归档后将不再向用户展示',
        onOk: () => {
          archiveNotification(record.id).then(res => {
            this.$message.success('归档成功')
            this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize })
          }).catch(err => {
            this.$message.error('归档失败：' + err.message)
          })
        }
      })
    },

    // 删除通知
    handleDelete (record) {
      this.$confirm({
        title: '确定要删除该通知公告吗？',
        content: '删除后可在回收站找回',
        onOk: () => {
          deleteNotification(record.id).then(res => {
            this.$message.success('删除成功')
            this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize })
          }).catch(err => {
            this.$message.error('删除失败：' + err.message)
          })
        }
      })
    },

    // 批量删除
    handleBatchDelete () {
      this.$confirm({
        title: `确定要删除选中的 ${this.selectedRowKeys.length} 条记录吗？`,
        content: '删除后可在回收站找回',
        onOk: () => {
          const deletePromises = this.selectedRowKeys.map(id => deleteNotification(id))
          Promise.all(deletePromises).then(() => {
            this.$message.success('批量删除成功')
            this.selectedRowKeys = []
            this.selectedRows = []
            this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize })
          }).catch(err => {
            this.$message.error('批量删除失败：' + err.message)
          })
        }
      })
    },
    
    // 前往回收站
    goToRecycleBin () {
      this.$router.push({ path: '/comprehensive/service/information/notification/recycle-bin' })
    },
    
    // 审核提交回调
    onAuditSubmit (record, data) {
      auditNotification(record.id, data).then(res => {
        this.$message.success('审核操作成功')
        this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize })
      }).catch(err => {
        this.$message.error('审核操作失败：' + err.message)
      })
    },
    
    // 发布提交回调
    onPublishSubmit (record, data) {
      publishNotification(record.id, data).then(res => {
        this.$message.success('发布成功')
        this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize })
      }).catch(err => {
        this.$message.error('发布失败：' + err.message)
      })
    },
    
    // 取消发布回调
    onCancelSubmit (record, data) {
      cancelNotification(record.id, data).then(res => {
        this.$message.success('取消发布成功')
        this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize })
      }).catch(err => {
        this.$message.error('取消发布失败：' + err.message)
      })
    },
    
    // 延长有效期回调
    onExtendSubmit (record, data) {
      extendNotificationValidity(record.id, data).then(res => {
        this.$message.success('延长有效期成功')
        this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize })
      }).catch(err => {
        this.$message.error('延长有效期失败：' + err.message)
      })
    },

    // Refresh function to be called externally if needed
    refreshTable(resetPage = false) {
        if (resetPage) {
            this.pagination.current = 1;
        }
        this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize });
    }
  },
  mounted() {
      // Load initial data when component mounts
      this.loadData({ current: this.pagination.current, pageSize: this.pagination.pageSize });
  }
}
</script>

<style lang="less" scoped>
.notification-list-container {
  .table-operator {
    margin-bottom: 18px;
  display: flex;
  justify-content: space-between;
    
    .view-tabs {
      display: flex;
      align-items: center;
      
      .recycle-bin-btn {
        margin-left: 16px;
      }
    }
  }
  
  .notification-title-cell {
    .unread-title {
      font-weight: bold;
    }
  }
  
  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style> 