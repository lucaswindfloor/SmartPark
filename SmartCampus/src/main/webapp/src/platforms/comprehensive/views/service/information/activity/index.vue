<template>
  <div class="activity-container">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-container">
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-input
            v-model="searchParams.keyword"
            placeholder="请输入活动名称关键词"
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
            placeholder="活动状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="未开始" value="UPCOMING" />
            <el-option label="报名中" value="REGISTERING" />
            <el-option label="进行中" value="ONGOING" />
            <el-option label="已结束" value="FINISHED" />
            <el-option label="已取消" value="CANCELED" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-select 
            v-model="searchParams.category" 
            placeholder="活动类型"
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
          <el-icon><Plus /></el-icon>创建活动
        </el-button>
        <el-button @click="exportActivities">
          <el-icon><Download /></el-icon>导出
        </el-button>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="activityList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="活动名称" min-width="180">
        <template #default="{ row }">
          <div class="activity-title">
            <el-tag v-if="row.isRecommended" type="danger" size="small" class="mr-2">推荐</el-tag>
            <span @click="viewActivityDetail(row)" class="link-text">{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="活动类型" width="120">
        <template #default="{ row }">
          {{ getCategoryLabel(row.category) }}
        </template>
      </el-table-column>
      <el-table-column label="活动时间" width="200" sortable>
        <template #default="{ row }">
          <div class="activity-time">
            <span>{{ formatDate(row.startTime) }}</span>
            <span v-if="row.endTime">至</span>
            <span v-if="row.endTime">{{ formatDate(row.endTime) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="活动地点" width="150" />
      <el-table-column prop="registerCount" label="报名人数" width="90" sortable />
      <el-table-column prop="maxParticipants" label="人数上限" width="90" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewActivityDetail(row)">查看</el-button>
          <el-button 
            size="small" 
            type="primary" 
            @click="editActivity(row)"
            v-if="['UPCOMING', 'REGISTERING'].includes(row.status)"
          >编辑</el-button>
          <el-dropdown trigger="click" @command="(cmd) => handleMoreActions(cmd, row)">
            <el-button size="small">
              更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-if="row.status === 'UPCOMING'" 
                  command="startRegister"
                >开始报名</el-dropdown-item>
                <el-dropdown-item 
                  v-if="row.status === 'REGISTERING'" 
                  command="stopRegister"
                >截止报名</el-dropdown-item>
                <el-dropdown-item 
                  v-if="['UPCOMING', 'REGISTERING'].includes(row.status)" 
                  command="cancel"
                >取消活动</el-dropdown-item>
                <el-dropdown-item 
                  v-if="row.status === 'ONGOING'" 
                  command="finish"
                >结束活动</el-dropdown-item>
                <el-dropdown-item 
                  :command="row.isRecommended ? 'unrecommend' : 'recommend'"
                >{{ row.isRecommended ? '取消推荐' : '推荐活动' }}</el-dropdown-item>
                <el-dropdown-item 
                  command="participants"
                >查看报名人员</el-dropdown-item>
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
    
    <!-- 创建/编辑活动对话框 -->
    <el-dialog
      v-model="activityFormVisible"
      :title="formMode === 'create' ? '创建活动' : '编辑活动'"
      width="800px"
      destroy-on-close
    >
      <ActivityForm 
        :form-data="formData" 
        :mode="formMode"
        @submit="handleFormSubmit"
        @cancel="activityFormVisible = false"
      />
    </el-dialog>
    
    <!-- 查看活动详情对话框 -->
    <el-dialog
      v-model="activityDetailVisible"
      title="活动详情"
      width="800px"
      destroy-on-close
    >
      <ActivityDetail 
        v-if="selectedActivity" 
        :activity="selectedActivity" 
      />
    </el-dialog>
    
    <!-- 查看报名人员对话框 -->
    <el-dialog
      v-model="participantsVisible"
      title="报名人员列表"
      width="800px"
    >
      <div v-if="selectedActivity" class="participants-container">
        <el-table :data="participantList" border>
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="phone" label="联系电话" width="150" />
          <el-table-column prop="email" label="电子邮箱" width="180" />
          <el-table-column prop="company" label="单位" />
          <el-table-column prop="registerTime" label="报名时间" width="180" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="removeParticipant(row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="export-btn">
          <el-button type="primary" @click="exportParticipants">
            <el-icon><Download /></el-icon>导出报名名单
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Search, Plus, Download, ArrowDown } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import ActivityForm from './Form.vue';
import ActivityDetail from './Detail.vue';

// 模拟数据
const categoryOptions = [
  { label: '培训讲座', value: 'TRAINING' },
  { label: '交流论坛', value: 'FORUM' },
  { label: '企业沙龙', value: 'SALON' },
  { label: '文化活动', value: 'CULTURAL' },
  { label: '招聘会', value: 'RECRUITMENT' }
];

// 状态
const loading = ref(false);
const activityList = ref([]);
const selectedActivities = ref([]);
const activityFormVisible = ref(false);
const activityDetailVisible = ref(false);
const participantsVisible = ref(false);
const formMode = ref('create');
const formData = ref({});
const selectedActivity = ref(null);
const dateRange = ref([]);
const participantList = ref([]);

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
    'UPCOMING': '未开始',
    'REGISTERING': '报名中',
    'ONGOING': '进行中',
    'FINISHED': '已结束',
    'CANCELED': '已取消'
  };
  return statusMap[status] || status;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    'UPCOMING': 'info',
    'REGISTERING': 'success',
    'ONGOING': 'warning',
    'FINISHED': 'info',
    'CANCELED': 'danger'
  };
  return typeMap[status] || '';
};

