<template>
  <div class="notification-list">
    <div class="filters">
      <el-form :model="queryParams" inline>
        <el-form-item label="标题">
          <el-input 
            v-model="queryParams.title" 
            placeholder="请输入标题关键词" 
            clearable 
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="类别">
          <el-select 
            v-model="queryParams.category" 
            placeholder="请选择类别" 
            clearable
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select 
            v-model="queryParams.status" 
            placeholder="请选择状态" 
            clearable
          >
            <el-option label="草稿" value="DRAFT" />
            <el-option label="已发布" value="PUBLISHED" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="operations">
      <el-button type="primary" @click="handleAdd">新增通知</el-button>
      <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">批量删除</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="notificationList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-if="row.isSticky" size="small" type="danger" style="margin-right: 5px">置顶</el-tag>
          <router-link :to="`/service/information/notification/detail/${row.id}`" class="title-link">
            {{ row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="类别" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getCategoryTagType(row.category)">
            {{ getCategoryLabel(row.category) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" width="160" align="center">
        <template #default="{ row }">
          {{ formatDate(row.publishTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="author" label="发布人" width="120" align="center" />
      <el-table-column prop="readCount" label="阅读量" width="100" align="center" />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'PUBLISHED' ? 'success' : 'info'">
            {{ row.status === 'PUBLISHED' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row.id)">查看</el-button>
          <el-button size="small" type="primary" @click="handleEdit(row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatDate as formatDateUtil } from '@/utils/date';

const router = useRouter();
const loading = ref(false);
const notificationList = ref([]);
const selectedIds = ref([]);
const dateRange = ref([]);

// 查询参数
const queryParams = reactive({
  title: '',
  category: '',
  status: '',
  startTime: '',
  endTime: '',
  pageNum: 1,
  pageSize: 10
});

// 分页信息
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 类别选项
const categoryOptions = [
  { value: 'NOTICE', label: '通知' },
  { value: 'ANNOUNCEMENT', label: '公告' },
  { value: 'NEWS', label: '新闻' },
  { value: 'EVENT', label: '活动' }
];

// 获取类别标签
const getCategoryLabel = (category) => {
  const found = categoryOptions.find(item => item.value === category);
  return found ? found.label : category;
};

// 获取类别标签类型
const getCategoryTagType = (category) => {
  const typeMap = {
    'NOTICE': 'primary',
    'ANNOUNCEMENT': 'success',
    'NEWS': 'info',
    'EVENT': 'warning'
  };
  return typeMap[category] || '';
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  return formatDateUtil(dateString, 'YYYY-MM-DD HH:mm');
};

// 监听日期范围变化，更新查询参数
const watchDateRange = computed(() => {
  if (dateRange.value && dateRange.value.length === 2) {
    queryParams.startTime = dateRange.value[0];
    queryParams.endTime = dateRange.value[1];
  } else {
    queryParams.startTime = '';
    queryParams.endTime = '';
  }
  return dateRange.value;
});

// 获取通知列表
const getNotificationList = async () => {
  loading.value = true;
  try {
    // TODO: 这里应该调用后端接口获取数据
    // const response = await api.getNotificationList(queryParams);
    // notificationList.value = response.data.records;
    // pagination.total = response.data.total;

    // 模拟数据
    setTimeout(() => {
      notificationList.value = Array.from({ length: 10 }).map((_, index) => ({
        id: 100 + index,
        title: `通知公告标题${index + 1}`,
        category: ['NOTICE', 'ANNOUNCEMENT', 'NEWS', 'EVENT'][Math.floor(Math.random() * 4)],
        publishTime: '2023-06-15 10:00:00',
        author: '管理员',
        readCount: Math.floor(Math.random() * 1000),
        status: Math.random() > 0.3 ? 'PUBLISHED' : 'DRAFT',
        isSticky: index < 2
      }));
      pagination.total = 100;
      loading.value = false;
    }, 500);
  } catch (error) {
    console.error('获取通知列表失败', error);
    loading.value = false;
  }
};

// 表格选择框变化
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id);
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  getNotificationList();
};

// 重置
const resetQuery = () => {
  Object.keys(queryParams).forEach(key => {
    if (key !== 'pageNum' && key !== 'pageSize') {
      queryParams[key] = '';
    }
  });
  dateRange.value = [];
  handleSearch();
};

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size;
  queryParams.pageSize = size;
  getNotificationList();
};

// 页码变化
const handleCurrentChange = (page) => {
  pagination.current = page;
  queryParams.pageNum = page;
  getNotificationList();
};

// 新增通知
const handleAdd = () => {
  router.push('/service/information/notification/add');
};

// 查看通知
const handleView = (id) => {
  router.push(`/service/information/notification/detail/${id}`);
};

// 编辑通知
const handleEdit = (id) => {
  router.push(`/service/information/notification/edit/${id}`);
};

// 删除通知
const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除所选通知?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // TODO: 调用后端接口删除数据
    // await api.deleteNotification(id);
    ElMessage.success('删除成功');
    getNotificationList();
  }).catch(() => {});
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条记录');
    return;
  }
  
  ElMessageBox.confirm(`确认删除所选的 ${selectedIds.value.length} 条通知?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // TODO: 调用后端接口批量删除数据
    // await api.batchDeleteNotification(selectedIds.value);
    ElMessage.success('批量删除成功');
    getNotificationList();
  }).catch(() => {});
};

// 初始化
onMounted(() => {
  getNotificationList();
});
</script>

<style scoped>
.notification-list {
  padding: 20px;
  background-color: #fff;
}

.filters {
  margin-bottom: 20px;
}

.operations {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.title-link {
  color: #409eff;
  text-decoration: none;
}

.title-link:hover {
  text-decoration: underline;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 