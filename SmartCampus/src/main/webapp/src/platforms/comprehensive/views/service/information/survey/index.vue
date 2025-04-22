<template>
  <div class="survey-container">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-container">
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-input
            v-model="searchParams.keyword"
            placeholder="请输入问卷标题关键词"
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
            placeholder="问卷状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="草稿" value="DRAFT" />
            <el-option label="已发布" value="PUBLISHED" />
            <el-option label="已结束" value="FINISHED" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-select 
            v-model="searchParams.targetGroup" 
            placeholder="调查对象"
            clearable
            @change="handleSearch"
          >
            <el-option 
              v-for="target in targetOptions" 
              :key="target.value" 
              :label="target.label" 
              :value="target.value" 
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
          <el-icon><Plus /></el-icon>创建问卷
        </el-button>
        <el-button @click="exportSurveys">
          <el-icon><Download /></el-icon>导出
        </el-button>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="surveyList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="问卷标题" min-width="180">
        <template #default="{ row }">
          <span @click="viewSurveyDetail(row)" class="link-text">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="targetGroup" label="调查对象" width="120">
        <template #default="{ row }">
          {{ getTargetLabel(row.targetGroup) }}
        </template>
      </el-table-column>
      <el-table-column label="有效期" width="200">
        <template #default="{ row }">
          <div class="survey-time">
            <span>{{ formatDate(row.startTime) }}</span>
            <span v-if="row.endTime">至</span>
            <span v-if="row.endTime">{{ formatDate(row.endTime) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createdBy" label="创建人" width="120" />
      <el-table-column prop="responseCount" label="回收量" width="100" sortable />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewSurveyDetail(row)">查看</el-button>
          <el-button 
            size="small" 
            type="primary" 
            @click="editSurvey(row)"
            v-if="row.status === 'DRAFT'"
          >编辑</el-button>
          <el-button 
            size="small" 
            type="success" 
            @click="viewSurveyResults(row)"
            v-if="row.responseCount > 0"
          >查看结果</el-button>
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
                  command="finish"
                >结束调查</el-dropdown-item>
                <el-dropdown-item 
                  v-if="row.status === 'PUBLISHED'" 
                  command="copy"
                >复制链接</el-dropdown-item>
                <el-dropdown-item 
                  v-if="row.responseCount > 0" 
                  command="export"
                >导出结果</el-dropdown-item>
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
    
    <!-- 创建/编辑问卷对话框 -->
    <el-dialog
      v-model="surveyFormVisible"
      :title="formMode === 'create' ? '创建问卷' : '编辑问卷'"
      width="800px"
      destroy-on-close
    >
      <SurveyForm 
        :form-data="formData" 
        :mode="formMode"
        @submit="handleFormSubmit"
        @cancel="surveyFormVisible = false"
      />
    </el-dialog>
    
    <!-- 查看问卷详情对话框 -->
    <el-dialog
      v-model="surveyDetailVisible"
      title="问卷详情"
      width="800px"
      destroy-on-close
    >
      <SurveyDetail 
        v-if="selectedSurvey" 
        :survey="selectedSurvey" 
      />
    </el-dialog>
    
    <!-- 查看问卷结果对话框 -->
    <el-dialog
      v-model="resultsVisible"
      title="问卷调查结果"
      width="900px"
      destroy-on-close
    >
      <SurveyResults 
        v-if="selectedSurvey" 
        :survey="selectedSurvey" 
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Search, Plus, Download, ArrowDown } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import SurveyForm from './Form.vue';
import SurveyDetail from './Detail.vue';
import SurveyResults from './Results.vue';

// 模拟数据
const targetOptions = [
  { label: '园区企业', value: 'ENTERPRISE' },
  { label: '企业员工', value: 'EMPLOYEE' },
  { label: '园区服务', value: 'SERVICE' },
  { label: '公众', value: 'PUBLIC' }
];

// 状态
const loading = ref(false);
const surveyList = ref([]);
const selectedSurveys = ref([]);
const surveyFormVisible = ref(false);
const surveyDetailVisible = ref(false);
const resultsVisible = ref(false);
const formMode = ref('create');
const formData = ref({});
const selectedSurvey = ref(null);
const dateRange = ref([]);

// 搜索参数
const searchParams = reactive({
  keyword: '',
  status: '',
  targetGroup: '',
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
    'DRAFT': '草稿',
    'PUBLISHED': '已发布',
    'FINISHED': '已结束'
  };
  return statusMap[status] || status;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    'DRAFT': 'info',
    'PUBLISHED': 'success',
    'FINISHED': 'warning'
  };
  return typeMap[status] || '';
};

