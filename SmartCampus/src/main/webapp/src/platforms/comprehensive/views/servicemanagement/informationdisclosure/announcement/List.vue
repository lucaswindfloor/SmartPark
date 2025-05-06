<template>
  <div class="announcement-list-container">
    <a-card :bordered="false">
      <!-- 顶部操作区 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="10" :sm="12">
              <a-form-item label="标题">
                <a-input v-model="queryParam.title" placeholder="请输入标题关键词" />
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="12">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择状态" allowClear>
                  <a-select-option v-for="(item, index) in statusOptions" :key="index" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="12">
              <a-form-item label="类型">
                <a-select v-model="queryParam.type" placeholder="请选择类型" allowClear>
                  <a-select-option v-for="(item, index) in typeOptions" :key="index" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="12">
              <a-form-item label="日期">
                <a-range-picker v-model="dateRange" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="14" :sm="24">
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
        <!-- 视图切换 -->
        <div class="view-tabs">
          <a-radio-group v-model="queryParam.viewType" button-style="solid">
            <a-radio-button value="all">全部</a-radio-button>
            <a-radio-button value="draft">草稿</a-radio-button>
            <a-radio-button value="published">已发布</a-radio-button>
            <a-radio-button value="audit">审核中</a-radio-button>
            <a-radio-button value="expired">已过期</a-radio-button>
            <a-radio-button value="archive">已归档</a-radio-button>
          </a-radio-group>
          <a-button v-if="authStore.hasPermission('announcement:manage')" @click="goToRecycleBin" class="recycle-bin-btn">
            <template #icon><DeleteOutlined /></template>
            回收站
          </a-button>
        </div>
        
        <div>
            <a-button v-if="authStore.hasPermission('announcement:draft')" type="primary" @click="handleCreate">
                <template #icon><PlusOutlined /></template>
                新建
            </a-button>
            <a-dropdown v-if="selectedRowKeys.length > 0 && authStore.hasAnyPermission(['announcement:draft', 'announcement:manage'])">
            <template #overlay>
                <a-menu>
                <a-menu-item key="delete" @click="handleBatchDelete">批量删除</a-menu-item>
                </a-menu>
            </template>
            <a-button style="margin-left: 8px">
                批量操作 <DownOutlined />
            </a-button>
            </a-dropdown>
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
        :scroll="{ x: 1500, y: 500 }"
      >
        <!-- Single template for all body cells -->
        <template #bodyCell="{ column, text, record }">
          <!-- Title Column -->
          <template v-if="column.key === 'title'">
            <div class="notification-title-cell">
              <span style="margin-right: 8px;">
                <a-tooltip title="紧急" v-if="record.importance === 'emergency'">
                  <ExclamationCircleFilled style="color: red;" />
                </a-tooltip>
                <a-tooltip title="重要" v-else-if="record.importance === 'important'">
                  <StarFilled style="color: orange;" />
                </a-tooltip>
              </span>
              <a @click="handleView(record)" :class="{ 'unread-title': !record.isRead }" style="cursor: pointer;">{{ text }}</a>
              <a-tag v-if="record.isTop" color="red">置顶</a-tag>
            </div>
          </template>
          <!-- Type Column -->
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getTypeColor(text)">{{ getTypeName(text) }}</a-tag>
          </template>
          <!-- Status Column -->
          <template v-else-if="column.key === 'status'">
            <a-badge :status="getStatusType(text)" :text="getStatusName(text)" />
          </template>
          <!-- Publish Time Column -->
          <template v-else-if="column.key === 'publishTime'">
             {{ text ? moment(text).format('YYYY-MM-DD HH:mm') : '-' }}
          </template>
          <!-- Expiry Time Column -->
          <template v-else-if="column.key === 'expiryTime'">
            {{ text ? moment(text).format('YYYY-MM-DD HH:mm') : '永久有效' }}
          </template>
          <!-- Read Count Column -->
          <template v-else-if="column.key === 'readCount'">
            {{ text }}
          </template>
          <!-- Creator Column -->
          <template v-else-if="column.key === 'createByName'">
            {{ record.createByName || record.createBy || '-' }}
          </template>
          <!-- Publisher Column -->
          <template v-else-if="column.key === 'publisherName'">
            {{ record.publisherName || record.publisher || '-' }}
          </template>
          <!-- Action Column -->
          <template v-else-if="column.key === 'action'">
            <template v-if="record.status === 'draft' && isDrafterRole()">
                <a-space :size="8">
                    <a v-if="canEditRecord(record)" @click="handleEdit(record)">编辑</a>
                    <a v-if="canSubmitAuditRecord(record)" @click="handleSubmitAudit(record)">提交审核</a>
                    <a v-if="canDeleteRecord(record)" @click="handleDelete(record)">删除</a>
                </a-space>
            </template>
            <template v-else-if="!isDrafterRole() && record.status !== 'deleted'">
                <a-dropdown>
                    <a class="ant-dropdown-link">更多 <DownOutlined /></a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item v-if="record.status === 'draft' && authStore.hasPermission('announcement:publish')" @click="handlePublish(record)">直接发布</a-menu-item>
                            <a-menu-item v-if="record.status === 'audit' && authStore.hasPermission('announcement:audit')" @click="handleAudit(record)">审核</a-menu-item>
                            <a-menu-item v-if="record.status === 'published' && authStore.hasPermission('announcement:publish')" @click="handleCancel(record)">取消发布</a-menu-item>
                            <a-menu-item v-if="record.status === 'published' && authStore.hasPermission('announcement:manage')" @click="handleExtend(record)">延长有效期</a-menu-item>
                            <a-menu-item v-if="record.status === 'published' && authStore.hasPermission('announcement:manage')" @click="handleViewStatistics(record)">查看阅读统计</a-menu-item>
                            <a-menu-item v-if="(record.status === 'published' || record.status === 'expired') && authStore.hasPermission('announcement:archive')" @click="handleArchive(record)">归档</a-menu-item>
                            <a-menu-item v-if="canDeleteRecord(record)" @click="handleDelete(record)">删除</a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </template>
          </template>
          <!-- Default rendering for other columns -->
          <template v-else>
            {{ text }}
          </template>
        </template>
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
import { Table, Tag, Badge, Button, Dropdown, Menu, Radio, Input, Select, DatePicker, Card, Form, Row, Col, Divider, message, Modal, Space, Tooltip } from 'ant-design-vue'
import { DownOutlined, PlusOutlined, DeleteOutlined, ExclamationCircleFilled, StarFilled } from '@ant-design/icons-vue'
import { ref, reactive, onMounted, computed, watch } from 'vue'; // Import Vue 3 Composition API functions
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/core/stores/auth'; // Import the auth store
import { 
  getAnnouncementList,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  auditAnnouncement,
  archiveAnnouncement,
  extendAnnouncementValidity,
  submitAnnouncementAudit,
  cancelAnnouncement
} from '@/platforms/comprehensive/api/servicemanagement/informationdisclosure/announcement.js'
import moment from 'moment'
import OperationComponent from './components/OperationComponent.vue'

