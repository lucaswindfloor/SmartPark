<template>
  <div class="activity-management">
    <a-card class="content-card" :bordered="false">
      <template #title>
        <div class="card-title">
          <calendar-outlined />
          <span>园区活动管理</span>
        </div>
      </template>
      
      <div class="operation-bar">
        <div class="search-section">
          <a-form layout="inline" :model="searchForm">
            <a-form-item label="活动名称">
              <a-input 
                v-model:value="searchForm.title" 
                placeholder="请输入活动名称" 
                allowClear
                @pressEnter="handleSearch"
              />
            </a-form-item>
            <a-form-item label="活动类型">
              <a-select
                v-model:value="searchForm.type"
                placeholder="请选择活动类型"
                style="width: 150px"
                allowClear
              >
                <a-select-option value="CULTURAL">文化活动</a-select-option>
                <a-select-option value="SPORTS">体育活动</a-select-option>
                <a-select-option value="TECHNOLOGY">科技活动</a-select-option>
                <a-select-option value="SOCIAL">社交活动</a-select-option>
                <a-select-option value="BUSINESS">商务活动</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="状态">
              <a-select
                v-model:value="searchForm.status"
                placeholder="请选择状态"
                style="width: 150px"
                allowClear
              >
                <a-select-option value="PLANNING">筹备中</a-select-option>
                <a-select-option value="REGISTERING">报名中</a-select-option>
                <a-select-option value="REGISTRATION_CLOSED">报名截止</a-select-option>
                <a-select-option value="ONGOING">进行中</a-select-option>
                <a-select-option value="COMPLETED">已结束</a-select-option>
                <a-select-option value="CANCELLED">已取消</a-select-option>
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
            新建活动
          </a-button>
          <a-button style="margin-left: 8px" @click="refreshTable">
            <template #icon><reload-outlined /></template>
            刷新
          </a-button>
        </div>
      </div>
      
      <a-table
        :dataSource="activityList"
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
                v-if="['PLANNING', 'REGISTERING'].includes(record.status)"
                type="link" 
                size="small" 
                @click="handleEdit(record)"
              >
                编辑
              </a-button>
              <a-button 
                v-if="record.status === 'REGISTERING'"
                type="link" 
                size="small" 
                @click="handleParticipants(record)"
              >
                报名管理
              </a-button>
              <a-button 
                v-if="record.status === 'PLANNING'"
                type="link" 
                size="small" 
                @click="handleStartRegistration(record)"
              >
                开始报名
              </a-button>
              <a-button 
                v-if="record.status === 'REGISTERING'"
                type="link" 
                size="small" 
                @click="handleStopRegistration(record)"
              >
                结束报名
              </a-button>
              <a-button 
                v-if="record.status === 'REGISTRATION_CLOSED'"
                type="link" 
                size="small" 
                @click="handleStartActivity(record)"
              >
                开始活动
              </a-button>
              <a-button 
                v-if="record.status === 'ONGOING'"
                type="link" 
                size="small" 
                @click="handleCompleteActivity(record)"
              >
                结束活动
              </a-button>
              <a-button 
                v-if="['PLANNING', 'REGISTERING', 'REGISTRATION_CLOSED'].includes(record.status)"
                type="link" 
                size="small" 
                danger
                @click="handleCancel(record)"
              >
                取消活动
              </a-button>
              <a-button 
                v-if="['COMPLETED', 'CANCELLED'].includes(record.status)"
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
    
    <!-- 活动表单对话框 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      width="900px"
      :footer="null"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <activity-form
        :initialData="currentActivity"
        :isEdit="isEdit"
        @success="handleFormSuccess"
        @cancel="closeModal"
      />
    </a-modal>
    
    <!-- 活动详情对话框 -->
    <a-modal
      v-model:visible="detailVisible"
      title="活动详情"
      width="800px"
      :footer="null"
      :maskClosable="true"
    >
      <activity-detail
        v-if="detailVisible" 
        :activity="currentActivity"
      />
    </a-modal>
    
    <!-- 参与者管理对话框 -->
    <a-modal
      v-model:visible="participantsVisible"
      title="报名管理"
      width="1000px"
      :footer="null"
      :maskClosable="false"
    >
      <div v-if="participantsVisible">
        <div class="modal-header">
          <h3>{{ currentActivity.title }} - 报名管理</h3>
          <div>
            <a-statistic :value="participantsList.length" title="报名人数" />
          </div>
        </div>
        
        <a-table
          :dataSource="participantsList"
          :columns="participantsColumns"
          size="middle"
          :pagination="{ pageSize: 10 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="getParticipantStatusColor(record.status)">
                {{ getParticipantStatusText(record.status) }}
              </a-tag>
            </template>
            <template v-if="column.key === 'operation'">
              <a-space>
                <a-button 
                  v-if="record.status === 'PENDING'"
                  type="link" 
                  size="small" 
                  @click="approveParticipant(record)"
                >
                  批准
                </a-button>
                <a-button 
                  v-if="record.status === 'PENDING'"
                  type="link" 
                  size="small" 
                  danger
                  @click="rejectParticipant(record)"
                >
                  拒绝
                </a-button>
                <a-button 
                  v-if="record.status === 'APPROVED'"
                  type="link" 
                  size="small" 
                  @click="checkInParticipant(record)"
                >
                  签到
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { 
  CalendarOutlined, 
  SearchOutlined, 
  ClearOutlined,
  PlusOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue';
import { notification, Modal } from 'ant-design-vue';
import ActivityForm from './components/ActivityForm.vue';
import ActivityDetail from './components/ActivityDetail.vue';

// 活动服务可以与通知服务类似，稍后实现
// import { ActivityService } from '@/services/information/activity.service';

export default defineComponent({
  name: 'ActivityManagement',
  components: {
    CalendarOutlined,
    SearchOutlined,
    ClearOutlined,
    PlusOutlined,
    ReloadOutlined,
    ActivityForm,
    ActivityDetail
  },
  setup() {
    // 搜索表单
    const searchForm = reactive({
      title: '',
      type: undefined,
      status: undefined
    });
    
    // 表格数据
    const activityList = ref([]);
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
        title: '活动名称',
        dataIndex: 'title',
        key: 'title',
        ellipsis: true
      },
      {
        title: '活动类型',
        dataIndex: 'type',
        key: 'type',
        width: 120
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 120
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 170
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 170
      },
      {
        title: '地点',
        dataIndex: 'location',
        key: 'location',
        width: 150,
        ellipsis: true
      },
      {
        title: '操作',
        key: 'operation',
        width: 350
      }
    ];
    
    // 模态框状态
    const modalVisible = ref(false);
    const modalTitle = ref('新建活动');
    const isEdit = ref(false);
    const currentActivity = ref({});
    
    // 详情模态框
    const detailVisible = ref(false);
    
    // 参与者管理模态框
    const participantsVisible = ref(false);
    const participantsList = ref([]);
    const participantsColumns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '所属部门/单位',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: '报名时间',
        dataIndex: 'registrationTime',
        key: 'registrationTime',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '签到时间',
        dataIndex: 'checkInTime',
        key: 'checkInTime',
      },
      {
        title: '操作',
        key: 'operation',
      }
    ];
    
    // 初始化加载数据
    onMounted(() => {
      fetchActivityList();
    });
    
    // 获取活动列表
    const fetchActivityList = async () => {
      loading.value = true;
      try {
        // 模拟数据，实际项目中应调用API
        setTimeout(() => {
          activityList.value = [
            {
              id: 1,
              title: '2023年度科技创新论坛',
              type: 'TECHNOLOGY',
              status: 'COMPLETED',
              startTime: '2023-05-15 09:00:00',
              endTime: '2023-05-15 17:00:00',
              location: '科技园区中心会议厅',
              description: '探讨最新科技趋势与创新方向...',
              organizer: '科技创新委员会',
              contacts: '张先生 (13800138000)',
              capacity: 200,
              registeredCount: 189
            },
            {
              id: 2,
              title: '园区企业篮球友谊赛',
              type: 'SPORTS',
              status: 'REGISTERING',
              startTime: '2023-07-20 14:00:00',
              endTime: '2023-07-22 18:00:00',
              location: '园区体育馆',
              description: '增进企业间友谊，促进员工身心健康...',
              organizer: '园区文体协会',
              contacts: '李女士 (13911112222)',
              capacity: 120,
              registeredCount: 68
            },
            {
              id: 3,
              title: '人工智能技术交流会',
              type: 'TECHNOLOGY',
              status: 'PLANNING',
              startTime: '2023-08-10 09:30:00',
              endTime: '2023-08-10 16:30:00',
              location: '创新中心多功能厅',
              description: '分享人工智能最新进展和应用案例...',
              organizer: 'AI研究中心',
              contacts: '王教授 (13522223333)',
              capacity: 150,
              registeredCount: 0
            }
          ];
          pagination.total = 3;
          loading.value = false;
        }, 500);
        
        // 实际API调用
        // const response = await ActivityService.getActivities({
        //   page: pagination.current,
        //   size: pagination.pageSize,
        //   ...searchForm
        // });
        // 
        // if (response.success) {
        //   activityList.value = response.data.list;
        //   pagination.total = response.data.total;
        // } else {
        //   throw new Error(response.message || '获取活动列表失败');
        // }
      } catch (error) {
        console.error('获取活动列表失败:', error);
        notification.error({
          message: '获取活动列表失败',
          description: error.message || '请稍后重试'
        });
      } finally {
        loading.value = false;
      }
    };
    
    // 查询处理
    const handleSearch = () => {
      pagination.current = 1;
      fetchActivityList();
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
      fetchActivityList();
    };
    
    // 刷新表格
    const refreshTable = () => {
      fetchActivityList();
    };
    
    // 打开创建模态框
    const openCreateModal = () => {
      isEdit.value = false;
      currentActivity.value = {};
      modalTitle.value = '新建活动';
      modalVisible.value = true;
    };
    
    // 处理编辑
    const handleEdit = (record) => {
      isEdit.value = true;
      currentActivity.value = { ...record };
      modalTitle.value = '编辑活动';
      modalVisible.value = true;
    };
    
    // 处理查看
    const handleView = (record) => {
      currentActivity.value = { ...record };
      detailVisible.value = true;
    };
    
    // 处理参与者管理
    const handleParticipants = async (record) => {
      currentActivity.value = { ...record };
      participantsVisible.value = true;
      
      // 加载参与者数据
      try {
        // 实际API调用
        // const response = await ActivityService.getParticipants(record.id);
        // if (response.success) {
        //   participantsList.value = response.data;
        // } else {
        //   throw new Error(response.message || '获取参与者列表失败');
        // }
        
        // 模拟数据
        participantsList.value = [
          {
            id: 1,
            name: '张三',
            phone: '13800138001',
            department: '技术部',
            registrationTime: '2023-06-15 10:23:45',
            status: 'APPROVED',
            checkInTime: null
          },
          {
            id: 2,
            name: '李四',
            phone: '13900139002',
            department: '市场部',
            registrationTime: '2023-06-15 14:12:33',
            status: 'PENDING',
            checkInTime: null
          },
          {
            id: 3,
            name: '王五',
            phone: '13700137003',
            department: '行政部',
            registrationTime: '2023-06-16 09:05:21',
            status: 'APPROVED',
            checkInTime: '2023-07-20 13:45:12'
          }
        ];
      } catch (error) {
        console.error('获取参与者列表失败:', error);
        notification.error({
          message: '获取参与者列表失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 开始报名
    const handleStartRegistration = async (record) => {
      try {
        // 实际API调用
        // const response = await ActivityService.startRegistration(record.id);
        // if (response.success) {
        //   notification.success({
        //     message: '操作成功',
        //     description: '活动已开始报名'
        //   });
        //   fetchActivityList();
        // } else {
        //   throw new Error(response.message || '开始报名失败');
        // }
        
        // 模拟成功
        notification.success({
          message: '操作成功',
          description: '活动已开始报名'
        });
        fetchActivityList();
      } catch (error) {
        console.error('开始报名失败:', error);
        notification.error({
          message: '开始报名失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 结束报名
    const handleStopRegistration = async (record) => {
      try {
        // 实际API调用
        // const response = await ActivityService.stopRegistration(record.id);
        // if (response.success) {
        //   notification.success({
        //     message: '操作成功',
        //     description: '活动报名已结束'
        //   });
        //   fetchActivityList();
        // } else {
        //   throw new Error(response.message || '结束报名失败');
        // }
        
        // 模拟成功
        notification.success({
          message: '操作成功',
          description: '活动报名已结束'
        });
        fetchActivityList();
      } catch (error) {
        console.error('结束报名失败:', error);
        notification.error({
          message: '结束报名失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 开始活动
    const handleStartActivity = async (record) => {
      try {
        // 实际API调用
        // const response = await ActivityService.startActivity(record.id);
        // if (response.success) {
        //   notification.success({
        //     message: '操作成功',
        //     description: '活动已开始'
        //   });
        //   fetchActivityList();
        // } else {
        //   throw new Error(response.message || '开始活动失败');
        // }
        
        // 模拟成功
        notification.success({
          message: '操作成功',
          description: '活动已开始'
        });
        fetchActivityList();
      } catch (error) {
        console.error('开始活动失败:', error);
        notification.error({
          message: '开始活动失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 结束活动
    const handleCompleteActivity = async (record) => {
      try {
        // 实际API调用
        // const response = await ActivityService.completeActivity(record.id);
        // if (response.success) {
        //   notification.success({
        //     message: '操作成功',
        //     description: '活动已结束'
        //   });
        //   fetchActivityList();
        // } else {
        //   throw new Error(response.message || '结束活动失败');
        // }
        
        // 模拟成功
        notification.success({
          message: '操作成功',
          description: '活动已结束'
        });
        fetchActivityList();
      } catch (error) {
        console.error('结束活动失败:', error);
        notification.error({
          message: '结束活动失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 取消活动
    const handleCancel = (record) => {
      Modal.confirm({
        title: '确认取消活动',
        content: '确定要取消该活动吗？取消后将无法恢复。',
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            // 实际API调用
            // const response = await ActivityService.cancelActivity(record.id);
            // if (response.success) {
            //   notification.success({
            //     message: '操作成功',
            //     description: '活动已取消'
            //   });
            //   fetchActivityList();
            // } else {
            //   throw new Error(response.message || '取消活动失败');
            // }
            
            // 模拟成功
            notification.success({
              message: '操作成功',
              description: '活动已取消'
            });
            fetchActivityList();
          } catch (error) {
            console.error('取消活动失败:', error);
            notification.error({
              message: '取消活动失败',
              description: error.message || '请稍后重试'
            });
          }
        }
      });
    };
    
    // 删除活动
    const handleDelete = (record) => {
      Modal.confirm({
        title: '确认删除活动',
        content: '确定要删除该活动吗？删除后将无法恢复。',
        okText: '确认',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          try {
            // 实际API调用
            // const response = await ActivityService.deleteActivity(record.id);
            // if (response.success) {
            //   notification.success({
            //     message: '删除成功',
            //     description: '活动已删除'
            //   });
            //   fetchActivityList();
            // } else {
            //   throw new Error(response.message || '删除失败');
            // }
            
            // 模拟成功
            notification.success({
              message: '删除成功',
              description: '活动已删除'
            });
            fetchActivityList();
          } catch (error) {
            console.error('删除失败:', error);
            notification.error({
              message: '删除失败',
              description: error.message || '请稍后重试'
            });
          }
        }
      });
    };
    
    // 批准参与者
    const approveParticipant = async (record) => {
      try {
        // 实际API调用
        // const response = await ActivityService.approveParticipant(currentActivity.value.id, record.id);
        // if (response.success) {
        //   notification.success({
        //     message: '操作成功',
        //     description: '已批准参与者报名'
        //   });
        //   handleParticipants(currentActivity.value);
        // } else {
        //   throw new Error(response.message || '批准失败');
        // }
        
        // 模拟成功
        notification.success({
          message: '操作成功',
          description: '已批准参与者报名'
        });
        
        // 更新列表中的状态
        const index = participantsList.value.findIndex(p => p.id === record.id);
        if (index !== -1) {
          participantsList.value[index].status = 'APPROVED';
        }
      } catch (error) {
        console.error('批准失败:', error);
        notification.error({
          message: '批准失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 拒绝参与者
    const rejectParticipant = async (record) => {
      try {
        // 实际API调用
        // const response = await ActivityService.rejectParticipant(currentActivity.value.id, record.id);
        // if (response.success) {
        //   notification.success({
        //     message: '操作成功',
        //     description: '已拒绝参与者报名'
        //   });
        //   handleParticipants(currentActivity.value);
        // } else {
        //   throw new Error(response.message || '拒绝失败');
        // }
        
        // 模拟成功
        notification.success({
          message: '操作成功',
          description: '已拒绝参与者报名'
        });
        
        // 更新列表中的状态
        const index = participantsList.value.findIndex(p => p.id === record.id);
        if (index !== -1) {
          participantsList.value[index].status = 'REJECTED';
        }
      } catch (error) {
        console.error('拒绝失败:', error);
        notification.error({
          message: '拒绝失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 签到参与者
    const checkInParticipant = async (record) => {
      try {
        // 实际API调用
        // const response = await ActivityService.checkInParticipant(currentActivity.value.id, record.id);
        // if (response.success) {
        //   notification.success({
        //     message: '操作成功',
        //     description: '参与者已签到'
        //   });
        //   handleParticipants(currentActivity.value);
        // } else {
        //   throw new Error(response.message || '签到失败');
        // }
        
        // 模拟成功
        notification.success({
          message: '操作成功',
          description: '参与者已签到'
        });
        
        // 更新列表中的状态
        const index = participantsList.value.findIndex(p => p.id === record.id);
        if (index !== -1) {
          participantsList.value[index].checkInTime = new Date().toLocaleString();
        }
      } catch (error) {
        console.error('签到失败:', error);
        notification.error({
          message: '签到失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 表单提交成功处理
    const handleFormSuccess = () => {
      modalVisible.value = false;
      fetchActivityList();
    };
    
    // 关闭模态框
    const closeModal = () => {
      modalVisible.value = false;
    };
    
    // 获取状态颜色
    const getStatusColor = (status) => {
      const statusMap = {
        'PLANNING': 'blue',
        'REGISTERING': 'green',
        'REGISTRATION_CLOSED': 'orange',
        'ONGOING': 'purple',
        'COMPLETED': 'gray',
        'CANCELLED': 'red'
      };
      return statusMap[status] || 'default';
    };
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'PLANNING': '筹备中',
        'REGISTERING': '报名中',
        'REGISTRATION_CLOSED': '报名截止',
        'ONGOING': '进行中',
        'COMPLETED': '已结束',
        'CANCELLED': '已取消'
      };
      return statusMap[status] || '未知';
    };
    
    // 获取类型颜色
    const getTypeColor = (type) => {
      const typeMap = {
        'CULTURAL': 'magenta',
        'SPORTS': 'green',
        'TECHNOLOGY': 'blue',
        'SOCIAL': 'cyan',
        'BUSINESS': 'purple'
      };
      return typeMap[type] || 'default';
    };
    
    // 获取类型文本
    const getTypeText = (type) => {
      const typeMap = {
        'CULTURAL': '文化活动',
        'SPORTS': '体育活动',
        'TECHNOLOGY': '科技活动',
        'SOCIAL': '社交活动',
        'BUSINESS': '商务活动'
      };
      return typeMap[type] || '未知';
    };
    
    // 获取参与者状态颜色
    const getParticipantStatusColor = (status) => {
      const statusMap = {
        'PENDING': 'orange',
        'APPROVED': 'green',
        'REJECTED': 'red',
        'CANCELLED': 'gray'
      };
      return statusMap[status] || 'default';
    };
    
    // 获取参与者状态文本
    const getParticipantStatusText = (status) => {
      const statusMap = {
        'PENDING': '待审核',
        'APPROVED': '已批准',
        'REJECTED': '已拒绝',
        'CANCELLED': '已取消'
      };
      return statusMap[status] || '未知';
    };
    
    return {
      searchForm,
      activityList,
      loading,
      pagination,
      columns,
      modalVisible,
      modalTitle,
      isEdit,
      currentActivity,
      detailVisible,
      participantsVisible,
      participantsList,
      participantsColumns,
      handleSearch,
      resetSearch,
      handleTableChange,
      refreshTable,
      openCreateModal,
      handleEdit,
      handleView,
      handleParticipants,
      handleStartRegistration,
      handleStopRegistration,
      handleStartActivity,
      handleCompleteActivity,
      handleCancel,
      handleDelete,
      approveParticipant,
      rejectParticipant,
      checkInParticipant,
      handleFormSuccess,
      closeModal,
      getStatusColor,
      getStatusText,
      getTypeColor,
      getTypeText,
      getParticipantStatusColor,
      getParticipantStatusText
    };
  }
});
</script>

<style scoped>
.activity-management {
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
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