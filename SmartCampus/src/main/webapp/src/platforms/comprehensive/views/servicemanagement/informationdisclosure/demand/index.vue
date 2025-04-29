<template>
  <div class="demand-container">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-container">
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-input
            v-model="searchParams.keyword"
            placeholder="请输入需求标题关键词"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-select 
            v-model="searchParams.status" 
            placeholder="需求状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="待审核" value="PENDING" />
            <el-option label="已发布" value="PUBLISHED" />
            <el-option label="已过期" value="EXPIRED" />
            <el-option label="已撤销" value="WITHDRAWN" />
            <el-option label="已驳回" value="REJECTED" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-select 
            v-model="searchParams.category" 
            placeholder="需求类型"
            clearable
            @change="handleSearch"
          >
            <el-option 
              v-for="category in categoryOptions" 
              :key="category.value" 
              :label="category.label" 
              :value="category.value" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleDateRangeChange"
          />
        </el-form-item>
      </el-form>
      
      <div class="action-buttons">
        <el-button type="primary" @click="openCreateModal">
          <el-icon><Plus /></el-icon>发布需求
        </el-button>
        <el-button @click="exportDemands">
          <el-icon><Download /></el-icon>导出
        </el-button>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="demandList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="需求标题" min-width="200">
        <template #default="{ row }">
          <div class="demand-title">
            <el-tag v-if="row.isUrgent" type="danger" size="small" class="mr-2">紧急</el-tag>
            <span @click="viewDemandDetail(row)" class="link-text">{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="需求类型" width="120">
        <template #default="{ row }">
          {{ getCategoryLabel(row.category) }}
        </template>
      </el-table-column>
      <el-table-column prop="publisherName" label="发布方" width="150" />
      <el-table-column prop="publishTime" label="发布时间" width="180" />
      <el-table-column prop="expiryTime" label="截止日期" width="180" />
      <el-table-column prop="budget" label="预算" width="120">
        <template #default="{ row }">
          {{ row.budget ? `¥${row.budget}` : '面议' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewDemandDetail(row)">查看</el-button>
          <el-button 
            size="small" 
            type="primary" 
            @click="editDemand(row)"
            v-if="['PENDING', 'PUBLISHED'].includes(row.status) && canEdit(row)"
          >编辑</el-button>
          <el-button
            size="small"
            type="success"
            @click="viewResponses(row)"
            v-if="row.responseCount > 0"
          >查看响应</el-button>
          <el-dropdown trigger="click" @command="(cmd) => handleMoreActions(cmd, row)">
            <el-button size="small">
              更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-if="row.status === 'PENDING' && isAdmin" 
                  command="approve"
                >审核通过</el-dropdown-item>
                <el-dropdown-item 
                  v-if="row.status === 'PENDING' && isAdmin" 
                  command="reject"
                >驳回</el-dropdown-item>
                <el-dropdown-item 
                  v-if="row.status === 'PUBLISHED' && canEdit(row)" 
                  command="withdraw"
                >撤销需求</el-dropdown-item>
                <el-dropdown-item 
                  v-if="['PENDING', 'PUBLISHED'].includes(row.status) && isAdmin" 
                  :command="row.isUrgent ? 'unmark' : 'mark'"
                >{{ row.isUrgent ? '取消紧急标记' : '标记为紧急' }}</el-dropdown-item>
                <el-dropdown-item 
                  command="delete" 
                  divided 
                  style="color: #F56C6C;"
                  v-if="canDelete(row)"
                >删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 创建/编辑需求对话框 -->
    <el-dialog
      v-model="demandFormVisible"
      :title="formMode === 'create' ? '发布需求' : '编辑需求'"
      width="800px"
      destroy-on-close
    >
      <DemandForm 
        :form-data="formData" 
        :mode="formMode"
        @submit="handleFormSubmit"
        @cancel="demandFormVisible = false"
      />
    </el-dialog>
    
    <!-- 查看需求详情对话框 -->
    <el-dialog
      v-model="demandDetailVisible"
      title="需求详情"
      width="800px"
      destroy-on-close
    >
      <DemandDetail 
        v-if="selectedDemand" 
        :demand="selectedDemand" 
      />
    </el-dialog>
    
    <!-- 查看需求响应对话框 -->
    <el-dialog
      v-model="responsesVisible"
      title="需求响应列表"
      width="900px"
      destroy-on-close
    >
      <DemandResponses 
        v-if="selectedDemand" 
        :demand="selectedDemand" 
      />
    </el-dialog>
    
    <!-- 驳回需求对话框 -->
    <el-dialog
      v-model="rejectFormVisible"
      title="驳回需求"
      width="500px"
      destroy-on-close
    >
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="驳回原因" prop="reason">
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入驳回原因"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitReject">确认驳回</el-button>
          <el-button @click="rejectFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Search, Plus, Download, ArrowDown } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import DemandForm from './Form.vue';
import DemandDetail from './Detail.vue';
import DemandResponses from './Responses.vue';

// 模拟数据
const categoryOptions = [
  { label: '技术服务', value: 'TECH_SERVICE' },
  { label: '产品合作', value: 'PRODUCT_COOPERATION' },
  { label: '研发外包', value: 'R_D_OUTSOURCE' },
  { label: '咨询服务', value: 'CONSULTING' },
  { label: '其他', value: 'OTHER' }
];

// 状态
const loading = ref(false);
const demandList = ref([]);
const selectedDemands = ref([]);
const demandFormVisible = ref(false);
const demandDetailVisible = ref(false);
const responsesVisible = ref(false);
const rejectFormVisible = ref(false);
const formMode = ref('create');
const formData = ref({});
const selectedDemand = ref(null);
const dateRange = ref([]);
const isAdmin = ref(true); // 实际应该从用户权限中获取
const currentUserId = '12345'; // 实际应该从用户信息中获取
const rejectForm = reactive({
  reason: '',
  demandId: ''
});

// 搜索参数
const searchParams = reactive({
  keyword: '',
  status: '',
  category: '',
  startDate: '',
  endDate: ''
});

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 获取状态显示文本
const getStatusLabel = (status) => {
  const statusMap = {
    'PENDING': '待审核',
    'PUBLISHED': '已发布',
    'EXPIRED': '已过期',
    'WITHDRAWN': '已撤销',
    'REJECTED': '已驳回'
  };
  return statusMap[status] || status;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    'PENDING': 'info',
    'PUBLISHED': 'success',
    'EXPIRED': 'warning',
    'WITHDRAWN': 'info',
    'REJECTED': 'danger'
  };
  return typeMap[status] || '';
};

// 获取类别显示文本
const getCategoryLabel = (category) => {
  const option = categoryOptions.find(opt => opt.value === category);
  return option ? option.label : category;
};

// 检查是否可以编辑
const canEdit = (demand) => {
  return isAdmin.value || demand.publisherId === currentUserId;
};

// 检查是否可以删除
const canDelete = (demand) => {
  return isAdmin.value || (demand.publisherId === currentUserId && ['PENDING', 'REJECTED'].includes(demand.status));
};

// 加载需求列表
const loadDemands = async () => {
  try {
    loading.value = true;
    // 这里应该是实际的 API 调用
    // const response = await api.getDemands({
    //   ...searchParams,
    //   page: pagination.currentPage,
    //   size: pagination.pageSize
    // });
    
    // 模拟后端返回数据
    setTimeout(() => {
      const mockData = Array(pagination.pageSize).fill(0).map((_, index) => ({
        id: `demand-${index}`,
        title: `企业需求标题 ${index + 1}`,
        category: ['TECH_SERVICE', 'PRODUCT_COOPERATION', 'R_D_OUTSOURCE', 'CONSULTING', 'OTHER'][Math.floor(Math.random() * 5)],
        publisherId: index % 3 === 0 ? currentUserId : `user-${index}`,
        publisherName: index % 3 === 0 ? '当前用户' : `企业${index}`,
        publishTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
        expiryTime: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toLocaleString(),
        budget: Math.random() > 0.3 ? Math.floor(Math.random() * 100) * 1000 : null,
        status: ['PENDING', 'PUBLISHED', 'EXPIRED', 'WITHDRAWN', 'REJECTED'][Math.floor(Math.random() * 5)],
        isUrgent: Math.random() > 0.8,
        content: '这是需求详细描述内容...',
        contactName: '联系人',
        contactPhone: '13800138000',
        contactEmail: 'contact@example.com',
        responseCount: Math.floor(Math.random() * 10)
      }));
      
      demandList.value = mockData;
      pagination.total = 100; // 模拟总数
      loading.value = false;
    }, 500);
    
  } catch (error) {
    console.error('Failed to load demands:', error);
    ElMessage.error('加载需求列表失败');
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1;
  loadDemands();
};

// 处理日期范围变化
const handleDateRangeChange = (val) => {
  if (val) {
    searchParams.startDate = val[0];
    searchParams.endDate = val[1];
  } else {
    searchParams.startDate = '';
    searchParams.endDate = '';
  }
  handleSearch();
};

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedDemands.value = selection;
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  loadDemands();
};

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page;
  loadDemands();
};

// 打开创建模态框
const openCreateModal = () => {
  formMode.value = 'create';
  formData.value = {
    title: '',
    category: '',
    content: '',
    expiryTime: '',
    budget: null,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    status: 'PENDING'
  };
  demandFormVisible.value = true;
};

// 编辑需求
const editDemand = (row) => {
  formMode.value = 'edit';
  formData.value = { ...row };
  demandFormVisible.value = true;
};

// 查看需求详情
const viewDemandDetail = (row) => {
  selectedDemand.value = row;
  demandDetailVisible.value = true;
};

// 查看需求响应
const viewResponses = (row) => {
  selectedDemand.value = row;
  responsesVisible.value = true;
};

// 显示驳回表单
const showRejectForm = (demand) => {
  selectedDemand.value = demand;
  rejectForm.demandId = demand.id;
  rejectForm.reason = '';
  rejectFormVisible.value = true;
};

// 提交驳回
const submitReject = async () => {
  if (!rejectForm.reason.trim()) {
    ElMessage.warning('请输入驳回原因');
    return;
  }
  
  try {
    // 这里应该调用API提交驳回
    // await api.rejectDemand(rejectForm.demandId, rejectForm.reason);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300));
    
    ElMessage.success('需求已驳回');
    rejectFormVisible.value = false;
    loadDemands();
  } catch (error) {
    console.error('驳回需求失败', error);
    ElMessage.error('驳回需求失败');
  }
};

// 处理表单提交
const handleFormSubmit = async (formValues) => {
  try {
    loading.value = true;
    // 这里应该是实际的 API 调用
    // if (formMode.value === 'create') {
    //   await api.createDemand(formValues);
    // } else {
    //   await api.updateDemand(formValues.id, formValues);
    // }
    
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    ElMessage.success(formMode.value === 'create' ? '需求发布成功，待审核' : '需求更新成功');
    demandFormVisible.value = false;
    loadDemands();
  } catch (error) {
    console.error('Failed to submit form:', error);
    ElMessage.error(formMode.value === 'create' ? '发布失败' : '更新失败');
  } finally {
    loading.value = false;
  }
};

// 处理更多操作
const handleMoreActions = async (command, row) => {
  try {
    switch (command) {
      case 'approve':
        await changeDemandStatus(row.id, 'PUBLISHED');
        ElMessage.success('审核通过，需求已发布');
        break;
      case 'reject':
        showRejectForm(row);
        break;
      case 'withdraw':
        await changeDemandStatus(row.id, 'WITHDRAWN');
        ElMessage.success('需求已撤销');
        break;
      case 'mark':
        await toggleUrgentStatus(row.id, true);
        ElMessage.success('已标记为紧急');
        break;
      case 'unmark':
        await toggleUrgentStatus(row.id, false);
        ElMessage.success('已取消紧急标记');
        break;
      case 'delete':
        await deleteDemand(row.id);
        ElMessage.success('删除成功');
        break;
      default:
        break;
    }
    loadDemands();
  } catch (error) {
    console.error('Failed to perform action:', error);
    ElMessage.error('操作失败');
  }
};

// 更改需求状态
const changeDemandStatus = async (id, status) => {
  // 这里应该是实际的 API 调用
  // await api.updateDemandStatus(id, status);
  
  // 模拟 API 调用
  return new Promise(resolve => setTimeout(resolve, 300));
};

// 切换紧急状态
const toggleUrgentStatus = async (id, isUrgent) => {
  // 这里应该是实际的 API 调用
  // await api.updateDemandUrgent(id, isUrgent);
  
  // 模拟 API 调用
  return new Promise(resolve => setTimeout(resolve, 300));
};

// 删除需求
const deleteDemand = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该需求吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    // 这里应该是实际的 API 调用
    // await api.deleteDemand(id);
    
    // 模拟 API 调用
    return new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    if (error !== 'cancel') {
      throw error;
    }
  }
};

// 导出需求列表
const exportDemands = () => {
  ElMessage.info('导出功能待实现');
};

// 页面加载时获取数据
onMounted(() => {
  loadDemands();
});
</script>

<style scoped>
.demand-container {
  width: 100%;
}

.search-filter-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.demand-title {
  display: flex;
  align-items: center;
}

.mr-2 {
  margin-right: 8px;
}

.link-text {
  color: #409EFF;
  cursor: pointer;
}

.link-text:hover {
  text-decoration: underline;
}
</style> 