const { confirm } = Modal;

export default {
  name: 'AnnouncementList',
  components: {
    ATable: Table,
    ATag: Tag,
    ABadge: Badge,
    AButton: Button,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    ARadioGroup: Radio.Group,
    ARadioButton: Radio.Button,
    AInput: Input,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARangePicker: DatePicker.RangePicker,
    ACard: Card,
    AForm: Form,
    AFormItem: Form.Item,
    ARow: Row,
    ACol: Col,
    ADivider: Divider,
    OperationComponent,
    DownOutlined,
    PlusOutlined,
    DeleteOutlined,
    ASpace: Space,
    ATooltip: Tooltip,
    ExclamationCircleFilled,
    StarFilled
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore(); // Get the auth store instance
    const loading = ref(false);
    const tableData = ref([]);
    const operationComponent = ref(null); // Ref for the child component
    const pagination = reactive({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: total => `共 ${total} 条`
    });
    const queryParam = reactive({
        title: '',
        status: undefined,
        type: undefined,
        importance: undefined,
        startDate: null,
        endDate: null,
        viewType: 'all', // Default view type
        sortField: null,
        sortOrder: null
    });
    const dateRange = ref([]); // For the date picker model
    const selectedRowKeys = ref([]);
    const selectedRows = ref([]);

    // --- Constants for options (replace with actual data source if needed) ---
    const statusOptions = ref([
      { value: 'draft', label: '草稿' },
      { value: 'audit', label: '审核中' },
      { value: 'published', label: '已发布' },
      { value: 'expired', label: '已过期' },
      { value: 'archive', label: '已归档' },
      { value: 'cancelled', label: '已取消' }
    ]);
    const typeOptions = ref([
      { value: 'property', label: '物业公告' },
      { value: 'finance', label: '财务公告' },
      { value: 'security', label: '安全公告' }
    ]);
    const importanceOptions = ref([
        { value: 'emergency', label: '紧急' },
        { value: 'important', label: '重要' },
        { value: 'normal', label: '普通' },
    ]);

    // --- Table Columns Definition ---
    const columns = [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
        fixed: 'left',
        width: 300
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
        width: 100
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
          width: 100
        },
        {
        title: '发布者',
        dataIndex: 'publisher', // Assuming backend provides this (mapped from u.username)
          key: 'publisher',
        width: 120
        },
        {
          title: '发布时间',
          dataIndex: 'publishTime',
          key: 'publishTime',
        width: 160,
        sorter: true
        },
        {
          title: '阅读量',
        dataIndex: 'readCount', // Mapped from view_count
          key: 'readCount',
          width: 100,
          sorter: true
        },
        {
        title: '过期时间',
        dataIndex: 'expiryTime',
        key: 'expiryTime',
        width: 160
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
        width: 200
      }
    ];

    // --- Methods ---
    const fetchData = async () => {
      // Check if user has view permission before fetching
      if (!authStore.hasPermission('announcement:view')) {
        message.error('您没有查看公告列表的权限。');
        loading.value = false;
        tableData.value = [];
        pagination.total = 0;
        // Optionally redirect or show a more prominent message
        // router.replace({ name: 'Forbidden' });
        return;
      }
      
      loading.value = true;
      const params = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        ...queryParam,
        // Convert dateRange if needed
        startDate: dateRange.value && dateRange.value.length > 0 ? dateRange.value[0].format('YYYY-MM-DD') : null,
        endDate: dateRange.value && dateRange.value.length > 0 ? dateRange.value[1].format('YYYY-MM-DD') : null,
      };
      console.log('[List.vue] Fetching data with params:', JSON.stringify(params)); // Log 1: Parameters
      try {
        const response = await getAnnouncementList(params);
        console.log('[List.vue] Raw API response:', response); // Log 2: Raw Response
        console.log('[List.vue] Checking response.data structure:', response.data); // Log 2.5: Log response.data structure

        if (response && response.code === 200 && response.data) {
          const { items, total, page, pageSize } = response.data; 
          tableData.value = items || [];
          pagination.total = total || 0;
          pagination.current = page || 1;
          pagination.pageSize = pageSize || 10;
          console.log('[List.vue] Processed data assigned to tableData:', JSON.stringify(tableData.value)); // Log 3: Processed Data
        } else {
          tableData.value = [];
          pagination.total = 0;
          message.error(response?.message || '获取列表失败');
          console.error('[List.vue] Failed to fetch data or invalid response structure:', response);
        }
      } catch (error) {
        tableData.value = [];
        pagination.total = 0;
        message.error('请求失败: ' + error.message);
        console.error('[List.vue] Error fetching data:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleTableChange = (page, filters, sorter) => {
      console.log('[List.vue] Table change event:', page, filters, sorter);
      pagination.current = page.current;
      pagination.pageSize = page.pageSize;
      // Handle sorting
      if (sorter.field) {
        queryParam.sortField = sorter.field;
        queryParam.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
      } else {
        queryParam.sortField = null;
        queryParam.sortOrder = null;
      }
      // Handle filtering (if needed)
      // queryParam.status = filters.status ? filters.status[0] : undefined;
      fetchData();
    };

    const resetSearch = () => {
      queryParam.title = '';
      queryParam.status = undefined;
      queryParam.type = undefined;
      queryParam.importance = undefined;
      dateRange.value = [];
      queryParam.startDate = null;
      queryParam.endDate = null;
      queryParam.sortField = null;
      queryParam.sortOrder = null;
      pagination.current = 1; // Reset to first page
      fetchData(); // Refresh table
    };

    const onSelectChange = (keys, rows) => {
      selectedRowKeys.value = keys;
      selectedRows.value = rows;
    };

    const rowSelection = computed(() => ({
      selectedRowKeys: selectedRowKeys.value,
      onChange: onSelectChange,
    }));

    // Watch for viewType changes to refetch data
    watch(() => queryParam.viewType, () => {
      pagination.current = 1; // Reset to page 1 when view type changes
      fetchData();
    });
    
    // Watch for dateRange changes
    watch(dateRange, (newRange) => {
      queryParam.startDate = newRange && newRange.length > 0 ? newRange[0].format('YYYY-MM-DD') : null;
      queryParam.endDate = newRange && newRange.length > 0 ? newRange[1].format('YYYY-MM-DD') : null;
      // Optionally trigger fetchData() immediately or wait for explicit search button click
      // fetchData(); 
    });

    // --- CRUD and other actions (placeholders) ---
    const handleCreate = () => {
      if (!authStore.hasPermission('announcement:draft')) {
        message.error('您没有创建公告的权限。');
        return;
      }
      console.log('Create clicked');
      // router.push({ name: 'AnnouncementCreate' }); // Assuming you have a create route
      message.info('新建功能待实现');
    };

    const handleView = (record) => {
      console.log('View clicked', record);
      // router.push({ name: 'AnnouncementDetail', params: { id: record.id } }); // Assuming you have a detail route
       message.info('查看功能待实现');
    };

    const handleEdit = (record) => {
      if (!authStore.hasPermission('announcement:draft')) {
          message.error('您没有编辑公告的权限。');
          return;
      }
      console.log('Edit clicked', record);
      // router.push({ name: 'AnnouncementEdit', params: { id: record.id } }); // Assuming you have an edit route
       message.info('编辑功能待实现');
    };
    
    const handleDelete = (record) => {
      if (!authStore.hasAnyPermission(['announcement:draft', 'announcement:manage'])) {
        message.error('您没有删除公告的权限。');
        return;
      }
      confirm({
        title: '确认删除',
        content: `您确定要删除通知 "${record.title}" 吗? 此操作会将其移入回收站。`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            // await deleteAnnouncement(record.id); // Call actual API
            message.success('删除成功 (模拟)');
            fetchData(); // Refresh list
          } catch (error) {
            message.error('删除失败: ' + error.message);
          }
        },
      });
    };

    const handleBatchDelete = () => {
       if (!authStore.hasAnyPermission(['announcement:draft', 'announcement:manage'])) {
        message.error('您没有批量删除公告的权限。');
        return;
      }
      if (selectedRowKeys.value.length === 0) {
        message.warning('请至少选择一项进行删除');
        return;
      }
      confirm({
        title: '确认批量删除',
        content: `您确定要删除选中的 ${selectedRowKeys.value.length} 条通知吗? 此操作会将其移入回收站。`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            // await batchDeleteAnnouncements(selectedRowKeys.value); // Call actual API
            message.success(`成功删除 ${selectedRowKeys.value.length} 条通知 (模拟)`);
            selectedRowKeys.value = []; // Clear selection
            selectedRows.value = [];
            fetchData(); // Refresh list
          } catch (error) {
            message.error('批量删除失败: ' + error.message);
          }
        },
      });
    };
    
    const goToRecycleBin = () => {
       if (!authStore.hasPermission('announcement:manage')) {
          message.error('您没有访问回收站的权限。');
          return;
      }
      message.info('回收站功能待实现');
      // router.push({ name: 'AnnouncementRecycleBin' });
    };

    // --- More action handlers (SubmitAudit, Publish, Audit, Cancel, Extend, ViewStats, Archive) ---
    const handleSubmitAudit = (record) => {
        if (!authStore.hasPermission('announcement:submit')) {
            message.error('您没有提交审核的权限。');
            return;
        }
        message.info('提交审核待实现');
    };
    const handlePublish = (record) => {
        if (!authStore.hasPermission('announcement:publish')) {
            message.error('您没有直接发布的权限。');
            return;
        }
         message.info('直接发布待实现');
    };
    const handleAudit = (record) => { message.info('审核待实现'); };
    const handleCancel = (record) => { message.info('取消发布待实现'); };
    const handleExtend = (record) => { message.info('延长有效期待实现'); };
    const handleViewStatistics = (record) => { message.info('查看统计待实现'); };
    const handleArchive = (record) => { message.info('归档待实现'); };

    // --- Helper functions for rendering ---
    const getTypeColor = (type) => {
      const colors = { property: 'blue', finance: 'purple', security: 'red' };
      return colors[type] || 'default';
    };
    const getTypeName = (type) => {
      const names = { property: '物业公告', finance: '财务公告', security: '安全公告' };
      return names[type] || type;
    };
    const getStatusType = (status) => {
      const types = { draft: 'default', audit: 'processing', published: 'success', expired: 'warning', archive: 'default', cancelled: 'error' };
      return types[status] || 'default';
    };
    const getStatusName = (status) => {
      const names = { draft: '草稿', audit: '审核中', published: '已发布', expired: '已过期', archive: '已归档', cancelled: '已取消' };
      return names[status] || status;
    };

    // --- Reactive Permission Check Functions (Simplified for Drafter) ---

    const isDrafterRole = () => {
        const hasDraftPerm = authStore.hasPermission('announcement:draft');
        const canManageOrAdmin = authStore.hasPermission('announcement:manage') || authStore.hasPermission('announcement:admin');
        return hasDraftPerm && !canManageOrAdmin;
    };

    const canEditRecord = (record) => {
      const isDraft = record.status === 'draft';
      const hasDraftPerm = authStore.hasPermission('announcement:draft');
      // Drafter can edit ANY draft if they have the permission
      return isDraft && hasDraftPerm;
    };

    const canSubmitAuditRecord = (record) => {
      const isDraft = record.status === 'draft';
      const hasSubmitPerm = authStore.hasPermission('announcement:submit');
      // Drafter can submit ANY draft if they have the permission
      return isDraft && hasSubmitPerm;
    };

    const canDeleteRecord = (record) => {
        console.log(`[canDeleteRecord] Checking record ID: ${record.id}, Status: ${record.status}, Current User Permissions Check`);

        const isDraft = record.status === 'draft';
        
        // Scenario 1: Drafter (can delete ANY draft if they have the permission)
        const hasDraftPerm = authStore.hasPermission('announcement:draft');
        const canManageOrAdmin = authStore.hasPermission('announcement:manage') || authStore.hasPermission('announcement:admin');
        const isLikelyDrafter = hasDraftPerm && !canManageOrAdmin; // Check if user is primarily a drafter
        
        if (isLikelyDrafter && isDraft) {
             console.log('[canDeleteRecord] Result: true (Drafter deleting a draft)');
             return true;
        }

        // Scenario 2: Manager/Admin (can delete more broadly)
        if (canManageOrAdmin && record.status !== 'archive') { // Example: Can delete anything not archived
            console.log(`[canDeleteRecord] Result: true (Manager/Admin deleting status: ${record.status})`);
            return true; 
        }

        console.log('[canDeleteRecord] Result: false (No condition met)');
        return false;
    };

    // --- OperationComponent Event Handlers (Already defined, ensure they are correct) ---
    const onAuditSubmit = (formData) => {
        console.log('Audit Submitted Data:', formData);
        message.success('审核提交成功 (模拟)');
        fetchData(); 
    };
    const onPublishSubmit = (formData) => {
        console.log('Publish Submitted Data:', formData);
        message.success('发布成功 (模拟)');
        fetchData(); 
    };
    const onCancelSubmit = (formData) => {
        console.log('Cancel Submitted Data:', formData);
        message.success('取消发布成功 (模拟)');
         fetchData(); 
    };
    const onExtendSubmit = (formData) => {
        console.log('Extend Submitted Data:', formData);
        message.success('延长有效期成功 (模拟)');
         fetchData(); 
    };

    // --- Lifecycle Hook ---
    onMounted(() => {
      console.log('[List.vue] Component mounted. Fetching initial data...');
      // Fetch data only if user has view permission. 
      // The permission checks in the template will reactively update once authStore is ready.
      if (authStore.hasPermission('announcement:view')) {
         fetchData();
      } else {
         message.error('您没有查看公告列表的权限。');
      }
    });

    // --- Return values for template (Ensure canDelete is returned) ---
    return {
      loading,
      tableData,
      pagination,
      queryParam,
      dateRange,
      columns,
      statusOptions,
      typeOptions,
      importanceOptions,
      selectedRowKeys,
      rowSelection,
      operationComponent, // Return ref for child component
      // Methods
      fetchData, // Expose fetchData if needed for manual refresh
      handleTableChange,
      resetSearch,
      handleCreate,
      handleView,
      handleEdit,
      handleDelete,
      handleBatchDelete,
      goToRecycleBin,
      // More action handlers
      handleSubmitAudit,
      handlePublish,
      handleAudit,
      handleCancel,
      handleExtend,
      handleViewStatistics,
      handleArchive,
      // Helpers
      getTypeColor,
      getTypeName,
      getStatusType,
      getStatusName,
      moment, // Expose moment for template usage
      authStore, // Expose authStore to the template
      isDrafterRole,
      canEditRecord,
      canSubmitAuditRecord,
      canDeleteRecord,
      // Handlers for OperationComponent (already defined and likely returned implicitly by options API structure)
      onAuditSubmit,
      onPublishSubmit,
      onCancelSubmit,
      onExtendSubmit
    };
  }
}
</script>

