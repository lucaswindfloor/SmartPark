<template>
  <div class="notice-management">
    <a-card>
      <!-- 搜索工具栏 -->
      <div class="toolbar">
        <a-space>
          <a-input
            v-model:value="searchText"
            placeholder="搜索通知标题"
            style="width: 200px"
            @pressEnter="applyFilters"
          >
            <template #prefix>
              <search-outlined />
            </template>
          </a-input>
          <a-select
            v-model:value="statusFilter"
            placeholder="状态"
            style="width: 120px"
            allowClear
            @change="applyFilters"
          >
            <a-select-option v-for="(value, key) in STATUS_MAP" :key="key" :value="key">
              {{ value.text }}
            </a-select-option>
          </a-select>
          <a-select
            v-model:value="categoryFilter"
            placeholder="类别"
            style="width: 120px"
            allowClear
            @change="applyFilters"
          >
            <a-select-option v-for="(value, key) in CATEGORY_MAP" :key="key" :value="key">
              {{ value }}
            </a-select-option>
          </a-select>
          <a-range-picker 
            v-model:value="dateRange" 
            @change="onDateChange" 
          />
          <a-button type="primary" @click="applyFilters">查询</a-button>
          <a-button @click="resetFilters">重置</a-button>
        </a-space>
        
        <div>
          <a-button type="primary" @click="handleCreate" v-if="hasPermission(PERMISSIONS.CREATE)">
            <template #icon><plus-outlined /></template>
            新建通知
          </a-button>
        </div>
      </div>
      
      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="noticeList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        row-key="id"
      >
        <!-- 标题列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <div class="title-cell">
              <a-space>
                <span class="title-text">{{ record.title }}</span>
                <a-tag color="red" v-if="record.isTop">置顶</a-tag>
                <a-tag color="blue" v-if="record.requireConfirmation">需确认</a-tag>
              </a-space>
            </div>
          </template>
          
          <!-- 类别列 -->
          <template v-else-if="column.key === 'category'">
            <span>{{ CATEGORY_MAP[record.category] }}</span>
          </template>
          
          <!-- 状态列 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="STATUS_MAP[record.status].color">
              {{ STATUS_MAP[record.status].text }}
            </a-tag>
          </template>
          
          <!-- 公开范围列 -->
          <template v-else-if="column.key === 'publicRange'">
            <a-space>
              <a-tooltip v-for="range in record.publicRange" :key="range" :title="PUBLIC_RANGE_MAP[range].text">
                <a-tag>{{ PUBLIC_RANGE_MAP[range].icon }} {{ PUBLIC_RANGE_MAP[range].text }}</a-tag>
              </a-tooltip>
            </a-space>
          </template>
          
          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                <template #icon><eye-outlined /></template>
                查看
              </a-button>
              
              <a-button 
                v-if="record.status === 'draft' && hasPermission(PERMISSIONS.UPDATE)" 
                type="link" 
                size="small" 
                @click="handleEdit(record)"
              >
                <template #icon><edit-outlined /></template>
                编辑
              </a-button>
              
              <a-button 
                v-if="record.status === 'draft' && hasPermission(PERMISSIONS.UPDATE)" 
                type="link" 
                size="small" 
                @click="handleSubmitReview(record)"
              >
                <template #icon><check-circle-outlined /></template>
                提交审核
              </a-button>
              
              <a-button 
                v-if="record.status === 'pending' && hasPermission(PERMISSIONS.REVIEW)" 
                type="link" 
                size="small" 
                @click="handleReview(record)"
              >
                <template #icon><check-circle-outlined /></template>
                审核
              </a-button>
              
              <a-button 
                v-if="record.status === 'published' && hasPermission(PERMISSIONS.TOP)" 
                type="link" 
                size="small" 
                @click="handleToggleTop(record)"
              >
                <template #icon><vertical-align-top-outlined /></template>
                {{ record.isTop ? '取消置顶' : '置顶' }}
              </a-button>
              
              <a-popconfirm
                v-if="hasPermission(PERMISSIONS.DELETE)"
                title="确定要删除此通知吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" size="small" danger>
                  <template #icon><delete-outlined /></template>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    
    <!-- 通知公告表单对话框 -->
    <a-modal
      v-model:visible="formVisible"
      :title="formMode === 'create' ? '新建通知' : (formMode === 'edit' ? '编辑通知' : '查看通知')"
      :confirm-loading="formLoading"
      :maskClosable="false"
      @ok="handleFormSubmit"
      :footer="formMode === 'view' ? null : undefined"
      width="800px"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        :disabled="formMode === 'view'"
      >
        <a-form-item label="标题" name="title">
          <a-input v-model:value="form.title" placeholder="请输入通知标题" />
        </a-form-item>
        
        <a-form-item label="类别" name="category">
          <a-select v-model:value="form.category" placeholder="请选择通知类别">
            <a-select-option v-for="(value, key) in CATEGORY_MAP" :key="key" :value="key">
              {{ value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="公开范围" name="publicRange">
          <a-select
            v-model:value="form.publicRange"
            mode="multiple"
            placeholder="请选择公开范围"
          >
            <a-select-option v-for="(value, key) in PUBLIC_RANGE_MAP" :key="key" :value="key">
              {{ value.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="通知内容" name="content">
          <!-- 在实际实现中，这里应该使用富文本编辑器组件 -->
          <a-textarea v-model:value="form.content" :rows="8" placeholder="请输入通知内容" />
        </a-form-item>
        
        <a-form-item label="需要确认" name="requireConfirmation">
          <a-switch v-model:checked="form.requireConfirmation" />
        </a-form-item>
      </a-form>
      
      <template v-if="formMode === 'view'">
        <div class="form-footer">
          <a-button @click="formVisible = false">关闭</a-button>
        </div>
      </template>
    </a-modal>
    
    <!-- 审核对话框 -->
    <a-modal
      v-model:visible="reviewFormVisible"
      title="审核通知"
      :confirm-loading="formLoading"
      @ok="handleReviewSubmit"
    >
      <a-form
        ref="reviewFormRef"
        :model="reviewForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="审核结果" name="status">
          <a-radio-group v-model:value="reviewForm.status">
            <a-radio value="published">通过</a-radio>
            <a-radio value="rejected">拒绝</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="拒绝原因" name="reason" v-if="reviewForm.status === 'rejected'">
          <a-textarea v-model:value="reviewForm.reason" :rows="4" placeholder="请输入拒绝原因" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  VerticalAlignTopOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  GlobalOutlined,
  FileTextOutlined,
  BellOutlined
} from '@ant-design/icons-vue';
import { getNoticeList, getNoticeDetail, createNotice, updateNotice, deleteNotice, reviewNotice, toggleNoticeTop } from '../../api/information';
import { useUserStore } from '../../../../stores/user';

// 用户store
const userStore = useUserStore();

// 状态枚举映射
const STATUS_MAP = {
  draft: { text: '草稿', color: 'default' },
  pending: { text: '待审核', color: 'processing' },
  published: { text: '已发布', color: 'success' },
  rejected: { text: '已拒绝', color: 'error' },
  expired: { text: '已过期', color: 'warning' },
};

// 类别映射
const CATEGORY_MAP = {
  notice: '通知',
  announcement: '公告',
  important: '重要通知',
};

// 公开范围映射
const PUBLIC_RANGE_MAP = {
  enterprise: { text: '企业', icon: '<TeamOutlined />' },
  employee: { text: '员工', icon: '<UserOutlined />' }, 
  public: { text: '公众', icon: '<GlobalOutlined />' },
};

// 权限定义
const PERMISSIONS = {
  CREATE: 'information:notice:create',
  UPDATE: 'information:notice:update',
  DELETE: 'information:notice:delete',
  REVIEW: 'information:notice:review',
  PUBLISH: 'information:notice:publish',
  TOP: 'information:notice:top',
};

// 表格列配置
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
  },
  {
    title: '类别',
    dataIndex: 'category',
    key: 'category',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '公开范围',
    dataIndex: 'publicRange',
    key: 'publicRange',
    width: 200,
  },
  {
    title: '查看数',
    dataIndex: 'viewCount',
    key: 'viewCount',
    width: 100,
  },
  {
    title: '确认数',
    dataIndex: 'confirmCount',
    key: 'confirmCount',
    width: 100,
    customRender: ({ text, record }) => record.requireConfirmation ? text : '-',
  },
  {
    title: '创建人',
    dataIndex: 'createdBy',
    key: 'createdBy',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 300,
    fixed: 'right',
  },
];

// 响应式状态
const noticeList = ref([]);
const loading = ref(false);
const formVisible = ref(false);
const formLoading = ref(false);
const formMode = ref('create');
const reviewFormVisible = ref(false);
const searchText = ref('');
const statusFilter = ref(null);
const categoryFilter = ref(null);
const dateRange = ref(null);
const currentNotice = ref(null);

// 表单状态
const form = reactive({
  title: '',
  category: 'notice',
  content: '',
  publicRange: ['enterprise', 'employee'],
  requireConfirmation: false,
});

// 审核表单状态
const reviewForm = reactive({
  status: 'published',
  reason: '',
});

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入通知标题' }],
  category: [{ required: true, message: '请选择通知类别' }],
  publicRange: [{ required: true, message: '请选择公开范围' }],
  content: [{ required: true, message: '请输入通知内容' }],
};

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`,
});

// 检查权限
const hasPermission = (permission) => {
  // 实际应该调用userStore中的权限检查方法
  return true; // 示例中默认返回true
};

// 表格变化处理
const handleTableChange = (pag) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchNoticeList();
};

// 日期选择变化
const onDateChange = (dates) => {
  dateRange.value = dates;
};

// 应用筛选条件
const applyFilters = () => {
  pagination.current = 1;
  fetchNoticeList();
};

// 重置筛选条件
const resetFilters = () => {
  searchText.value = '';
  statusFilter.value = null;
  categoryFilter.value = null;
  dateRange.value = null;
  pagination.current = 1;
  fetchNoticeList();
};

// 获取通知列表
const fetchNoticeList = async () => {
  try {
    loading.value = true;
    
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: searchText.value,
      status: statusFilter.value,
      category: categoryFilter.value,
      startDate: dateRange.value ? dateRange.value[0]?.format('YYYY-MM-DD') : undefined,
      endDate: dateRange.value ? dateRange.value[1]?.format('YYYY-MM-DD') : undefined,
    };
    
    // 模拟数据用于开发测试
    // 实际项目中应该调用 API
    const mockData = {
      list: [
        {
          id: 1,
          title: '园区安全管理规定更新通知',
          content: '为了园区安全，特发布新的管理规定...',
          category: 'important',
          publicRange: ['enterprise', 'employee'],
          status: 'published',
          isTop: true,
          requireConfirmation: true,
          confirmCount: 128,
          viewCount: 256,
          createdBy: '系统管理员',
          createdAt: '2023-06-01 10:00:00',
          updatedAt: '2023-06-01 11:30:00',
          publishedAt: '2023-06-01 12:00:00',
          reviewedBy: '审核员'
        },
        {
          id: 2,
          title: '6月份食堂菜单公告',
          content: '6月份的食堂菜单已更新...',
          category: 'notice',
          publicRange: ['enterprise', 'employee', 'public'],
          status: 'draft',
          isTop: false,
          requireConfirmation: false,
          confirmCount: 0,
          viewCount: 0,
          createdBy: '食堂管理员',
          createdAt: '2023-05-25 14:20:00',
          updatedAt: '2023-05-25 14:20:00'
        }
      ],
      total: 2
    };
    
    // 真实环境下调用API
    // const result = await getNoticeList(params);
    // noticeList.value = result.list;
    // pagination.total = result.total;
    
    // 使用模拟数据
    noticeList.value = mockData.list;
    pagination.total = mockData.total;
  } catch (error) {
    message.error('获取通知列表失败');
  } finally {
    loading.value = false;
  }
};

// 查看通知
const handleView = (record) => {
  currentNotice.value = { ...record };
  form.title = record.title;
  form.category = record.category;
  form.content = record.content;
  form.publicRange = [...record.publicRange];
  form.requireConfirmation = record.requireConfirmation;
  formMode.value = 'view';
  formVisible.value = true;
};

// 编辑通知
const handleEdit = (record) => {
  currentNotice.value = { ...record };
  form.title = record.title;
  form.category = record.category;
  form.content = record.content;
  form.publicRange = [...record.publicRange];
  form.requireConfirmation = record.requireConfirmation;
  formMode.value = 'edit';
  formVisible.value = true;
};

// 创建通知
const handleCreate = () => {
  currentNotice.value = null;
  form.title = '';
  form.category = 'notice';
  form.content = '';
  form.publicRange = ['enterprise', 'employee'];
  form.requireConfirmation = false;
  formMode.value = 'create';
  formVisible.value = true;
};

// 删除通知
const handleDelete = async (record) => {
  try {
    // 实际项目中应该调用API
    // await deleteNotice(record.id);
    message.success('删除成功');
    fetchNoticeList();
  } catch (error) {
    message.error('删除失败');
  }
};

// 提交审核
const handleSubmitReview = async (record) => {
  try {
    // 实际项目中应该调用API
    // await updateNotice(record.id, { status: 'pending' });
    message.success('提交审核成功');
    fetchNoticeList();
  } catch (error) {
    message.error('提交审核失败');
  }
};

// 切换置顶状态
const handleToggleTop = async (record) => {
  try {
    // 实际项目中应该调用API
    // await toggleNoticeTop(record.id, !record.isTop);
    message.success(record.isTop ? '取消置顶成功' : '置顶成功');
    fetchNoticeList();
  } catch (error) {
    message.error('操作失败');
  }
};

// 审核通知
const handleReview = (record) => {
  currentNotice.value = { ...record };
  reviewForm.status = 'published';
  reviewForm.reason = '';
  reviewFormVisible.value = true;
};

// 提交审核表单
const handleReviewSubmit = async () => {
  try {
    formLoading.value = true;
    
    // 实际项目中应该调用API
    // await reviewNotice(currentNotice.value.id, {
    //   status: reviewForm.status,
    //   reason: reviewForm.status === 'rejected' ? reviewForm.reason : undefined
    // });
    
    message.success('审核操作成功');
    reviewFormVisible.value = false;
    fetchNoticeList();
  } catch (error) {
    message.error('审核操作失败');
  } finally {
    formLoading.value = false;
  }
};

// 提交表单
const handleFormSubmit = async () => {
  try {
    formLoading.value = true;
    
    if (formMode.value === 'create') {
      // 创建通知
      // 实际项目中应该调用API
      // await createNotice({
      //   ...form,
      //   status: 'draft'
      // });
      message.success('创建成功');
    } else if (formMode.value === 'edit') {
      // 更新通知
      // 实际项目中应该调用API
      // await updateNotice(currentNotice.value.id, form);
      message.success('更新成功');
    }
    
    formVisible.value = false;
    fetchNoticeList();
  } catch (error) {
    message.error('操作失败');
  } finally {
    formLoading.value = false;
  }
};

// 组件挂载时获取通知列表
onMounted(() => {
  fetchNoticeList();
});
</script>

<style scoped>
.notice-management {
  margin-bottom: 20px;
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}

.title-cell {
  display: flex;
  align-items: center;
}

.title-text {
  margin-right: 8px;
}

.form-footer {
  text-align: right;
  margin-top: 24px;
}
</style> 