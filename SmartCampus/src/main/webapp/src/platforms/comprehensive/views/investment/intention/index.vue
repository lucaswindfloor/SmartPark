<template>
  <div class="intention-page">
    <a-card>
      <a-form
        ref="formRef"
        :model="searchForm"
        layout="inline"
        style="margin-bottom: 16px"
      >
        <a-row :gutter="[16, 16]" style="width: 100%">
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="园区" name="park">
              <a-select
                v-model:value="searchForm.park"
                placeholder="请选择园区"
                style="width: 100%"
              >
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="创意园">创意园</a-select-option>
                <a-select-option value="科技园">科技园</a-select-option>
                <a-select-option value="文化园">文化园</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="意向编码" name="code">
              <a-input v-model:value="searchForm.code" placeholder="请输入意向编码" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="客户名称" name="customerName">
              <a-input v-model:value="searchForm.customerName" placeholder="请输入客户名称" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="客户类型" name="customerType">
              <a-select
                v-model:value="searchForm.customerType"
                placeholder="请选择客户类型"
                style="width: 100%"
              >
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="企业">企业</a-select-option>
                <a-select-option value="个人">个人</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="意向类型" name="intentionType">
              <a-select
                v-model:value="searchForm.intentionType"
                placeholder="请选择意向类型"
                style="width: 100%"
              >
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="房间">房间</a-select-option>
                <a-select-option value="工位">工位</a-select-option>
                <a-select-option value="房间、工位">房间、工位</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="状态" name="status">
              <a-select
                v-model:value="searchForm.status"
                placeholder="请选择状态"
                style="width: 100%"
              >
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="待分配">待分配</a-select-option>
                <a-select-option value="跟进中">跟进中</a-select-option>
                <a-select-option value="已签约">已签约</a-select-option>
                <a-select-option value="已关闭">已关闭</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="创建时间" name="createTime">
              <a-range-picker
                v-model:value="searchForm.createTime"
                style="width: 100%"
                :placeholder="['开始日期', '结束日期']"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" style="text-align: right">
            <a-button type="primary" @click="handleSearch">
              <template #icon><search-outlined /></template>
              搜索
            </a-button>
            <a-button style="margin-left: 8px" @click="handleReset">
              <template #icon><rollback-outlined /></template>
              重置
            </a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-divider style="margin: 16px 0" />

      <div class="table-operations" style="margin-bottom: 16px">
        <a-button type="primary" @click="handleAdd">
          <template #icon><plus-outlined /></template>
          新增意向
        </a-button>
        <a-button style="margin-left: 8px" @click="handleAssign" :disabled="!hasSelected">
          <template #icon><user-switch-outlined /></template>
          分配跟进人
        </a-button>
        <a-button danger style="margin-left: 8px" @click="handleDelete" :disabled="!hasSelected">
          <template #icon><delete-outlined /></template>
          批量删除
        </a-button>
        <a-button style="margin-left: 8px">
          <template #icon><download-outlined /></template>
          导出
        </a-button>
        <a-button style="margin-left: 8px">
          <template #icon><upload-outlined /></template>
          导入
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        :loading="loading"
        row-key="key"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-if="column.key === 'operation'">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-if="record.status === '待分配'" key="assign" @click="handleRowAssign(record)">
                    <user-switch-outlined /> 分配跟进人
                  </a-menu-item>
                  <a-menu-item key="edit" @click="handleRowEdit(record)">
                    <edit-outlined /> 编辑
                  </a-menu-item>
                  <a-menu-item key="delete" @click="handleRowDelete(record)">
                    <delete-outlined /> 删除
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button type="link">
                <ellipsis-outlined /> 操作
              </a-button>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增意向对话框 -->
    <a-modal
      v-model:visible="addModalVisible"
      title="新增意向"
      @ok="handleAddConfirm"
      @cancel="addModalVisible = false"
    >
      <p>新增意向表单内容</p>
      <!-- 这里可以增加表单内容 -->
    </a-modal>

    <!-- 分配跟进人对话框 -->
    <a-modal
      v-model:visible="assignModalVisible"
      title="分配跟进人"
      @ok="handleAssignConfirm"
      @cancel="assignModalVisible = false"
    >
      <p>分配跟进人表单内容</p>
      <!-- 这里可以增加表单内容 -->
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  SettingOutlined,
  SearchOutlined,
  UserSwitchOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
  EllipsisOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue';

// 表单数据
const searchForm = reactive({
  park: 'all',
  code: '',
  customerName: '',
  customerType: 'all',
  intentionType: 'all',
  status: 'all',
  createTime: []
});