// 获取类别显示文本
const getCategoryLabel = (category) => {
  const option = categoryOptions.find(opt => opt.value === category);
  return option ? option.label : category;
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 加载活动列表
const loadActivities = async () => {
  try {
    loading.value = true;
    // 这里应该是实际的 API 调用
    // const response = await api.getActivities({
    //   ...searchParams,
    //   page: pagination.currentPage,
    //   size: pagination.pageSize
    // });
    
    // 模拟后端返回数据
    setTimeout(() => {
      const mockData = Array(pagination.pageSize).fill(0).map((_, index) => ({
        id: `activity-${index}`,
        title: `园区活动 ${index + 1}`,
        category: ['TRAINING', 'FORUM', 'SALON', 'CULTURAL', 'RECRUITMENT'][Math.floor(Math.random() * 5)],
        startTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + (30 + Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
        location: '园区会议中心',
        registerCount: Math.floor(Math.random() * 50),
        maxParticipants: 100,
        status: ['UPCOMING', 'REGISTERING', 'ONGOING', 'FINISHED', 'CANCELED'][Math.floor(Math.random() * 5)],
        isRecommended: Math.random() > 0.8,
        content: '这是活动内容描述...',
        organizerName: '园区服务中心',
        organizerContact: '联系人：张经理，电话：13800138000'
      }));
      
      activityList.value = mockData;
      pagination.total = 100; // 模拟总数
      loading.value = false;
    }, 500);
    
  } catch (error) {
    console.error('Failed to load activities:', error);
    ElMessage.error('加载活动列表失败');
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1;
  loadActivities();
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
  selectedActivities.value = selection;
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  loadActivities();
};

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page;
  loadActivities();
};

// 打开创建模态框
const openCreateModal = () => {
  formMode.value = 'create';
  formData.value = {
    title: '',
    category: '',
    content: '',
    startTime: '',
    endTime: '',
    location: '',
    maxParticipants: 100,
    isRecommended: false,
    status: 'UPCOMING',
    organizerName: '',
    organizerContact: ''
  };
  activityFormVisible.value = true;
};

// 编辑活动
const editActivity = (row) => {
  formMode.value = 'edit';
  formData.value = { ...row };
  activityFormVisible.value = true;
};

// 查看活动详情
const viewActivityDetail = (row) => {
  selectedActivity.value = row;
  activityDetailVisible.value = true;
};

// 处理表单提交
const handleFormSubmit = async (formValues) => {
  try {
    loading.value = true;
    // 这里应该是实际的 API 调用
    // if (formMode.value === 'create') {
    //   await api.createActivity(formValues);
    // } else {
    //   await api.updateActivity(formValues.id, formValues);
    // }
    
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    ElMessage.success(formMode.value === 'create' ? '创建成功' : '更新成功');
    activityFormVisible.value = false;
    loadActivities();
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
      case 'startRegister':
        await changeActivityStatus(row.id, 'REGISTERING');
        ElMessage.success('已开启报名');
        break;
      case 'stopRegister':
        await changeActivityStatus(row.id, 'UPCOMING');
        ElMessage.success('已关闭报名');
        break;
      case 'cancel':
        await changeActivityStatus(row.id, 'CANCELED');
        ElMessage.success('已取消活动');
        break;
      case 'finish':
        await changeActivityStatus(row.id, 'FINISHED');
        ElMessage.success('已结束活动');
        break;
      case 'recommend':
        await toggleRecommendStatus(row.id, true);
        ElMessage.success('已设为推荐活动');
        break;
      case 'unrecommend':
        await toggleRecommendStatus(row.id, false);
        ElMessage.success('已取消推荐');
        break;
      case 'participants':
        showParticipants(row);
        break;
      case 'delete':
        await deleteActivity(row.id);
        ElMessage.success('删除成功');
        break;
      default:
        break;
    }
    loadActivities();
  } catch (error) {
    console.error('Failed to perform action:', error);
    ElMessage.error('操作失败');
  }
};

// 更改活动状态
const changeActivityStatus = async (id, status) => {
  // 这里应该是实际的 API 调用
  // await api.updateActivityStatus(id, status);
  
  // 模拟 API 调用
  return new Promise(resolve => setTimeout(resolve, 300));
};

// 切换推荐状态
const toggleRecommendStatus = async (id, isRecommended) => {
  // 这里应该是实际的 API 调用
  // await api.updateActivityRecommend(id, isRecommended);
  
  // 模拟 API 调用
  return new Promise(resolve => setTimeout(resolve, 300));
};

// 删除活动
const deleteActivity = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该活动吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    // 这里应该是实际的 API 调用
    // await api.deleteActivity(id);
    
    // 模拟 API 调用
    return new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    if (error !== 'cancel') {
      throw error;
    }
  }
};