<style lang="less" scoped>
.announcement-list-container { /* Renamed from notification-list-container */
  /* Ensure it takes up available height and allows scrolling */
  height: 100%; /* Or calc(100vh - headerHeight - footerHeight - etc.) if needed */
  overflow-y: auto; /* Enable vertical scrollbar when content overflows */
  display: flex; /* Use flexbox for better internal layout control */
  flex-direction: column; /* Stack elements vertically */

  .ant-card {
    flex-grow: 1; /* Allow card to grow and fill space */
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Prevent card itself from causing double scrollbars */

    :deep(.ant-card-body) { // Target the card body
       display: flex;
       flex-direction: column;
       flex-grow: 1;
       overflow: hidden; // Prevent card body overflow issues
       padding: 15px; // Adjust padding as needed
    }
  }

  .table-page-search-wrapper {
     margin-bottom: 16px; // Keep some space
     flex-shrink: 0; // Prevent search area from shrinking
  }

  .table-operator {
    margin-bottom: 16px; // Keep some space
    flex-shrink: 0; // Prevent operator area from shrinking
    /* Combined existing rules */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .ant-table-wrapper {
     flex-grow: 1; // Allow table wrapper to take remaining space
     overflow: hidden; // Let the internal table scrolling handle table overflow
  }

  /* Existing styles below */
  .table-page-search-wrapper .ant-form-inline .ant-form-item {
    margin-bottom: 12px;
  }
  
  /* Styles for .table-operator children */
  .table-operator {
    .view-tabs {
      display: flex;
      align-items: center;
      
      .ant-radio-button-wrapper {
        margin-right: 4px;
        padding: 0 12px;
        border-radius: 4px !important;
        border-color: #d9d9d9;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        
        &:hover {
          color: #1890ff;
          border-color: #1890ff;
          background-color: #e6f7ff;
          z-index: 1;
        }

        &.ant-radio-button-wrapper-checked {
          color: #fff;
          background-color: #1890ff;
          border-color: #1890ff;
          box-shadow: -1px 0 0 0 #1890ff; 
          z-index: 1;
          
          &:hover {
             background-color: #096dd9;
             border-color: #096dd9;
          }
          
          &::before {
             background-color: transparent !important;
          }
        }
      }
      
      .recycle-bin-btn {
        margin-left: 16px;
      }
    }
  }
  
  .notification-title-cell { /* Keep this specific class if it's used only for the title */
    .unread-title {
      font-weight: bold;
    }
  }
  
  .table-page-search-submitButtons {
    white-space: nowrap;
  }
}

.notification-title-cell a {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s;
}
.notification-title-cell a:hover {
  color: #1890ff;
}
</style> 