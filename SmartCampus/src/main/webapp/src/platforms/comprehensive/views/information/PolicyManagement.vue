<template>
  <div class="policy-management">
    <a-card class="content-card" :bordered="false">
      <template #title>
        <div class="card-title">
          <file-outlined />
          <span>政策文件管理</span>
        </div>
      </template>
      
      <div class="operation-bar">
        <div class="search-section">
          <a-form layout="inline" :model="searchForm">
            <a-form-item label="标题">
              <a-input 
                v-model:value="searchForm.title" 
                placeholder="请输入政策标题" 
                allowClear
                @pressEnter="handleSearch"
              />
            </a-form-item>
            <a-form-item label="类型">
              <a-select
                v-model:value="searchForm.type"
                placeholder="请选择政策类型"
                style="width: 150px"
                allowClear
              >
                <a-select-option value="NATIONAL">国家政策</a-select-option>
                <a-select-option value="LOCAL">地方政策</a-select-option>
                <a-select-option value="INDUSTRY">行业政策</a-select-option>
                <a-select-option value="PARK">园区政策</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="状态">
              <a-select
                v-model:value="searchForm.status"
                placeholder="请选择状态"
                style="width: 150px"
                allowClear
              >
                <a-select-option value="DRAFT">草稿</a-select-option>
                <a-select-option value="PENDING_REVIEW">待审核</a-select-option>
                <a-select-option value="PUBLISHED">已发布</a-select-option>
                <a-select-option value="EXPIRED">已过期</a-select-option>
                <a-select-option value="RECALLED">已撤回</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSearch">
                <template #icon><search-outlined /></template>
                查询
              </a-button>
              <a-button style="margin-left: 8px" @click="resetSearch">
                <template #icon><clear-outlined /></template>
                重置
              </a-button>
            </a-form-item>
          </a-form>
        </div>
        
        <div class="button-section">
          <a-button type="primary" @click="openCreateModal">
            <template #icon><plus-outlined /></template>
            新建政策
          </a-button>
          <a-button style="margin-left: 8px" @click="refreshTable">
            <template #icon><reload-outlined /></template>
            刷新
          </a-button>
        </div>
      </div>
      
      <a-table
        :dataSource="policyList"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          
          <template v-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">
              {{ getTypeText(record.type) }}
            </a-tag>
          </template>
          
          <template v-if="column.key === 'operation'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
              <a-button 
                v-if="record.status === 'DRAFT'"
                type="link" 
                size="small" 
                @click="handleEdit(record)"
              >
                编辑
              </a-button>
              <a-button 
                v-if="record.status === 'DRAFT'"
                type="link" 
                size="small" 
                @click="handleSubmitForReview(record)"
              >
                提交审核
              </a-button>
              <a-button 
                v-if="record.status === 'PENDING_REVIEW'"
                type="link" 
                size="small" 
                @click="handleReview(record)"
              >
                审核
              </a-button>
              <a-button 
                v-if="record.status === 'PUBLISHED'"
                type="link" 
                size="small" 
                @click="handleRecall(record)"
              >
                撤回
              </a-button>
              <a-button 
                v-if="['DRAFT', 'RECALLED', 'EXPIRED'].includes(record.status)"
                type="link" 
                size="small" 
                danger
                @click="handleDelete(record)"
              >
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    
    <!-- 政策表单对话框 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      width="900px"
      :footer="null"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <policy-form
        :initialData="currentPolicy"
        :isEdit="isEdit"
        @success="handleFormSuccess"
        @cancel="closeModal"
      />
    </a-modal>
    
    <!-- 政策详情对话框 -->
    <a-modal
      v-model:visible="detailVisible"
      title="政策详情"
      width="800px"
      :footer="null"
      :maskClosable="true"
    >
      <policy-detail
        v-if="detailVisible" 
        :policy="currentPolicy"
      />
    </a-modal>
    
    <!-- 审核对话框 -->
    <a-modal
      v-model:visible="reviewVisible"
      title="政策审核"
      :maskClosable="false"
      @cancel="reviewVisible = false"
    >
      <a-form :model="reviewForm" layout="vertical">
        <a-form-item label="审核结果">
          <a-radio-group v-model:value="reviewForm.approved">
            <a-radio :value="true">通过</a-radio>
            <a-radio :value="false">拒绝</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="拒绝原因" v-if="!reviewForm.approved">
          <a-textarea 
            v-model:value="reviewForm.reason" 
            :rows="4" 
            placeholder="请输入拒绝原因"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="reviewVisible = false">取消</a-button>
        <a-button type="primary" @click="submitReview" :loading="submitting">提交</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { 
  FileOutlined, 
  SearchOutlined, 
  ClearOutlined,
  PlusOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import PolicyForm from './components/PolicyForm.vue';
import PolicyDetail from './components/PolicyDetail.vue';

// 政策服务可以与通知服务类似，稍后实现
// import { PolicyService } from '@/services/information/policy.service';

export default defineComponent({
  name: 'PolicyManagement',
  components: {
    FileOutlined,
    SearchOutlined,
    ClearOutlined,
    PlusOutlined,
    ReloadOutlined,
    PolicyForm,
    PolicyDetail
  },
  setup() {
    // 搜索表单
    const searchForm = reactive({
      title: '',
      type: undefined,
      status: undefined
    });
    
    // 表格数据
    const policyList = ref([]);
    const loading = ref(false);
    
    // 分页配置
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showTotal: (total) => `共 ${total} 条`
    });
    
    // 表格列定义
    const columns = [
      {
        title: '政策标题',
        dataIndex: 'title',
        key: 'title',
        ellipsis: true
      },
      {
        title: '政策类型',
        dataIndex: 'type',
        key: 'type',
        width: 120
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100
      },
      {
        title: '发布时间',
        dataIndex: 'publishTime',
        key: 'publishTime',
        width: 180
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: 120
      },
      {
        title: '操作',
        key: 'operation',
        width: 280
      }
    ];
    
    // 模态框状态
    const modalVisible = ref(false);
    const modalTitle = ref('新建政策');
    const isEdit = ref(false);
    const currentPolicy = ref({});
    
    // 详情模态框
    const detailVisible = ref(false);
    
    // 审核模态框
    const reviewVisible = ref(false);
    const reviewForm = reactive({
      approved: true,
      reason: ''
    });
    const submitting = ref(false);
    
    // 初始化加载数据
    onMounted(() => {
      fetchPolicyList();
    });
    
    // 获取政策列表
    const fetchPolicyList = async () => {
      loading.value = true;
      try {
        // 模拟数据，实际项目中应调用API
        setTimeout(() => {
          policyList.value = [
            {
              id: 1,
              title: '关于促进科技创新发展的若干政策',
              type: 'NATIONAL',
              status: 'PUBLISHED',
              publishTime: '2023-06-10 10:00:00',
              createdBy: '管理员',
              content: '为促进科技创新发展，提升国家核心竞争力...'
            },
            {
              id: 2,
              title: '智慧园区建设扶持政策',
              type: 'PARK',
              status: 'DRAFT',
              publishTime: null,
              createdBy: '张三',
              content: '为加快推进智慧园区建设，提升园区信息化水平...'
            },
            {
              id: 3,
              title: '高新技术企业认定管理办法',
              type: 'LOCAL',
              status: 'PENDING_REVIEW',
              publishTime: null,
              createdBy: '李四',
              content: '为规范高新技术企业认定管理工作，促进高新技术产业发展...'
            }
          ];
          pagination.total = 3;
          loading.value = false;
        }, 500);
        
        // 实际API调用
        // const response = await PolicyService.getPolicies({
        //   page: pagination.current,
        //   size: pagination.pageSize,
        //   ...searchForm
        // });
        // 
        // if (response.success) {
        //   policyList.value = response.data.list;
        //   pagination.total = response.data.total;
        // } else {
        //   throw new Error(response.message || '获取政策列表失败');
        // }
      } catch (error) {
        console.error('获取政策列表失败:', error);
        notification.error({
          message: '获取政策列表失败',
          description: error.message || '请稍后重试'
        });
      } finally {
        loading.value = false;
      }
    };
    
    // 查询处理
    const handleSearch = () => {
      pagination.current = 1;
      fetchPolicyList();
    };
    
    // 重置查询条件
    const resetSearch = () => {
      // 重置表单
      Object.keys(searchForm).forEach(key => {
        searchForm[key] = undefined;
      });
      // 重新查询
      handleSearch();
    };
    
    // 表格变化处理
    const handleTableChange = (pag) => {
      pagination.current = pag.current;
      pagination.pageSize = pag.pageSize;
      fetchPolicyList();
    };
    
    // 刷新表格
    const refreshTable = () => {
      fetchPolicyList();
    };
    
    // 打开创建模态框
    const openCreateModal = () => {
      isEdit.value = false;
      currentPolicy.value = {};
      modalTitle.value = '新建政策';
      modalVisible.value = true;
    };
    
    // 处理编辑
    const handleEdit = (record) => {
      isEdit.value = true;
      currentPolicy.value = { ...record };
      modalTitle.value = '编辑政策';
      modalVisible.value = true;
    };
    
    // 处理查看
    const handleView = (record) => {
      currentPolicy.value = { ...record };
      detailVisible.value = true;
    };
    
    // 提交审核
    const handleSubmitForReview = async (record) => {
      try {
        // 实际API调用
        // const response = await PolicyService.submitForReview(record.id);
        // 
        // if (response.success) {
        //   notification.success({
        //     message: '提交审核成功',
        //     description: '政策已提交审核'
        //   });
        //   fetchPolicyList();
        // } else {
        //   throw new Error(response.message || '提交审核失败');
        // }
        
        // 模拟成功
        notification.success({
          message: '提交审核成功',
          description: '政策已提交审核'
        });
        fetchPolicyList();
      } catch (error) {
        console.error('提交审核失败:', error);
        notification.error({
          message: '提交审核失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 处理审核
    const handleReview = (record) => {
      currentPolicy.value = { ...record };
      reviewForm.approved = true;
      reviewForm.reason = '';
      reviewVisible.value = true;
    };
    
    // 提交审核结果
    const submitReview = async () => {
      if (!reviewForm.approved && !reviewForm.reason) {
        notification.warning({
          message: '请输入拒绝原因',
          description: '拒绝政策发布时必须提供拒绝原因'
        });
        return;
      }
      
      submitting.value = true;
      try {
        // 实际API调用
        // const response = await PolicyService.reviewPolicy(
        //   currentPolicy.value.id,
        //   reviewForm.approved,
        //   reviewForm.reason
        // );
        // 
        // if (response.success) {
        //   notification.success({
        //     message: '审核完成',
        //     description: reviewForm.approved ? '政策已通过审核' : '政策已被拒绝'
        //   });
        //   reviewVisible.value = false;
        //   fetchPolicyList();
        // } else {
        //   throw new Error(response.message || '审核提交失败');
        // }
        
        // 模拟成功
        setTimeout(() => {
          notification.success({
            message: '审核完成',
            description: reviewForm.approved ? '政策已通过审核' : '政策已被拒绝'
          });
          reviewVisible.value = false;
          fetchPolicyList();
          submitting.value = false;
        }, 500);
      } catch (error) {
        console.error('审核提交失败:', error);
        notification.error({
          message: '审核提交失败',
          description: error.message || '请稍后重试'
        });
        submitting.value = false;
      }
    };
    
    // 处理撤回
    const handleRecall = async (record) => {
      try {
        // 实际API调用
        // const response = await PolicyService.recallPolicy(record.id);
        // 
        // if (response.success) {
        //   notification.success({
        //     message: '撤回成功',
        //     description: '政策已撤回'
        //   });
        //   fetchPolicyList();
        // } else {
        //   throw new Error(response.message || '撤回失败');
        // }
        
        // 模拟成功
        notification.success({
          message: '撤回成功',
          description: '政策已撤回'
        });
        fetchPolicyList();
      } catch (error) {
        console.error('撤回失败:', error);
        notification.error({
          message: '撤回失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 处理删除
    const handleDelete = async (record) => {
      try {
        // 实际API调用
        // const response = await PolicyService.deletePolicy(record.id);
        // 
        // if (response.success) {
        //   notification.success({
        //     message: '删除成功',
        //     description: '政策已删除'
        //   });
        //   fetchPolicyList();
        // } else {
        //   throw new Error(response.message || '删除失败');
        // }
        
        // 模拟成功
        notification.success({
          message: '删除成功',
          description: '政策已删除'
        });
        fetchPolicyList();
      } catch (error) {
        console.error('删除失败:', error);
        notification.error({
          message: '删除失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 表单提交成功处理
    const handleFormSuccess = () => {
      modalVisible.value = false;
      fetchPolicyList();
    };
    
    // 关闭模态框
    const closeModal = () => {
      modalVisible.value = false;
    };
    
    // 获取状态颜色
    const getStatusColor = (status) => {
      const statusMap = {
        'DRAFT': 'blue',
        'PENDING_REVIEW': 'orange',
        'PUBLISHED': 'green',
        'EXPIRED': 'gray',
        'RECALLED': 'red'
      };
      return statusMap[status] || 'default';
    };
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'DRAFT': '草稿',
        'PENDING_REVIEW': '待审核',
        'PUBLISHED': '已发布',
        'EXPIRED': '已过期',
        'RECALLED': '已撤回'
      };
      return statusMap[status] || '未知';
    };
    
    // 获取类型颜色
    const getTypeColor = (type) => {
      const typeMap = {
        'NATIONAL': 'purple',
        'LOCAL': 'cyan',
        'INDUSTRY': 'blue',
        'PARK': 'green'
      };
      return typeMap[type] || 'default';
    };
    
    // 获取类型文本
    const getTypeText = (type) => {
      const typeMap = {
        'NATIONAL': '国家政策',
        'LOCAL': '地方政策',
        'INDUSTRY': '行业政策',
        'PARK': '园区政策'
      };
      return typeMap[type] || '未知';
    };
    
    return {
      searchForm,
      policyList,
      loading,
      pagination,
      columns,
      modalVisible,
      modalTitle,
      isEdit,
      currentPolicy,
      detailVisible,
      reviewVisible,
      reviewForm,
      submitting,
      handleSearch,
      resetSearch,
      handleTableChange,
      refreshTable,
      openCreateModal,
      handleEdit,
      handleView,
      handleSubmitForReview,
      handleReview,
      submitReview,
      handleRecall,
      handleDelete,
      handleFormSuccess,
      closeModal,
      getStatusColor,
      getStatusText,
      getTypeColor,
      getTypeText
    };
  }
});
</script>

<style scoped>
.policy-management {
  padding: 16px;
}

.content-card {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.card-title span {
  margin-left: 8px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-section {
  margin-bottom: 16px;
}

.button-section {
  display: flex;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .operation-bar {
    flex-direction: column;
  }
  
  .button-section {
    margin-top: 16px;
  }
}
</style> 