// 导出活动列表
const exportActivities = () => {
  ElMessage.info('导出功能待实现');
};

// 显示报名人员
const showParticipants = async (activity) => {
  selectedActivity.value = activity;
  participantsVisible.value = true;
  
  try {
    // 这里应该调用API获取报名人员
    // const response = await api.getActivityParticipants(activity.id);
    // participantList.value = response.data;
    
    // 模拟数据
    participantList.value = Array(activity.registerCount || 5).fill(0).map((_, index) => ({
      id: `participant-${index}`,
      name: `参与者${index + 1}`,
      phone: `1380013${index.toString().padStart(4, '0')}`,
      email: `user${index + 1}@example.com`,
      company: '企业公司',
      registerTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleString()
    }));
  } catch (error) {
    console.error('获取报名人员失败', error);
    ElMessage.error('获取报名人员失败');
  }
};

// 移除参与者
const removeParticipant = async (participant) => {
  try {
    await ElMessageBox.confirm('确定要移除此报名人员吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    // 这里应该调用API移除报名人员
    // await api.removeActivityParticipant(selectedActivity.value.id, participant.id);
    
    // 模拟操作
    participantList.value = participantList.value.filter(p => p.id !== participant.id);
    
    ElMessage.success('移除成功');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移除报名人员失败', error);
      ElMessage.error('移除报名人员失败');
    }
  }
};

// 导出报名人员
const exportParticipants = () => {
  ElMessage.info('导出报名名单功能待实现');
};

// 页面加载时获取数据
onMounted(() => {
  loadActivities();
});
</script>

<style scoped>
.activity-container {
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

.activity-title {
  display: flex;
  align-items: center;
}

.activity-time {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.participants-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.export-btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style> 