// 表格列定义
const columns = [
  { title: '园区', dataIndex: 'park', key: 'park' },
  { title: '意向编码', dataIndex: 'code', key: 'code' },
  { title: '客户名称', dataIndex: 'customerName', key: 'customerName' },
  { title: '客户类型', dataIndex: 'customerType', key: 'customerType' },
  { title: '意向类型', dataIndex: 'intentionType', key: 'intentionType' },
  { title: '意向物业', dataIndex: 'intentionProperty', key: 'intentionProperty' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '跟进人', dataIndex: 'followPerson', key: 'followPerson' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'operation' }
];

// 模拟数据
const dataSource = [
  {
    key: '1',
    park: '创意园',
    code: 'YX20241001',
    customerName: '丹娜生物',
    customerType: '企业',
    intentionType: '房间、工位',
    intentionProperty: '楼栋：C1栋',
    createTime: '2024-09-01 11:11:11',
    followPerson: '—',
    status: '待分配',
  },
  {
    key: '2',
    park: '科技园',
    code: 'YX20241002',
    customerName: '长沙数智科技',
    customerType: '企业',
    intentionType: '房间',
    intentionProperty: '楼栋：A1栋，楼层：3层',
    createTime: '2024-09-02 09:30:00',
    followPerson: '张三',
    status: '跟进中',
  },
  {
    key: '3',
    park: '文化园',
    code: 'YX20241003',
    customerName: '湘江设计工作室',
    customerType: '个人',
    intentionType: '工位',
    intentionProperty: '楼栋：B2栋，楼层：5层',
    createTime: '2024-09-03 14:25:10',
    followPerson: '李四',
    status: '跟进中',
  },
  {
    key: '4',
    park: '创意园',
    code: 'YX20241004',
    customerName: '湘江智能制造',
    customerType: '企业',
    intentionType: '房间',
    intentionProperty: '楼栋：C2栋，楼层：2层，房号：201',
    createTime: '2024-09-04 10:05:22',
    followPerson: '—',
    status: '待分配',
  },
  {
    key: '5',
    park: '科技园',
    code: 'YX20241005',
    customerName: '王小明',
    customerType: '个人',
    intentionType: '工位',
    intentionProperty: '楼栋：A3栋，楼层：4层',
    createTime: '2024-09-05 15:40:18',
    followPerson: '王五',
    status: '已签约',
  }
];

// 状态变量
const loading = ref(false);
const selectedRowKeys = ref([]);
const addModalVisible = ref(false);
const assignModalVisible = ref(false);
const formRef = ref(); // 表单引用，修改名称避免与响应式对象冲突

// 计算属性
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

// 处理搜索表单提交
const handleSearch = () => {
  console.log('搜索条件:', searchForm);
  // 实际应用中这里会调用API进行搜索
  message.success('查询成功');
};

// 重置搜索表单
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 处理表格行选择
const onSelectChange = (newSelectedRowKeys) => {
  selectedRowKeys.value = newSelectedRowKeys;
};

// 处理新增按钮点击
const handleAdd = () => {
  addModalVisible.value = true;
};

// 处理分配按钮点击
const handleAssign = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要分配的意向');
    return;
  }
  assignModalVisible.value = true;
};

// 处理删除按钮点击
const handleDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的意向');
    return;
  }
  
  // 使用Modal.confirm
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条意向记录吗？`,
    onOk() {
      message.success(`成功删除 ${selectedRowKeys.value.length} 条记录`);
      selectedRowKeys.value = [];
    }
  });
};

// 处理单行分配按钮点击
const handleRowAssign = (record) => {
  selectedRowKeys.value = [record.key];
  assignModalVisible.value = true;
};

// 处理单行编辑按钮点击
const handleRowEdit = (record) => {
  message.info(`编辑意向: ${record.code}`);
};

// 处理单行删除按钮点击
const handleRowDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除意向 ${record.code} 吗？`,
    onOk() {
      message.success(`成功删除意向 ${record.code}`);
    }
  });
};

// 处理确认新增
const handleAddConfirm = () => {
  message.success('新增意向成功');
  addModalVisible.value = false;
};

// 处理确认分配
const handleAssignConfirm = () => {
  message.success(`成功分配 ${selectedRowKeys.value.length} 条意向记录`);
  assignModalVisible.value = false;
};

// 获取状态标签颜色
const getStatusColor = (status) => {
  switch (status) {
    case '待分配':
      return 'orange';
    case '跟进中':
      return 'blue';
    case '已签约':
      return 'green';
    case '已关闭':
      return 'red';
    default:
      return 'default';
  }
};
</script>

<style scoped>
.intention-page {
  padding: 24px;
}
.table-operations {
  margin-bottom: 16px;
}
</style> 