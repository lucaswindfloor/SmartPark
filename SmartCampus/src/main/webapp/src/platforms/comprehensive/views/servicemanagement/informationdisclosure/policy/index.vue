<template>
  <div class="policy-container">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-container">
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-input
            v-model="searchParams.keyword"
            placeholder="请输入标题关键词"
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
            placeholder="状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="已发布" value="PUBLISHED" />
            <el-option label="草稿" value="DRAFT" />
            <el-option label="已下架" value="ARCHIVED" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-select 
            v-model="searchParams.category" 
            placeholder="文件类型"
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
          <el-icon><Plus /></el-icon>新建政策文件
        </el-button>
        <el-button @click="exportPolicies">
          <el-icon><Download /></el-icon>导出
        </el-button>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="policyList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="标题" min-width="200">
        <template #default="{ row }">
          <div class="policy-title">
            <el-tag v-if="row.isImportant" type="danger" size="small" class="mr-2">重要</el-tag>
            <span @click="viewPolicyDetail(row)" class="link-text">{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="documentNo" label="文号" width="150" />
      <el-table-column prop="category" label="类型" width="120">
        <template #default="{ row }">
          {{ getCategoryLabel(row.category) }}
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" width="160" />
      <el-table-column prop="department" label="发布部门" width="120" />
      <el-table-column prop="downloadCount" label="下载次数" width="100" sortable />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewPolicyDetail(row)">查看</el-button>
          <el-button 
            size="small" 
            type="primary" 
            @click="editPolicy(row)"
            v-if="row.status !== 'ARCHIVED'"
          >编辑</el-button>
          <el-dropdown trigger="click" @command="(cmd) => handleMoreActions(cmd, row)">
            <el-button size="small">
              更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-if="row.status === 'DRAFT'" 
                  command="publish"
                >发布</el-dropdown-item>
                <el-dropdown-item 
                  v-if="row.status === 'PUBLISHED'" 
                  command="archive"
                >下架</el-dropdown-item>
                <el-dropdown-item 
                  v-if="row.status === 'PUBLISHED'" 
                  :command="row.isImportant ? 'unmark' : 'mark'"
                >{{ row.isImportant ? '取消标记重要' : '标记为重要' }}</el-dropdown-item>
                <el-dropdown-item 
                  command="delete" 
                  divided 
                  style="color: #F56C6C;"
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
    
    <!-- 创建/编辑政策文件对话框 -->
    <el-dialog
      v-model="policyFormVisible"
      :title="formMode === 'create' ? '创建政策文件' : '编辑政策文件'"
      width="800px"
      destroy-on-close
    >
      <PolicyForm 
        :form-data="formData" 
        :mode="formMode"
        @submit="handleFormSubmit"
        @cancel="policyFormVisible = false"
      />
    </el-dialog>
    
    <!-- 查看政策文件详情对话框 -->
    <el-dialog
      v-model="policyDetailVisible"
      title="政策文件详情"
      width="800px"
      destroy-on-close
    >
      <PolicyDetail 
        v-if="selectedPolicy" 
        :policy="selectedPolicy" 
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Search, Plus, Download, ArrowDown } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PolicyForm from './Form.vue';
import PolicyDetail from './Detail.vue';

// 模拟数据
const categoryOptions = [
  { label: '地方政策', value: 'LOCAL' },
  { label: '国家政策', value: 'NATIONAL' },
  { label: '园区规章', value: 'PARK_RULE' },
  { label: '申报指南', value: 'APPLICATION_GUIDE' }
];

// 状态
const loading = ref(false);
const policyList = ref([]);
const selectedPolicies = ref([]);
const policyFormVisible = ref(false);
const policyDetailVisible = ref(false);
const formMode = ref('create');
const formData = ref({});
const selectedPolicy = ref(null);
const dateRange = ref([]);

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
    'PUBLISHED': '已发布',
    'DRAFT': '草稿',
    'ARCHIVED': '已下架'
  };
  return statusMap[status] || status;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    'PUBLISHED': 'success',
    'DRAFT': 'info',
    'ARCHIVED': 'warning'
  };
  return typeMap[status] || '';
};

// 获取类别显示文本
const getCategoryLabel = (category) => {
  const option = categoryOptions.find(opt => opt.value === category);
  return option ? option.label : category;
};