// 获取调查对象显示文本
const getTargetLabel = (target) => {
  const option = targetOptions.find(opt => opt.value === target);
  return option ? option.label : target;
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 加载问卷列表
const loadSurveys = async () => {
  try {
    loading.value = true;
    // 这里应该是实际的 API 调用
    // const response = await api.getSurveys({
    //   ...searchParams,
    //   page: pagination.currentPage,
    //   size: pagination.pageSize
    // });
    
    // 模拟后端返回数据
    setTimeout(() => {
      const mockData = Array(pagination.pageSize).fill(0).map((_, index) => ({
        id: `survey-${index}`,
        title: `园区满意度调查问卷 ${index + 1}`,
        targetGroup: ['ENTERPRISE', 'EMPLOYEE', 'SERVICE', 'PUBLIC'][Math.floor(Math.random() * 4)],
        startTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: '管理员',
        responseCount: Math.floor(Math.random() * 200),
        status: ['DRAFT', 'PUBLISHED', 'FINISHED'][Math.floor(Math.random() * 3)],
        description: '这是问卷调查的说明文字，描述了问卷的目的和用途...',
        questions: [
          {
            id: 1,
            type: 'single',
            title: '您对园区环境的总体满意度是？',
            options: ['非常满意', '满意', '一般', '不满意', '非常不满意']
          },
          {
            id: 2,
            type: 'multiple',
            title: '您认为园区需要改进的方面有哪些？',
            options: ['停车管理', '绿化环境', '安全保障', '服务态度', '配套设施']
          },
          {
            id: 3,
            type: 'text',
            title: '您对园区管理有什么其他建议？'
          }
        ]
      }));
      
      surveyList.value = mockData;
      pagination.total = 100; // 模拟总数
      loading.value = false;
    }, 500);
    
  } catch (error) {
    console.error('Failed to load surveys:', error);
    ElMessage.error('加载问卷列表失败');
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1;
  loadSurveys();
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
  selectedSurveys.value = selection;
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  loadSurveys();
};

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page;
  loadSurveys();
};

// 打开创建模态框
const openCreateModal = () => {
  formMode.value = 'create';
  formData.value = {
    title: '',
    targetGroup: '',
    description: '',
    startTime: '',
    endTime: '',
    status: 'DRAFT',
    questions: []
  };
  surveyFormVisible.value = true;
};

// 编辑问卷
const editSurvey = (row) => {
  formMode.value = 'edit';
  formData.value = { ...row };
  surveyFormVisible.value = true;
};

// 查看问卷详情
const viewSurveyDetail = (row) => {
  selectedSurvey.value = row;
  surveyDetailVisible.value = true;
};

// 查看问卷结果
const viewSurveyResults = (row) => {
  selectedSurvey.value = row;
  resultsVisible.value = true;
};

// 处理表单提交
const handleFormSubmit = async (formValues) => {
  try {
    loading.value = true;
    // 这里应该是实际的 API 调用
    // if (formMode.value === 'create') {
    //   await api.createSurvey(formValues);
    // } else {
    //   await api.updateSurvey(formValues.id, formValues);
    // }
    
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    ElMessage.success(formMode.value === 'create' ? '创建成功' : '更新成功');
    surveyFormVisible.value = false;
    loadSurveys();
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
        await changeSurveyStatus(row.id, 'PUBLISHED');
        ElMessage.success('发布成功');
        break;
      case 'finish':
        await changeSurveyStatus(row.id, 'FINISHED');
        ElMessage.success('调查已结束');
        break;
      case 'copy':
        copyShareLink(row);
        break;
      case 'export':
        exportSurveyResults(row);
        break;
      case 'delete':
        await deleteSurvey(row.id);
        ElMessage.success('删除成功');
        break;
      default:
        break;
    }
    loadSurveys();
  } catch (error) {
    console.error('Failed to perform action:', error);
    ElMessage.error('操作失败');
  }
};

// 更改问卷状态
const changeSurveyStatus = async (id, status) => {
  // 这里应该是实际的 API 调用
  // await api.updateSurveyStatus(id, status);
  
  // 模拟 API 调用
  return new Promise(resolve => setTimeout(resolve, 300));
};

// 复制分享链接
const copyShareLink = (survey) => {
  // 生成分享链接
  const shareLink = `${window.location.origin}/survey/${survey.id}`;
  
  // 复制到剪贴板
  navigator.clipboard.writeText(shareLink)
    .then(() => {
      ElMessage.success('链接已复制到剪贴板');
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制');
      // 显示链接供用户手动复制
      ElMessageBox.alert(shareLink, '分享链接', {
        confirmButtonText: '确定'
      });
    });
};

// 导出问卷结果
const exportSurveyResults = (survey) => {
  ElMessage.info(`导出"${survey.title}"的调查结果功能待实现`);
};

// 删除问卷
const deleteSurvey = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该问卷吗？所有相关的调查数据将一并删除。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    // 这里应该是实际的 API 调用
    // await api.deleteSurvey(id);
    
    // 模拟 API 调用
    return new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    if (error !== 'cancel') {
      throw error;
    }
  }
};

// 导出问卷列表
const exportSurveys = () => {
  ElMessage.info('导出问卷列表功能待实现');
};

// 页面加载时获取数据
onMounted(() => {
  loadSurveys();
});
</script>

<style scoped>
.survey-container {
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

.survey-time {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.link-text {
  color: #409EFF;
  cursor: pointer;
}

.link-text:hover {
  text-decoration: underline;
}
</style> 