// 加载政策文件列表
const loadPolicies = async () => {
  try {
    loading.value = true;
    // 这里应该是实际的 API 调用
    // const response = await api.getPolicies({
    //   ...searchParams,
    //   page: pagination.currentPage,
    //   size: pagination.pageSize
    // });
    
    // 模拟后端返回数据
    setTimeout(() => {
      const mockData = Array(pagination.pageSize).fill(0).map((_, index) => ({
        id: `policy-${index}`,
        title: `政策文件标题 ${index + 1}`,
        documentNo: `政策[2023]第${index + 1}号`,
        category: ['LOCAL', 'NATIONAL', 'PARK_RULE', 'APPLICATION_GUIDE'][Math.floor(Math.random() * 4)],
        publishTime: new Date().toLocaleString(),
        department: '政策管理部',
        downloadCount: Math.floor(Math.random() * 500),
        status: ['PUBLISHED', 'DRAFT', 'ARCHIVED'][Math.floor(Math.random() * 3)],
        isImportant: Math.random() > 0.8,
        content: '这是政策文件内容...',
        attachments: [
          { id: `att-${index}-1`, name: '政策详情.pdf', type: 'application/pdf', url: '#' }
        ]
      }));
      
      policyList.value = mockData;
      pagination.total = 100; // 模拟总数
      loading.value = false;
    }, 500);
    
  } catch (error) {
    console.error('Failed to load policies:', error);
    ElMessage.error('加载政策文件列表失败');
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1;
  loadPolicies();
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
  selectedPolicies.value = selection;
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  loadPolicies();
};

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page;
  loadPolicies();
};

// 打开创建模态框
const openCreateModal = () => {
  formMode.value = 'create';
  formData.value = {
    title: '',
    documentNo: '',
    category: '',
    content: '',
    isImportant: false,
    status: 'DRAFT',
    attachments: []
  };
  policyFormVisible.value = true;
};

// 编辑政策文件
const editPolicy = (row) => {
  formMode.value = 'edit';
  formData.value = { ...row };
  policyFormVisible.value = true;
};

// 查看政策文件详情
const viewPolicyDetail = (row) => {
  selectedPolicy.value = row;
  policyDetailVisible.value = true;
};

// 处理表单提交
const handleFormSubmit = async (formValues) => {
  try {
    loading.value = true;
    // 这里应该是实际的 API 调用
    // if (formMode.value === 'create') {
    //   await api.createPolicy(formValues);
    // } else {
    //   await api.updatePolicy(formValues.id, formValues);
    // }
    
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    ElMessage.success(formMode.value === 'create' ? '创建成功' : '更新成功');
    policyFormVisible.value = false;
    loadPolicies();
  } catch (error) {
    console.error('Failed to submit form:', error);
    ElMessage.error(formMode.value === 'create' ? '创建失败' : '更新失败');
  } finally {
    loading.value = false;
  }
};

// 处理更多操作
const handleMoreActions = async (command, row) => {
  try {
    switch (command) {
      case 'publish':
        await changePolicyStatus(row.id, 'PUBLISHED');
        ElMessage.success('发布成功');
        break;
      case 'archive':
        await changePolicyStatus(row.id, 'ARCHIVED');
        ElMessage.success('下架成功');
        break;
      case 'mark':
        await toggleImportantStatus(row.id, true);
        ElMessage.success('标记为重要成功');
        break;
      case 'unmark':
        await toggleImportantStatus(row.id, false);
        ElMessage.success('取消标记重要成功');
        break;
      case 'delete':
        await deletePolicy(row.id);
        ElMessage.success('删除成功');
        break;
      default:
        break;
    }
    loadPolicies();
  } catch (error) {
    console.error('Failed to perform action:', error);
    ElMessage.error('操作失败');
  }
};

// 更改政策文件状态
const changePolicyStatus = async (id, status) => {
  // 这里应该是实际的 API 调用
  // await api.updatePolicyStatus(id, status);
  
  // 模拟 API 调用
  return new Promise(resolve => setTimeout(resolve, 300));
};

// 切换重要状态
const toggleImportantStatus = async (id, isImportant) => {
  // 这里应该是实际的 API 调用
  // await api.updatePolicyImportant(id, isImportant);
  
  // 模拟 API 调用
  return new Promise(resolve => setTimeout(resolve, 300));
};

// 删除政策文件
const deletePolicy = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个政策文件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    // 这里应该是实际的 API 调用
    // await api.deletePolicy(id);
    
    // 模拟 API 调用
    return new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    if (error !== 'cancel') {
      throw error;
    }
  }
};

// 导出政策文件
const exportPolicies = () => {
  ElMessage.info('导出功能待实现');
};

// 页面加载时获取数据
onMounted(() => {
  loadPolicies();
});
</script>

<style scoped>
.policy-container {
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

.policy-title {
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